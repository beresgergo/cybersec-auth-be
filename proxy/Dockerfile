FROM node:13

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json ./
RUN npm install

COPY . .

RUN mkdir -p /var/opt/certs

EXPOSE 8080
EXPOSE 9229

CMD ["npm", "start"]