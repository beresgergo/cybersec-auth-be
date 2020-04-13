'use strict';

const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const helmet = require('helmet');
const CONFIGURATION = require('./config/index');
const mongoose = require('mongoose');

const winston = require('winston');
const LOG = winston.createLogger(CONFIGURATION.LOGGING_OPTIONS);
const expressWinston = require('express-winston');

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(expressWinston.logger(CONFIGURATION.LOGGING_OPTIONS));

mongoose
    .connect(CONFIGURATION.SESSION_STORE_URL, CONFIGURATION.MONGOOSE_OPTIONS)
    .then(() => {
        LOG.info('Connection to DB established.');
    });

app.use('/', routes);

app.use(expressWinston.errorLogger(CONFIGURATION.LOGGING_OPTIONS));

const credentials = {
    key: fs.readFileSync('/var/opt/certs/cyberauth_registration.key'),
    cert: fs.readFileSync('/var/opt/certs/cyberauth_registration.crt'),
    ca: fs.readFileSync('/var/opt/certs/cyberauth_ca.crt'),
    requestCert: true,
    rejectUnauthorized: true
};

https.createServer(credentials, app).listen(8000);
