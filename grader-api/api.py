#! /usr/bin/env python3

import json, os, ssl, sys, urllib.request

DEBUG = False
HELP = """\
usage: ./api.py student_file grader_files... [-c chapter]
  student_file: file containing a program written by the student
  grader_files: files containing a program used to grade the student's program
                runs in the scope of the student_file; the last statement
                of each grader_file should return a number
  chapter:      number between 1 and 2, defaults to 2; this is the chapter number
                of the source language to use

Examples:
  ./api.py student.js grader.js
  ./api.py student.js grader.js -c 1
  ./api.py student.js grader1.js grader2.js grader3.js
  ./api.py student.js grader1.js grader2.js grader3.js -c 1

Please visit https://github.com/source-academy/grader to submit issues about the
grader. This CLI interface is *not* for deployment. It is only a testing convenience.\
"""

API_URL_FILENAME = '.api-url'

def get_api_url():
    if os.path.isfile(API_URL_FILENAME):
        with open(API_URL_FILENAME, 'r') as api_file:
            return api_file.read()
    else:
        api_url = input('Please enter the API endpoint URL > ')
        with open(API_URL_FILENAME, 'w') as api_file:
            api_file.write(api_url)
        print(
            'URL configured at .api-url. '
            'You may now execute the script normally.')
        sys.exit(0)

API_URL = get_api_url()

def parseArgs():
    args = sys.argv

    if '-c' in args:
        index = args.index('-c')
        chap = int(args[index+1])
        del args[index]
        del args[index]
    else:
        chap = 2

    if len(sys.argv) < 3:
        return None
    else:
        return [chap, sys.argv[1], tuple(sys.argv[2:])]

def read_file(filename):
    with open(filename, 'r') as file:
        return file.read()

args = parseArgs()

if args:
    args[1] = read_file(args[1])
    args[2] = list(map(read_file, args[2]))

    if DEBUG: print(args[1]); print(args[2])

    req = urllib.request.Request(
        API_URL,
        method="POST",
        data=json.dumps({
            "library": {
                "chapter": args[0],
                "external": {
                    "name": "NONE",
                    "symbols": []
                },
                "globals": []
            },
            "studentProgram": args[1],
            "graderPrograms": args[2]
        }).encode('utf-8'),
        headers={
            'Content-Type': 'application/json; charset=utf-8',
        }
    )
    resp = urllib.request.urlopen(req, context=ssl._create_unverified_context())
    resp_json = json.loads(resp.read().decode())
    print(json.dumps(resp_json, indent=2))
else:
    print(HELP)
