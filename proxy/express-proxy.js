'use strict'

const express = require('express');
const https = require('https')
const fs = require('fs');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);

const credentials = {
	key: fs.readFileSync('/var/opt/certs/cyberauth_proxy.key'),
	cert: fs.readFileSync('/var/opt/certs/cyberauth_proxy.crt'),
	ca: fs.readFileSync('/var/opt/certs/cyberauth_ca.crt')
};

https.createServer(credentials, app).listen(8080)
