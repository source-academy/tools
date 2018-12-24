FROM bitwalker/alpine-elixir:1.6.6

WORKDIR /
ENV PGDATA /var/lib/postgresql/data
EXPOSE 80 4001

# INSTALL DEPENDENCIES
RUN apk add nginx nodejs postgresql yarn

# CONFIGURE POSTGRESQL
RUN mkdir /run/postgresql
RUN chown -R postgres /run/postgresql/
USER postgres
RUN initdb
RUN echo "local all all peer" > $PGDATA/pg_hba.conf
RUN echo "host all all 0.0.0.0/0 trust" >> $PGDATA/pg_hba.conf
RUN pg_ctl start && psql -c "ALTER USER postgres PASSWORD 'postgres';" && createdb cadet_dev
USER root

# CONFIGURE NGINX
RUN mkdir /run/nginx
COPY templates/nginx.conf /etc/nginx/nginx.conf

RUN git config --global user.email "docker@cadet.com"
RUN git config --global user.name "Cadet"

# SET UP VOLUMES
VOLUME /cs1101s-host
VOLUME /cadet-host
VOLUME /cadet-frontend-host

# COPY CONFIGS OVER
COPY .env /.env
COPY secrets.exs /secrets.exs

# COPY SCRIPTS OVER
COPY docker-config.sh /docker-config.sh
COPY docker-run.sh /docker-run.sh

RUN ./docker-config.sh

# RUN SCRIPT
CMD ./docker-run.sh
