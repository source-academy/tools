const _ = require('lodash');
const csv = require('csv/lib/sync');
const fs = require('fs');
const LZString = require('lz-string');
const nodemailer = require('nodemailer');

//--------------
// Configuration
//--------------
const username = process.env.AWS_ACCESS_KEY_ID;
const password = process.env.AWS_SECRET_ACCESS_KEY;

const isTesting = !!process.env.IS_TESTING;
const smtpHost = 'email-smtp.us-west-2.amazonaws.com';
const smtpPort = 465;
const smtpSecure = true;

async function createTransporter(isTesting=false) {
    const auth = isTesting ? await nodemailer.createTestAccount() : { user, pass };
    const smtpConfig = isTesting 
                        ? { auth, host: 'smtp.ethereal.email', port: 587, secure: false }
                        : { auth, host: smtpHost, port: smtpPort, secure: smtpSecure };

    return nodemailer.createTransport(smtpConfig);
}

//-------------
// Send Email
//-------------
const submissions_2d = require('./submissions/2d_contest');
const submissions_3d = require('./submissions/3d_contest');
const submissions_curve = require('./submissions/curve_contest');
const submissions_sound = require('./submissions/sound_contest');

const groups = [
  { name: 'Beautiful Runes', submissions: submissions_2d, fn: 'two_d_contest_', url: 'https://goo.gl/forms/UxAYYLbTPHd3GEmc2' },
  { name: '3D Runes', submissions: submissions_3d, fn: 'three_d_contest_', url: 'https://goo.gl/forms/GfzG0sPQRbpp3xdt2' },
  { name: 'The Choreographer', submissions: submissions_curve, fn: 'curve_contest_', url: 'https://goo.gl/forms/rxQ4NqYAxVzk5nqI3' },
  { name: 'A Game of Tones', submissions: submissions_sound, fn: 'sound_contest_', url: 'https://goo.gl/forms/6QG2ivyh8rNC807R2' }
];

let throttleIndex = 0;
const student_selections = csv.parse(fs.readFileSync('./students/cs1101s_selections.csv').toString(), { columns: true });
createTransporter()
.then(transporter => {
    student_selections.forEach(student => {
        const recipients = student['Email'];
        const group = groups.filter(group => group.name === student.group)[0];

        const targetIds = student.submissions.split(', ').map(Number);
        const urls = targetIds.map(targetId => group.submissions.find(submission => submission.student.id === targetId)).map(submission => submission.url);
        const redefinedUrls = urls.map((url, i) => {
            const [head, ...tail] = url.split('prgrm=');
            const prgrm = tail.join('prgrm=');
            const searchRegExp = new RegExp(`${group.fn}\\d+`, 'g');
            const replaceString = `${group.fn}entry_${i + 1}`;
            const originalPrgrm = LZString.decompressFromEncodedURIComponent(prgrm);
            const modifiedPrgrm = originalPrgrm.replace(searchRegExp, replaceString);
            const redefinedPrgrm = LZString.compressToEncodedURIComponent(modifiedPrgrm);
            return `${head}prgrm=${redefinedPrgrm}`;
        });

        const mailOptions = {
            from: 'cs1101s@comp.nus.edu.sg',
            to: recipients.join(', '),
            cc: 'cs1101s@comp.nus.edu.sg',
            subject: `The Most Rhapsodic Tones`,
            html: `
    Dear CS1101S student,<br/>
    <br/>
    You have been assigned 10 entries of the same contest to rank in order of 1st to 10th! 
    Please review these entries by clicking on them. They will open the Academy Playground. 
    To hear the sound, you may need to add one of the following two statements<br/>
    <b>play(sound_contest_entry_x());</b><br/>
    , where <b>x</b> is the entry number.<br/>
    <br/>
    Then please click on <a href=${group.url}>&lt;this link&gt;</a> to enter your preferences 
    in the order of your preference, from most preferred 1st to least preferred 10th. 
    Make sure there is exactly one tick in each row and column. You may need to scroll to see 
    the last column.<br/>
    <br/>
    Assigned contest entries:<br/>
    ${redefinedUrls.map((url, i) => `<a href="${encodeURI(url)}">Entry ${i + 1}</a>&nbsp;&nbsp;`).join('<br/>')}<br/>
    <br/>
    You may need to refresh your browser to activate the contest library in the playground. 
    In Chrome: History &gt; Show Full History &gt; Clear browsing data<br/>
    <br/>
    For technical issues regarding the voting, please use the piazza folder "contest_voting":
    <a href="https://piazza.com/class/jg1gbtzfzh816w?cid=527">https://piazza.com/class/jg1gbtzfzh816w?cid=527</a><br/>
    <br/>
    <b>You will be awarded 300 XP for voting.</b><br/>
    <br/>
    Best regards,<br/>
    <br/>
    Your CS1101S Team
    `
        };

        setTimeout(() => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log(info);
            });
        }, throttleIndex * 1000);
        throttleIndex += 1;
    });
});

