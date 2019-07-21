const _ = require('lodash');
const csv = require('csv/lib/sync');
const fs = require('fs');

const student_selections = csv.parse(fs.readFileSync('./students/cs1101s_selections.csv').toString(), { columns: true });
const groupCountMap = new Map();

student_selections.forEach(selection => {
  if (!groupCountMap.has(selection.group)) {
    groupCountMap.set(selection.group, 0);
  }
  groupCountMap.set(selection.group, groupCountMap.get(selection.group) + 1);
});

[...groupCountMap.entries()].forEach(groupCount => {
  const [group, count] = groupCount;
  console.log(`${group}: ${count} voters`);
});

const submissions_2d = require('./submissions/2d_contest');
const submissions_3d = require('./submissions/3d_contest');
const submissions_curve = require('./submissions/curve_contest');
const submissions_sound = require('./submissions/sound_contest');

const groups = [
  { name: 'Beautiful Runes', submissions: submissions_2d, fn: 'two_d_contest_', url: 'https://goo.gl/forms/UxAYYLbTPHd3GEmc2' },
  { name: '3D Runes', submissions: submissions_3d, fn: 'three_d_contest_', url: 'https://goo.gl/forms/GfzG0sPQRbpp3xdt2' },
  { name: 'The Choreographer', submissions: submissions_curve, fn: 'curve_contest_', url: 'https://goo.gl/forms/rxQ4NqYAxVzk5nqI3' },
  { name: 'A Game of Tones', submissions: submissions_sound, fn: 'sound_contest_', url: '' }
];

groups.forEach(group => {
  const selectedStudents = student_selections.filter(selection => selection.group === group.name);
  const targetIdCountMap = new Map();
  selectedStudents.forEach(selection => {
    const targetIds = selection.submissions.split(', ').map(Number);
    targetIds.forEach(targetId => {
      if (!targetIdCountMap.has(targetId)) {
        targetIdCountMap.set(targetId, 0);
      }
      targetIdCountMap.set(targetId, targetIdCountMap.get(targetId) + 1);
    });
  });

  console.log(group.name);
  [...targetIdCountMap.entries()].forEach(targetIdCount => {
    const [targetId, count] = targetIdCount;
    console.log(`Student ID ${targetId}: ${count} voters`);
  });
});
