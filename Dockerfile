# syntax=docker/dockerfile:1
FROM node:16
WORKDIR /app

RUN apt-get update && apt-get install -y apt-transport-https
RUN apt-get -y install postgresql
RUN su postgres -c "pg_createcluster -u postgres 11 my_cluster --start -p 5432 \
&& pg_ctlcluster 11 my_cluster status \
&& psql -U postgres -c \"ALTER USER postgres WITH PASSWORD 'password';\" \
&& createdb mydb"
ENV HOST=0.0.0.0