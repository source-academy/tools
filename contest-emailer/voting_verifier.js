const _ = require('lodash');
const csv = require('csv/lib/sync');
const fs = require('fs');
const Lexer = require('lex');
const LZString = require('lz-string');

const studentSelections = csv.parse(fs.readFileSync('./students/cs1101s_selections.csv').toString(), { columns: true });
const studentNumberToGroup = new Map(studentSelections.map(selection => {
  return [selection['Student Number'], selection.group];
}));

const headers = () => {
  return ['datetime', 'email', 'student number', ...(_.range(1, 11).map(i => `E${i}`))];
};
const rankingToScoreMap = new Map([
  ['1st', 10],
  ['2nd', 9],
  ['3rd', 8],
  ['4th', 7],
  ['5th', 6],
  ['6th', 5],
  ['7th', 4],
  ['8th', 3],
  ['9th', 2],
  ['10th', 1]
]);

const votingGroupToNames = new Map([
  ['2D Runes', 'Beautiful Runes'], 
  ['3D Runes', '3D Runes'], 
  ['Curve', 'The Choreographer'],
  ['Sound', 'A Game of Tones']
]);
const votingGroups = [...votingGroupToNames.keys()];
const groupToVotingsMap = new Map(votingGroups.map(votingGroup => {
  const filename = `./votings/${votingGroup} Contest Voting.csv`;
  const votes = csv.parse(fs.readFileSync(filename).toString(), { columns: headers })
  .map(vote => {
    return _.mapValues(vote, (value, key) => {
      if (key === 'datetime') {
        return new Date(value);
      } else if (/E\d/.test(key)) {
        return rankingToScoreMap.get(value);
      } else {
        return value;
      }
    });
  });

  // Verify that students vote only once + warn otherwise
  const votesPerStudentCount = _.countBy(votes, (vote) => vote['student number']);
  console.log(`Group: ${votingGroup}`);
  Object.keys(votesPerStudentCount).forEach(key => {
    if (votesPerStudentCount[key] > 1) {
      console.warn(`${key} voted ${votesPerStudentCount[key]} times!`);
    }
  });
  console.log(`Will take only the latest votes from each student...\n`);

  // Take latest votes from each student
  const reverseSortedUniqueVotes = _.uniqBy(_.reverse(_.sortBy(votes, (vote) => vote.datetime)), vote => vote['student number']);

  // Verify that students vote for the right group + warn otherwise
  const validVotes = reverseSortedUniqueVotes.filter(vote => {
    const studentNumber = vote['student number'];
    const hasAssignedGroup = studentNumberToGroup.has(studentNumber);
    if (!hasAssignedGroup) {
      console.warn(`${studentNumber} does not have an assigned group!`);
      return false;
    }

    const votedGroup = votingGroupToNames.get(votingGroup);
    const assignedGroup = studentNumberToGroup.get(studentNumber);
    const isInAssignedGroup = votedGroup === assignedGroup;
    if (!isInAssignedGroup) {
      console.warn(`${studentNumber} voted for ${votedGroup} but was assigned ${assignedGroup}`);
      return false;
    }

    return true;
  });

  
  return [votingGroup, validVotes];
}));

const submissions_2d = require('./submissions/2d_contest');
const submissions_3d = require('./submissions/3d_contest');
const submissions_curve = require('./submissions/curve_contest');
const submissions_sound = require('./submissions/sound_contest');

const submissionGroups = [
  { name: 'Beautiful Runes', submissions: submissions_2d },
  { name: '3D Runes', submissions: submissions_3d },
  { name: 'The Choreographer', submissions: submissions_curve },
  { name: 'A Game of Tones', submissions: submissions_sound }
];

const countTokens = (program) => {
    var operators = [
        '+', '-', '*', '/', '%', '!=', '==', '<', '>', '<=', '>=', '=',
        '+=', '-=', '*=', '%=', '<<', '>>', '>>>', '<<=', '>>=',
        '>>>=', '&', '&=', '|', '|=', '&&', '||', '^', '^=', '(', ')',
        '[', ']', '{', '}', '!', '--', '++', '~', ',', ';', '.', ':', '?'
    ].sort((x, y) => y.length - x.length);
 
    var row = 0;
    var col = 0;
    var tokenCount = 0;
 
    function logToken(errType, tokenCount, val) {
        //console.log(errType, tokenCount, val)
    }
 
    var lexer = (new Lexer(function() { /* console.log('Error at ' + col + ':' + row + ':'); console.log(arguments); */ }))
    .addRule(/(\r\n|\n|\r)/, function() { this.reject = true; row++; col = 1; }, [])
    .addRule(/./, function() { this.reject = true; col++; }, [])
    .addRule(/\s+/, function() {}) // None
    .addRule(/<!--.*/, function() {}) // None
    .addRule(new RegExp('//.*'), function() {}) // Line Comment
    .addRule(new RegExp('/\\*.*?\\*/', 'm'), function() {}) // Multi-line Comment
    .addRule(/[\w$_][\w\d$_.]*[\w\d$_.]/, function(val) { tokenCount += (val.split('.').length * 2 - 1); val.split('.').map(x => logToken('D', tokenCount, x)) }) // Dotted Name
    .addRule(/[\w$_][\w\d$_]*/, function(val) { tokenCount++; logToken('N', tokenCount, val)}) // Name
    .addRule(/(?:0|[1-9]\d*)(\.\d+)/, function(val) { tokenCount++; logToken('0', tokenCount, val)}) // Number
    .addRule(new RegExp(operators.map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')), function(val) { tokenCount++; logToken('O', tokenCount, val)}) // Operator
    .addRule(/( \'(?:[^\'\\]*(?:\\.[^\'\\]*)*)\' | "(?:[^"\\]*(?:\\.[^"\\]*)*)" )/, function(val) { tokenCount++; logToken('S', tokenCount, val)}) // String
 
    lexer.setInput(program);
    lexer.lex();
 
    return tokenCount;
};

submissionGroups.forEach(submissionGroup => {
  const submissions = submissionGroup.submissions;
  submissions.forEach(submission => {
    const [head, ...compressedPrograms] = submission.url.split('prgrm=');
    const compressedProgram = compressedPrograms.join('prgrm=');
    const program = LZString.decompressFromEncodedURIComponent(compressedProgram);
    const tokens = program.length > 100000 ? Infinity : countTokens(program);

    submission.sumScore = 0;
    submission.tokens = tokens;
    submission.votes = 0;
  });
});

[...groupToVotingsMap.entries()].forEach(([group, votes]) => {
  const groupName = votingGroupToNames.get(group);
  const submissions = _.find(submissionGroups, submissionGroup => {
    return submissionGroup.name === groupName;
  }).submissions;

  votes.forEach(vote => {
    const studentNumber = vote['student number'];
    const assignedEntries = _.find(studentSelections, selection => { 
      return selection['Student Number'] === studentNumber;
    }).submissions.split(', ').map(Number);

    assignedEntries.forEach((entryId, i) => {
      const score = vote[`E${i + 1}`];
      const submission = _.find(submissions, submission => {
        return submission.student.id === entryId;
      });
      submission.sumScore += score;
      submission.votes += 1;
    });
  });
});

submissionGroups.forEach(submissionGroup => {
  const submissions = submissionGroup.submissions;
  submissions.forEach(submission => {
    const rawScore = submission.sumScore / submission.votes * 10;
    const finalScore = rawScore - Math.pow(2, submission.tokens / 50);
    submission.rawScore = rawScore;
    submission.finalScore = finalScore;
  });

  const popularEntries = _.reverse(_.sortBy(submissions, submission => submission.rawScore)).slice(0, 3);
  const winningEntries = _.reverse(_.sortBy(submissions, submission => submission.finalScore)).slice(0, 3);

  console.log(`${submissionGroup.name} (Winners): `);
  console.log(winningEntries.map(entry => JSON.stringify(entry, null, '\t')).join('\n') + '\n');
  console.log(`${submissionGroup.name} (Most Popular): `);
  console.log(popularEntries.map(entry => JSON.stringify(entry, null, '\t')).join('\n') + '\n');
});
