'use strict';

const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authController');
const sessionController = require('../controllers/sessionController');

router.get('/login/:username',
    sessionController.createSession,
    authenticationController.startAuthentication); // start workflow

router.get('/login/challenge',
    sessionController.populateSession,
    authenticationController.generateChallenge); // retrieve challenge

router.post('/login/challenge',
    sessionController.populateSession,
    sessionController.removeSession,
    authenticationController.checkSignature); // submit signed challenge

router.post('/protected',
    authenticationController.validateAuthToken,
    authenticationController.protectedResource);

module.exports = router;
