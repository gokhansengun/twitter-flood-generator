FROM node:7-alpine

COPY package.json /opt/app/

WORKDIR /opt/app/

RUN npm install

COPY flooder.js main.js splitter.js /opt/app/

ENTRYPOINT ["node","/opt/app/main.js"]