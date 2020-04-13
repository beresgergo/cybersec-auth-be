'use strict';

const winston = require('winston');

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

module.exports.SESSION_SECRET = process.env.SESSION_SECRET || '';
module.exports.SESSION_STORE_URL = process.env.SESSION_CONNECTION_URL || 'mongodb://localhost:27017';
