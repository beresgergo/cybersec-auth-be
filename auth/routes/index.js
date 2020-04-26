'use strict';

const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authController');
const sessionController = require('../controllers/sessionController');

router.get('/login/:username',
    sessionController.createSession,
    authenticationController.startAuthentication); // start workflow, returns expected authentication type

router.post('/login/otpToken',
    sessionController.populateSession,
    authenticationController.verifyTotpToken);

router.post('/login/challenge',
    sessionController.populateSession,
    authenticationController.generateChallenge); // retrieve challenge

router.post('/login/signedChallenge',
    sessionController.populateSession,
    authenticationController.checkSignature); // submit signed challenge

router.post('/retrieveToken',
    sessionController.populateSession,
    sessionController.removeSession,
    authenticationController.token); // submit signed challenge

router.post('/verifyToken', authenticationController.validateAuthToken);

module.exports = router;
