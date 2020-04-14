'use strict';

const winston = require('winston');
const fs = require('fs');

module.exports.LOGGING_OPTIONS = {
    transports: [new winston.transports.Console()],
    requestWhitelist: ['headers', 'query', 'body'],
    responseWhitelist: ['body'],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    )
};

module.exports.MONGOOSE_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
};

module.exports.CREDENTIALS = {
    key: fs.readFileSync('/var/opt/certs/cyberauth_auth.key'),
    cert: fs.readFileSync('/var/opt/certs/cyberauth_auth.crt'),
    ca: fs.readFileSync('/var/opt/certs/cyberauth_ca.crt'),
    requestCert: true,
    rejectUnauthorized: true
};

module.exports.SERVER_PORT = 8000;

module.exports.SESSION_SECRET = process.env.SESSION_SECRET || '';
module.exports.SESSION_STORE_URL = process.env.SESSION_CONNECTION_URL || 'mongodb://localhost:27017';
