#! /usr/bin/env sh

# Start postgresql
su postgres -c "pg_ctl start"

# Start frontend
cd /cadet-frontend
nohup yarn start &

# Configure CS1101s
cp -r /cs1101s-host /cs1101s
rm -rf /cs1101s/.git
cd /cs1101s
git init .
git add *
git commit -m 'Initial commit'

# Start nginx
nginx

cd /cadet
# Import assessments from the cs1101s repository
mix cadet.assessments.update

# Start backend
elixir --erl "--updater" -S mix phx.server

