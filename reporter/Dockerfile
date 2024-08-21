FROM alpine

WORKDIR /reporter

COPY reporter.js .
COPY firebaseConfig.js .
COPY .env .
COPY package.json .
COPY package-lock.json .

RUN apk add nodejs npm

RUN npm i

CMD ["node", "--env-file=.env", "/reporter/reporter.js"]
