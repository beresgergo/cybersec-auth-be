'use strict';

const HTTP_CONSTANTS = require('../utils/httpConstants');
const MESSAGES = require('../utils/messages');

const userStore = require('../models/userStore');

module.exports.deleteUser = (req, res) => {
    userStore.deleteOne({ username: res.locals.username }, _ => {
        res
            .status(HTTP_CONSTANTS.HTTP_OK)
            .json({ status: MESSAGES.STATUS_OK });
    });
};

module.exports.changePreferredAuthenticationType = (req, res) => {
    const username = res.locals.username;
    const newAuthType = req.body.preferredAuthType;

    userStore
        .findOne({ username: username })
        .then(result => {
            result.preferredAuthType = newAuthType;
            return result.save();
        })
        .then(_ => {
            return res
                .status(HTTP_CONSTANTS.HTTP_OK)
                .json({ status: MESSAGES.STATUS_OK });
        });
};
