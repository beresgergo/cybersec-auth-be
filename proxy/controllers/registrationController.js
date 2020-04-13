'use strict';

const request = require('request-promise-native');
const session = require('../model/session');

const HTTP_OK = 200;

//at startup delete all the remaining objects in session
session.deleteMany({});

module.exports.sessionTest = (req, res) => {
    const sessionTrial = session({
        testValue: 'whatever',
        testCondition: true
    });

    sessionTrial.save(() => {
        res
            .status(HTTP_OK)
            .json({
                done: 'OK'
            });
    });
};

module.exports.sessionTest2 = (_, res) => {
    session.findOne({ testValue: 'whatever' }, (_, result) => {
        res
            .status(HTTP_OK)
            .json(result);
    });
};
