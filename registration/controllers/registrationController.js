'use strict';

const HTTP_CONSTANTS = require('../utils/httpConstants');
const MESSAGES = require('../utils/messages');
const userStore = require('../models/userStore');

// userStore.deleteMany({});

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

module.exports.setPassword = (req, res) => {
    const session = res.locals.session;
    if (!session.username) {
        return res
            .status(HTTP_CONSTANTS.BAD_REQUEST)
            .json({ message : MESSAGES.DATA_MISSING_FROM_SESSION });
    }

    session.setPassword = req.body.password;
    session
        .save()
        .then(_ => {
            res
                .status(HTTP_CONSTANTS.HTTP_OK)
                .json({ status: MESSAGES.STATUS_OK });
        });
};

module.exports.confirmPassword = (req, res) => {
    const session = res.locals.session;
    const confirmPassword = req.body.confirmPassword;

    if (!session.setPassword) {
        res
            .status(HTTP_CONSTANTS.BAD_REQUEST)
            .json({ message : MESSAGES.DATA_MISSING_FROM_SESSION });
        return;
    }

    if (session.setPassword !== confirmPassword) {
        res
            .status(HTTP_CONSTANTS.BAD_REQUEST)
            .json({ message : MESSAGES.PASSWORD_MISMATCH });
        return;
    }

    session.confirmPassword = confirmPassword;
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

    if (!session.username) {
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

    if (!session.confirmPassword && !session.publicKey) {
        res
            .status(HTTP_CONSTANTS.BAD_REQUEST)
            .json({ message : MESSAGES.DATA_MISSING_FROM_SESSION });
        return;
    }

    userStore({
        username: session.username,
        password: session.setPassword,
        publicKey: session.publicKey
    }).save().then(_ => {
        res
            .status(HTTP_CONSTANTS.HTTP_OK)
            .json({ status: MESSAGES.STATUS_OK });
    });
};
