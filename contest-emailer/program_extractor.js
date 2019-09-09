const fetch = require('node-fetch');
const LZString = require('lz-string');

const accessToken = process.env.ACCESS_TOKEN;
//const accessToken = JSON.parse(LZString.decompressFromUTF16(localStorage.storedState)).session.accessToken;

const chapter = 2;
const assessmentTitle = 'A Game of Tones';
const extraLibrary = 'SOUND';
const contestFunction = 'sound_contest_';
const contestFunctionPattern = /[_$a-zA-Z0-9<>]+_sound_contest/g;

async function getRelevantSubmissions() {
  const response = await fetch('https://api.sourceacademy.nus.edu.sg/v1/grading?group=false', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  const submissions = await response.json();

  return submissions.filter(submission => submission.assessment.title === assessmentTitle);
}

async function getRelevantAnswer(submission) {
  const student = submission.student;
  const response = await fetch(`https://api.sourceacademy.nus.edu.sg/v1/grading/${submission.id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  const attempt = await response.json();
  const answer = attempt[0].question.answer;

  return { answer, student };
}

function anonymizeAnswer(submission) {
  const answer = submission.answer;
  const student = submission.student;
  const identifier = `${contestFunction}${student.id}`;
  const anonymizedAnswer = answer.replace(contestFunctionPattern, identifier);

  return { answer: anonymizedAnswer, student };
}

function stripComments(submission) {
  const answer = submission.answer;
  const multiCommentRegex = /\/\*(.|\n)*?\*\//g;
  const singleCommentRegex = /\/\/(?:.*?)\n/g;
  const strippedAnswer = (answer + '\n').replace(multiCommentRegex, '').replace(singleCommentRegex, '');

  return { answer: strippedAnswer, student: submission.student };
}

function hasReturnValue(submission) {
  return submission.answer.includes('return');
}

function generateURL(submission) {
  const answer = submission.answer;
  const url = `https://sourceacademy.nus.edu.sg/playground#chap=${chapter}&ext=${extraLibrary}&prgrm=${LZString.compressToEncodedURIComponent(answer)}`;
  return { url, student: submission.student };
}

let result;
getRelevantSubmissions()
.then(submissions => Promise.all(submissions.map(getRelevantAnswer)))
.then(submissions => submissions.map(anonymizeAnswer))
.then(submissions => submissions.map(stripComments))
.then(submissions => submissions.filter(hasReturnValue))
.then(submissions => submissions.map(generateURL))
.then(submissions => {
  result = submissions;
  console.log('Processing done!');
});
