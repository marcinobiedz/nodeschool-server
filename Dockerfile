FROM node:8

RUN mkdir -p /usr/src/server

WORKDIR /usr/src/server

COPY package.json ./

RUN yarn install

COPY . .

EXPOSE 9001

CMD ["yarn", "start"]