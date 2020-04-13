'use strict';

const registrationSession = require('../models/sessionStore');
const HTTP_CONSTANTS = require('../utils/httpConstants');
const MESSAGES = require('../utils/messages');
const { v4 : uuid } = require('uuid');

const TWO_MINUTES_IN_MILIS = 2 * 60 * 1000;

module.exports.createSession = (req, res, next) =>  {
    const now = new Date();
    const validUntil = new Date(now.getTime() + TWO_MINUTES_IN_MILIS);

    const sessionObj = registrationSession({
        id: uuid(),
        username: '',
        setPassword: '',
        confirmPassword: '',
        valid: validUntil
    });
    sessionObj.save((err, session) => {
        res.locals.session = session;
        next();
    });
};

module.exports.populateSession = (req, res, next) => {
    if(!req.body.sessionId) {
        res
            .status(HTTP_CONSTANTS.BAD_REQUEST)
            .json({ message: MESSAGES.SESSION_ID_MISSING });
    }

    registrationSession.findOne({ id: req.body.sessionId }, (_, result) => {
        if (result) {
            res.locals.session = result;
            next();
        }
        res
            .status(HTTP_CONSTANTS.BAD_REQUEST)
            .json({ message: MESSAGES.SESSION_ID_NOT_FOUND });
    });
};

module.exports.removeSession = (req, res, next) => {
    if(!req.body.sessionId) {
        res
            .status(HTTP_CONSTANTS.BAD_REQUEST)
            .json({ message: MESSAGES.SESSION_ID_MISSING });
    }
    registrationSession
        .deleteMany({ validUntil: { $lte : new Date() }})
        .then((_) => {
            registrationSession.deleteOne({ id: req.body.sessionId }, next);
        });
};
