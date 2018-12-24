#! /usr/bin/env sh

set -x

CONFIGURE_SECRETS=
CONFIGURE_ENV=

# Start postgresql
su postgres -c "pg_ctl start"

if [ -z "$CONFIGURE_ENV" ]; then
  cp -a /cadet-frontend-host /cadet-frontend
fi
cd /cadet-frontend
rm -r node_modules
yarn
cd /

if [ -z "$CONFIGURE_SECRETS" ]; then
  cp -a /cadet-host /cadet

  sed -e "s|    cs1101s_repository:.*|    cs1101s_repository: \"/cs1101s\",|" \
      -e "s|    cs1101s_rsa_key.*|    cs1101s_rsa_key: \"/\",|" \
      -i cadet/config/secrets.exs
fi

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

