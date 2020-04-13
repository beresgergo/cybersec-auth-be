'use strict';

const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const helmet = require('helmet');
const CONFIGURATION = require('./config/index');

const winston = require('winston');
const expressWinston = require('express-winston');
const LOG = winston.createLogger(CONFIGURATION.LOGGING_OPTIONS);
const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(expressWinston.logger(CONFIGURATION.LOGGING_OPTIONS));

app.use('/', routes);

app.use(expressWinston.errorLogger((CONFIGURATION.LOGGING_OPTIONS)));

https.createServer(CONFIGURATION.CREDENTIALS, app).listen(8080);
