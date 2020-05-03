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

module.exports.CREDENTIALS= {
    key: fs.readFileSync('/var/opt/certs/cyberauth_registration.key'),
    cert: fs.readFileSync('/var/opt/certs/cyberauth_registration.crt'),
    ca: fs.readFileSync('/var/opt/certs/cyberauth_ca.crt'),
    requestCert: true,
    rejectUnauthorized: true
};

module.exports.JWT = {
    publicKey : fs.readFileSync('/var/opt/jwt/jwt_signer.pubkey'),
    signOptions: {
        algorithms: ['RS256'],
        maxAge: '2 minutes'
    }
};

module.exports.CONNECTION_STRING = process.env.CONNECTION_STRING || 'mongodb://localhost:27017';

module.exports.SERVER_PORT = 8000;
