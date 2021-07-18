FROM node:14-alpine

ARG NPM_OPTS=--only=prod
ENV CODE_PATH /usr/src/app

RUN mkdir -p $CODE_PATH
WORKDIR $CODE_PATH

COPY package.json $CODE_PATH
COPY package-lock.json $CODE_PATH

RUN npm install $NPM_OPTS

COPY . $CODE_PATH

CMD ["npm", "run", "start"]

EXPOSE 3000
