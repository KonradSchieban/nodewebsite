FROM node:latest
MAINTAINER Konrad Schieban

EXPOSE 8000:8000

ADD . /src

RUN cd /src && npm install

WORKDIR /src

ENTRYPOINT sleep 5 && node index.js