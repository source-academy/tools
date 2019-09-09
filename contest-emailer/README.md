Note: This repository needs cleanup

## Pre-requisites
 - Update the files inside the students folder first.
 - An AWS Access Key ID and AWS Secret Key with SES permission is required

## Program Extractor
Run this to extract contest submissions and anonymize them.

## Generate Assignment
Run this program to, given all students in the students folder and submissions in the submissions folder, return an assignment of student to contest group + contest submission ids

## Assignment Verifier
Run this program to ensure that all submissions have roughly an equal number of voters

## Email Sender
Run this program to, given all assignment in the students folder and submissions in the submissions folder, send email to individual students with their assigned submissions

## Voting Verifier
Run this program to, given all votes in the voting folder, ensure that no student has engaged in bad voting, and print the most popular and winners of the contests