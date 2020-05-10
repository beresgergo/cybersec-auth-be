'use strict';

const HTTP_CONSTANTS = require('../utils/httpConstants');
const MESSAGES = require('../utils/messages');
const userStore = require('../models/userStore');

module.exports.checkUsername = (req, res) => {
    const session = res.locals.session;
    const username = req.params.username;
    userStore
        .findOne({ username : username })
        .then(result => {
            if (result) {
                res
                    .status(HTTP_CONSTANTS.BAD_REQUEST)
                    .json({ message : MESSAGES.USERNAME_ALREADY_USED });
                return;
            }
            session.username = username;
            return session.save();
        })
        .then(_ => {
            res
                .status(HTTP_CONSTANTS.HTTP_OK)
                .json({
                    status: MESSAGES.STATUS_OK,
                    sessionId: session.id
                });
        });
};

module.exports.totpSecret = (req, res) => {
    const session = res.locals.session;
    if (!session.username) {
        return res
            .status(HTTP_CONSTANTS.BAD_REQUEST)
            .json({ message : MESSAGES.DATA_MISSING_FROM_SESSION });
    }

    session.totpSecret = req.body.totpSecret;
    session
        .save()
        .then(_ => {
            res
                .status(HTTP_CONSTANTS.HTTP_OK)
                .json({ status: MESSAGES.STATUS_OK });
        });
};

module.exports.publicKey = (req, res) => {
    const session = res.locals.session;
    const publicKey = req.body.publicKey;

    if (!session.totpSecret) {
        res
            .status(HTTP_CONSTANTS.BAD_REQUEST)
            .json({ message : MESSAGES.DATA_MISSING_FROM_SESSION });
        return;
    }

    session.publicKey = publicKey;
    session
        .save()
        .then(_ => {
            res
                .status(HTTP_CONSTANTS.HTTP_OK)
                .json({ status: MESSAGES.STATUS_OK });
        });

};

module.exports.finalize = (req, res) => {
    const session = res.locals.session;
    const preferredAuthType = req.body.preferredAuthType;

    if (!session.publicKey) {
        res
            .status(HTTP_CONSTANTS.BAD_REQUEST)
            .json({ message : MESSAGES.DATA_MISSING_FROM_SESSION });
        return;
    }

    userStore({
        username: session.username,
        totpSecret: session.totpSecret,
        publicKey: session.publicKey,
        preferredAuthType: preferredAuthType
    }).save().then(_ => {
        res
            .status(HTTP_CONSTANTS.HTTP_OK)
            .json({ status: MESSAGES.STATUS_OK });
    });
};
