'use strict';

const fs = require('fs');
const winston = require('winston');

module.exports.registrationSessionTestConfig = {
    key: fs.readFileSync('/var/opt/certs/cyberauth_proxy.key'),
    cert: fs.readFileSync('/var/opt/certs/cyberauth_proxy.crt'),
    ca: fs.readFileSync('/var/opt/certs/cyberauth_ca.crt'),
    uri: 'https://registration:8000/sessionTest',
    json: true
};

module.exports.authBaseConfig = {
    key: fs.readFileSync('/var/opt/certs/cyberauth_proxy.key'),
    cert: fs.readFileSync('/var/opt/certs/cyberauth_proxy.crt'),
    ca: fs.readFileSync('/var/opt/certs/cyberauth_ca.crt'),
    uri: 'https://auth:8000/auth',
    json: true
};

module.exports.getProtectedResourceConfig = {
    key: fs.readFileSync('/var/opt/certs/cyberauth_proxy.key'),
    cert: fs.readFileSync('/var/opt/certs/cyberauth_proxy.crt'),
    ca: fs.readFileSync('/var/opt/certs/cyberauth_ca.crt'),
    uri: 'https://auth:8000/protected'
};

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
    key: fs.readFileSync('/var/opt/certs/cyberauth_proxy.key'),
    cert: fs.readFileSync('/var/opt/certs/cyberauth_proxy.crt'),
    ca: fs.readFileSync('/var/opt/certs/cyberauth_ca.crt')
};

module.exports.SESSION_SECRET = process.env.SESSION_SECRET || '';
module.exports.SESSION_STORE_URL = process.env.SESSION_CONNECTION_URL || 'mongodb://localhost:27017';
