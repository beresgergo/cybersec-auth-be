'use strict';

const AUTHENTICATION_CONSTANTS = require('../utils/authenticationConstants');
const CONFIGURATION = require('../config/index');
const HTTP_CONSTANTS = require('../utils/httpConstants');
const MESSAGES = require('../utils/messages');

const userStore = require('../models/userStore');
const authenticationService = require('../services/authenticationService');
const { isSessionValid } = require('../services/sessionValidatorService');

const { createVerify, constants } = require('crypto');
const { totp } = require('otplib');
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
            session.preferredAuthType = result.preferredAuthType;

            return session.save();
        }).then(_ => {
            return res
                .status(HTTP_CONSTANTS.HTTP_OK)
                .json({
                    sessionId: session.id,
                    preferredAuthType: session.preferredAuthType
                });
        });
};

module.exports.verifyTotpToken = (req, res) => {
    const session = res.locals.session;
    const preferredAuthType = session.preferredAuthType;

    if (!session.username && !session.preferredAuthType) {
        res
            .status(HTTP_CONSTANTS.BAD_REQUEST)
            .json({ message : MESSAGES.DATA_MISSING_FROM_SESSION });
        return;
    }

    if (preferredAuthType === AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_RSA) {
        res
            .status(HTTP_CONSTANTS.BAD_REQUEST)
            .json({ message : MESSAGES.AUTHENTICATION_TYPE_MISMATCH });
        return;
    }

    totp.options = CONFIGURATION.TOTP_OPTIONS;

    userStore
        .findOne({ username: session.username })
        .then( result => {
            const isValid = totp.check(req.body.token, result.totpSecret);

            if (!isValid) {
                res.status(HTTP_CONSTANTS.BAD_REQUEST)
                    .json({ message : MESSAGES.INVALID_TOTP_TOKEN });
                return;
            }

            session.totpDone = true;
            session.save()
                .then(_ => {
                    res
                        .status(HTTP_CONSTANTS.HTTP_OK)
                        .json({ status: MESSAGES.STATUS_OK });
                });
        });
};

module.exports.generateChallenge = (req, res) => {
    const session = res.locals.session;
    const preferredAuthType = session.preferredAuthType;

    if (!session.username && !session.preferredAuthType) {
        res
            .status(HTTP_CONSTANTS.BAD_REQUEST)
            .json({ message : MESSAGES.DATA_MISSING_FROM_SESSION });
        return;
    }

    if (preferredAuthType === AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_TOTP) {
        res
            .status(HTTP_CONSTANTS.BAD_REQUEST)
            .json({ message : MESSAGES.AUTHENTICATION_TYPE_MISMATCH });
        return;
    }

    session.challenge = uuid();
    session
        .save()
        .then(_ => {
            res
                .status(HTTP_CONSTANTS.HTTP_OK)
                .json({
                    status: MESSAGES.STATUS_OK,
                    challenge: session.challenge
                });
        });
};

module.exports.checkSignature = (req, res) => {
    const session = res.locals.session;
    const encodedSignedChallenge = req.body.signedChallenge;

    if (!session.challenge) {
        res
            .status(HTTP_CONSTANTS.BAD_REQUEST)
            .json({ message : MESSAGES.DATA_MISSING_FROM_SESSION });
        return;
    }

    userStore
        .findOne({ username: session.username })
        .then(result => {
            const verify = createVerify('SHA256');
            verify.update(session.challenge);
            const signedChallenge = Buffer.from(encodedSignedChallenge, 'base64').toString('utf8');
            const success = verify.verify({
                key: Buffer.from(result.publicKey, 'base64').toString('utf8'),
                padding: constants.RSA_PKCS1_PSS_PADDING
            }, signedChallenge, 'base64');

            if(!success) {
                res
                    .status(HTTP_CONSTANTS.BAD_REQUEST)
                    .json({ message : MESSAGES.INVALID_SIGNATURE });
                return;
            }

            session.rsaDone = true;
            session.save().then(_ => {
                return res
                    .status(HTTP_CONSTANTS.HTTP_OK)
                    .json({
                        status: MESSAGES.STATUS_OK
                    });
            });
        });
};

module.exports.token = (req, res) => {
    const session = res.locals.session;

    if (!isSessionValid(session)) {
        res
            .status(HTTP_CONSTANTS.BAD_REQUEST)
            .json({ message : MESSAGES.AUTHENTICATION_TYPE_MISMATCH });
        return;
    }

    authenticationService
        .createAuthenticationToken(session.username)
        .then(token => {
            return res
                .status(HTTP_CONSTANTS.HTTP_OK)
                .json({ token: token });
        });
};

module.exports.validateAuthToken = (req, res) => {
    const promise = authenticationService.validateToken(req.body.token);

    promise.then(() => {
        return res.status(HTTP_CONSTANTS.HTTP_OK).json({ status: MESSAGES.STATUS_OK });
    }, () => {
        return res.status(HTTP_CONSTANTS.HTTP_UNAUTHORIZED).json({ message : MESSAGES.INVALID_JWT_TOKEN });
    });
};
