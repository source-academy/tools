==========
grader-api
==========
**The grader API is still in development.** Only *'pure'* source programs, i.e.
those from chapter 1 without any external libraries can be used.

This directory contains a python3 script which makes an HTTP api call to a copy
of the grader_. Use this to test the grader programs you write for the
assessment XML files.

.. _grader: https://github.com/source-academy/grader

Requirements
============
You will need,

1. Python 3
2. The API endpoint URL

You may request the API endpoint URL from the module staff, dev team, cluster
leaders, etc.

Setup
=====
First, run the script with no arguments. This will prompt you to enter the API
endpoint URL. The API endpoint URL is then saved in the current working
directory as ``.api-url``.

.. code::

    $ ./api.py
    Please enter the API endpoint URL > ${URL}
    URL configured at .api-url. You may now run the script normally

Thereafter, you may run the script normally. For more information, run
``./api.py`` with no arguments.

.. code::

    $ ./api.py

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
    grader. This CLI interface is *not* for deployment. It is only a testing convenience.
