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

# CONFIGURE CS1101S
VOLUME /cs1101s-host
RUN git config --global user.email "docker@cadet.com"
RUN git config --global user.name "Cadet"

# CONFIGURE JS-SLANG FOR CHAPTER 4
RUN git clone https://github.com/source-academy/js-slang
WORKDIR /js-slang
RUN git checkout chapter-four
RUN yarn
RUN yarn build
WORKDIR /

# CONFIGURE FRONTEND
RUN git clone https://github.com/source-academy/cadet-frontend
WORKDIR /cadet-frontend
COPY .env /cadet-frontend/
RUN yarn
WORKDIR /

# CONFIGURE BACKEND
RUN git clone https://github.com/source-academy/cadet /cadet
RUN cd cadet 
RUN git checkout e0877e7dd7db72e40aca3d26115ac96fcd82bd8e
RUN cd ../
COPY secrets.exs /cadet/config
WORKDIR /cadet
RUN mix deps.get
RUN mix compile
RUN su postgres -c "pg_ctl start" && mix ecto.drop && mix ecto.create && mix ecto.migrate
WORKDIR /

# RUN SCRIPT
COPY templates/docker-run.sh /docker-run.sh
CMD ./docker-run.sh
