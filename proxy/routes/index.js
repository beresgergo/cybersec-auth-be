'use strict';

const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authController');
const registrationController = require('../controllers/registrationController');

// routes for login
router.get('/login/:username', authenticationController.startAuthentication);
router.post('/login/otpToken', authenticationController.verifyTotpToken);
/*router.post('/login/challenge', authenticationController.generateChallenge);
router.post('/login/signedChallenge', authenticationController.checkSignature);*/
router.post('/login/retrieveToken', authenticationController.retrieveToken);
router.post('/login/verifyToken', authenticationController.validateAuthToken);

// routes for registration
router.get('/user/:username', registrationController.checkUsername);
router.post('/user/:username/totpSecret', registrationController.totpSecret);
router.post('/user/:username/publicKey', registrationController.publicKey);
router.post('/user/:username/finalize', registrationController.finalize);

module.exports = router;
