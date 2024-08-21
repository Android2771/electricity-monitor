FROM alpine

WORKDIR /monitor

COPY monitor.js .
COPY firebaseConfig.js .
COPY .env .
COPY package.json .
COPY package-lock.json .

RUN apk add nodejs npm

RUN npm i

CMD ["node", "--env-file=.env", "/monitor/monitor.js"]
