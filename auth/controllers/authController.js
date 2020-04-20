'use strict';

const HTTP_CONSTANTS = require('../utils/httpConstants');
const MESSAGES = require('../utils/messages');

const { createVerify } = require('crypto');
const userStore = require('../models/userStore');
const authenticationService = require('../services/authentiationService');

const { v4 : uuid } = require('uuid');

module.exports.startAuthentication = (req, res) => {
    const session = res.locals.session;
    const username = req.params.username;

    userStore
        .findOne({ username: username })
        .then( result => {
            if (!result) {
                res
                    .status(HTTP_CONSTANTS.BAD_REQUEST)
                    .json({ message : MESSAGES.USERNAME_NOT_FOUND });
                return;
            }
            session.username = username;
            return session.save();
        }).then(_ => {
            return res
                .status(HTTP_CONSTANTS.HTTP_OK)
                .json({ sessionId : session.id });
        });
};

module.exports.generateChallenge = (req, res) => {
    const session = res.locals.session;

    if (!session.username) {
        res
            .status(HTTP_CONSTANTS.BAD_REQUEST)
            .json({ message : MESSAGES.DATA_MISSING_FROM_SESSION });
        return;
    }

    session.challenge = uuid();
    session
        .save()
        .then(_ => {
            res
                .status(HTTP_CONSTANTS.HTTP_OK)
                .json({
                    challenge: session.challenge
                });
        });
};

module.exports.checkSignature = (req, res) => {
    const session = res.locals.session;
    const signedChallenge = req.body.signedChallenge;

    if (!session.challenge) {
        res
            .status(HTTP_CONSTANTS.BAD_REQUEST)
            .json({ message : MESSAGES.DATA_MISSING_FROM_SESSION });
        return;
    }

    userStore
        .findOne({ username: session.username })
        .then(result => {
            const publicKey = Buffer.from(result.publicKey, 'base64').toString('utf-8');
            const verify = createVerify('SHA256');
            verify.update(session.challenge);
            const success = verify.verify(publicKey, signedChallenge);

            if(!success) {
                return res
                    .status(HTTP_CONSTANTS.BAD_REQUEST)
                    .json({ message : MESSAGES.INVALID_SIGNATURE });
            }

            return res
                .status(HTTP_CONSTANTS.HTTP_OK)
                .json({
                    token: authenticationService.createAuthenticationToken()
                });
        });
};

module.exports.validateAuthToken = (req, res, next) => {
    const promise = authenticationService.validateToken(req.body.token);

    promise.then(next, () => {
        return res.status(HTTP_CONSTANTS.HTTP_UNAUTHORIZED).json({failed: true});
    });
};

module.exports.protectedResource = (req, res) => {
    return res
        .status(HTTP_CONSTANTS.HTTP_OK)
        .json({
            secure: true
        });
};
