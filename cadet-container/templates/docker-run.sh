#! /usr/bin/env sh

set -x

CONFIGURE_SECRETS=
CONFIGURE_ENV=

# Set up log dir
chmod a+x /log # Make /log accessible to postgres
mkdir /log/postgres
chown -v postgres:postgres /log/postgres

# Start postgresql
su postgres -c "pg_ctl start -t 300 -l /log/postgres/postgres.log"

if [ -z "$CONFIGURE_ENV" ]; then
  cp -a /cadet-frontend-host /cadet-frontend
fi
cd /cadet-frontend
rm -r node_modules
yarn 2>&1 > /log/cadet-frontend-yarn.log
cd /

if [ -z "$CONFIGURE_SECRETS" ]; then
  cp -a /cadet-host /cadet

  sed -e "s|    cs1101s_repository:.*|    cs1101s_repository: \"/cs1101s\",|" \
      -e "s|    cs1101s_rsa_key.*|    cs1101s_rsa_key: \"/\",|" \
      -i cadet/config/secrets.exs
fi

# Start frontend
cd /cadet-frontend
nohup yarn start 2>&1 > /log/cadet-frontend.log &

# Configure CS1101s
cp -r /cs1101s-host /cs1101s
rm -rf /cs1101s/.git
cd /cs1101s
git init .
git add *
git commit -m 'Initial commit' 2>&1 > /log/cadet-frontend-git.log

# Start nginx
nginx

# Start cadet
cd /cadet

# Set up cadet deps and DB
mix deps.get 2>&1 > /log/cadet-deps.get.log
mix compile 2>&1 > /log/cadet-compile.log

mix ecto.drop 2>&1 > /log/cadet-ecto.drop.log && \
mix ecto.create 2>&1 > /log/cadet-ecto.create.log && \
mix ecto.migrate 2>&1 > /log/cadet-ecto.migrate.log

# Import assessments from the cs1101s repository
mix cadet.assessments.update 2>&1 > /log/cadet-cadet.assessments.update.log

# Start backend
elixir --erl "--updater" -S mix phx.server 2>&1 > /log/cadet.log
