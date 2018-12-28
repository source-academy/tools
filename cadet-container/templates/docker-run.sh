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
yarn > /log/cadet-frontend-yarn.log 2>&1
cd /

if [ -z "$CONFIGURE_SECRETS" ]; then
  cp -a /cadet-host /cadet

  sed -e "s|    cs1101s_repository:.*|    cs1101s_repository: \"/cs1101s\",|" \
      -e "s|    cs1101s_rsa_key.*|    cs1101s_rsa_key: \"/\",|" \
      -i cadet/config/secrets.exs
fi

# Start frontend
cd /cadet-frontend
nohup yarn start > /log/cadet-frontend.log 2>&1 &

# Configure CS1101s
cp -r /cs1101s-host /cs1101s
rm -rf /cs1101s/.git
cd /cs1101s
git init .
git add *
git commit -m 'Initial commit' > /log/cadet-frontend-git.log 2>&1

# Start nginx
nginx

# Start cadet
cd /cadet

# Set up cadet deps and DB
mix deps.get > /log/cadet-deps.get.log 2>&1
mix compile > /log/cadet-compile.log 2>&1

mix ecto.drop > /log/cadet-ecto.drop.log 2>&1 && \
mix ecto.create > /log/cadet-ecto.create.log 2>&1 && \
mix ecto.migrate > /log/cadet-ecto.migrate.log 2>&1

# Import assessments from the cs1101s repository
mix cadet.assessments.update > /log/cadet-cadet.assessments.update.log 2>&1

# Start backend
elixir --erl "--updater" -S mix phx.server > /log/cadet.log 2>&1
