const _ = require('lodash');
const csv = require('csv/lib/sync');
const fs = require('fs');

const submissions_2d = require('./submissions/2d_contest');
const submissions_3d = require('./submissions/3d_contest');
const submissions_curve = require('./submissions/curve_contest');
const submissions_sound = require('./submissions/sound_contest');

const groups = [
  { name: 'Beautiful Runes', submissions: submissions_2d },
  { name: '3D Runes', submissions: submissions_3d },
  { name: 'The Choreographer', submissions: submissions_curve },
  { name: 'A Game of Tones', submissions: submissions_sound }
];

const students = csv.parse(fs.readFileSync('./students/cs1101s_all_students.csv').toString(), { columns: true });
const maximumSizePerGroup = Math.ceil(students.length / groups.length);

// Assign students to groups
groups.forEach(group => group.remainingSlots = maximumSizePerGroup);

students.forEach(student => {
  const remainingGroups = groups.filter(group => group.remainingSlots > 0);
  const selection = remainingGroups[Math.floor(Math.random() * remainingGroups.length)];
  selection.remainingSlots -= 1;
  student.group = selection.name;
  student.submissions = [];
});

// Assign students to submissions
const votesPerVoters = 10;
groups.forEach(group => {
  const numberOfVoters = students.filter(student => student.group === group.name).length;
  const maximumVotersPerSubmission = Math.ceil((numberOfVoters * votesPerVoters) / group.submissions.length);
  group.submissions.forEach(submission => submission.remainingSlots = maximumVotersPerSubmission);
});

students.forEach(student => {
  const group = groups.filter(group => group.name === student.group)[0];
  let remainingSubmissions = group.submissions.filter(submission => {
    return submission.remainingSlots > 0 && submission.student.name !== student['Name']
  });

  _.range(votesPerVoters).forEach(() => {
    if (remainingSubmissions.length === 0) {
      console.warn(`Unable to pick anymore submissions for ${student['Name']}`);
      return;
    }
    const selection = remainingSubmissions[Math.floor(Math.random() * remainingSubmissions.length)];
    remainingSubmissions = remainingSubmissions.filter(submission => submission !== selection);
    selection.remainingSlots -=1;

    const targetStudentId = selection.student.id;
    student.submissions.push(targetStudentId);
  });

  // Make sure everything is single layer nested
  student.submissions = student.submissions.join(", ");
});

fs.writeFileSync('./students/cs1101s_selections.csv', csv.stringify(students, { header: true, columns: Object.keys(students[0]) }));


