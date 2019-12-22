FROM node:12

ENV PATH="/usr/app/node_modules/.bin:${PATH}"

WORKDIR /usr/app
COPY ./package*.json ./
RUN npm i
