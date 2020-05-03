'use strict';

const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authController');
const userServiceController = require('../controllers/userServiceController');
const registrationController = require('../controllers/registrationController');


// routes for login
router.get('/login/:username', authenticationController.startAuthentication);
router.post('/login/otpToken', authenticationController.verifyTotpToken);
router.post('/login/challenge', authenticationController.generateChallenge);
router.post('/login/signedChallenge', authenticationController.checkSignature);
router.post('/login/retrieveToken', authenticationController.retrieveToken);

// routes for registration
router.get('/user/:username', registrationController.checkUsername);
router.post('/user/:username/totpSecret', registrationController.totpSecret);
router.post('/user/:username/publicKey', registrationController.publicKey);
router.post('/user/:username/finalize', registrationController.finalize);

// routes for user service
router.delete('/management/user', userServiceController.deleteUser);
router.post('/management/preferredAuthType', userServiceController.changePreferredAuthType);

module.exports = router;
