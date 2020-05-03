'use strict';

const express = require('express');
const router = express.Router();

const registrationController = require('../controllers/registrationController');
const sessionController = require('../controllers/sessionController');

router.get('/user/:username',
    sessionController.createSession,
    registrationController.checkUsername);

router.post('/user/:username/totpSecret',
    sessionController.populateSession,
    registrationController.totpSecret);

router.post('/user/:username/publicKey',
    sessionController.populateSession,
    registrationController.publicKey);

router.post('/user/:username/finalize',
    sessionController.populateSession,
    sessionController.removeSession,
    registrationController.finalize);

module.exports = router;
