'use strict';

const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authController');
const inputValidationController = require('../controllers/inputValidatorController');
const registrationController = require('../controllers/registrationController');
const userServiceController = require('../controllers/userServiceController');

// routes for login
router.get('/login/:username', authenticationController.startAuthentication);
router.post('/login/otpToken', authenticationController.verifyTotpToken);
router.post('/login/challenge', authenticationController.generateChallenge);
router.post('/login/signedChallenge', authenticationController.checkSignature);
router.post('/login/retrieveToken', authenticationController.retrieveToken);

// routes for registration
router.get('/user/:username',
    inputValidationController.setupValidValueHolders,
    inputValidationController.userNameValidator,
    registrationController.checkUsername);

router.post('/user/:username/totpSecret',
    inputValidationController.setupValidValueHolders,
    inputValidationController.userNameValidator,
    inputValidationController.sessionIdValidator,
    inputValidationController.totpValidator,
    registrationController.totpSecret);

router.post('/user/:username/publicKey',
    inputValidationController.setupValidValueHolders,
    inputValidationController.userNameValidator,
    inputValidationController.sessionIdValidator,
    inputValidationController.publicKeyValidator,
    registrationController.publicKey);

router.post('/user/:username/finalize',
    inputValidationController.setupValidValueHolders,
    inputValidationController.userNameValidator,
    inputValidationController.sessionIdValidator,
    registrationController.finalize);

// routes for user service
router.delete('/management/user', userServiceController.deleteUser);
router.post('/management/preferredAuthType', userServiceController.changePreferredAuthType);

module.exports = router;
