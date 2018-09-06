
EmailSender-api
==========

This directory contains a python3 script which sends emails with SMTP.
Please note that NUS email cannot receive the email because SMTP is blocked.
So please use other public email, for example, gmail.


Requirements
============
You will need,

1. Python 3


Usage
=====
Simply call the script with specific parameters.
The format is as follows:

.. code::

    $ python3 ./emailsender.py  "receiver_address"  "mission_name"  "student_name"  "attachment_file_path"
      receiver_address: receiver's email address. The email will be sent to this address from a gmail.
      mission_name: the name of the mission, which will be put in the subject. 
      student_name: the name of the student of the sent report.
      attachment_file_path: the filepath of the report to be sent.


.. code::

    Examples:
      python3  /home/bitnami/emailsender/sendemail.py  "pomeloabram@gmail.com"  "MISSION2 TEST"  "Stan Ma"  "/home/bitnami/emailsender/test.pdf"
