================
demo-assessments
================
This directory contains a docker image which, when built and run, deploys a
local copy of cadet_ and `cadet-frontend`_, providing a fully functional *Source
Academy* on your machine. This version of Source Academy pulls from a local
cs1101s repository, allowing you to test the assessment and story XMLs you
author.

.. _cadet: https://github.com/source-academy/cadet/
.. _`cadet-frontend`: https://github.com/source-academy/cadet-frontend/

Requirements
============
You will need,

1. Docker_ on the command line
2. A local copy of the cs1101s repository
3. An `IVLE LAPI key`_

.. _Docker: https://www.docker.com/community-edition/
.. _`IVLE LAPI key`: https://ivle.nus.edu.sg/LAPI/

This document is written with the assumption that you are running a \*NIX shell
with a copy of GNU Make (or an equivalent implementation). If this is not the
case, you will have to infer some steps from the Makefile.in.

Setup
=====
First run the configure script. This will generate a Makefile, and populate the
configuration .env and secrets.exs files appriopriately.

.. code::

    $ ./configure

Next, build the docker image.

.. code::

    $ make build

Finally, run the docker image. This execution step is performed in the
foreground, so that you can read the application logs from stdout.

    This step may fail if your port numbers 80 and 4000 are already in use.

.. code::

    $ make run

You should now be able to access a local copy of Source Academy at
port 80 (open up your web browser, and key in *localhost*).

To stop the docker container,

1. Open up a new terminal window
2. Find the name of the container
3. Kill the container

For example,

.. code::

    $ docker ps
    CONTAINER ID  IMAGE  ...(omitted)...  NAMES
    bb6acc335498  cadet  ...(omitted)...  hardcore_blackwell
    $ docker kill hardcore_blackwell
