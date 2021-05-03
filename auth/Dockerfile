FROM node:16

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json ./
RUN npm install

COPY . .

RUN mkdir -p /var/opt/certs
RUN mkdir -p /var/opt/jwt

EXPOSE 8000
CMD ["npm", "start"]
