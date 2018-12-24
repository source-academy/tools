===============
cadet-container
===============
This directory contains a docker image which, when built and run, deploys a
local copy of cadet_ and `cadet-frontend`_, providing a fully functional *Source
Academy* on your machine. This version of Source Academy pulls from a local
cs1101s repository, allowing you to test the assessment XMLs you author,
and optionally pulls from local copies of ``cadet`` and ``cadet-frontend``,
allowing you to test changes to the backend and frontend respectively.

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
configuration .env and secrets.exs files appropriately.

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

To stop the docker container, open up a new terminal window and run:

.. code::

    $ make stop

Development
===========
**On the command** ``make run`` **the docker image makes a copy of your local
cs1101s repository and treats it as if it was the canonical master branch of the
cs1101s repository.** This means that any changes made after the ``make run``
command will not be reflected in the docker container. You will have to kill the
container and instantiate a new one in order to to see any new changes to your
local cs1101s repository since the last ``make run`` command.

cadet_ and `cadet-frontend`_ developers may wish to use this image to test their
changes. In that case, add the following line in the Dockerfile, after the ``git
clone`` step (and after the ``WORKDIR`` has been set correctly) of the relevant
repository,

.. code::

    RUN git checkout $SHA1

Where ``$SHA1`` is the SHA-1 hash of the commit you want to test. You may also
use a branch name. You will then have to use the specially defined make command
``rebuild``,

.. code::

    $ make rebuild

Now, you can run the image as per usual.

.. code::

    $ make run
