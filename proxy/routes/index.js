'use strict';

const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authController');
const inputValidationController = require('../controllers/inputValidatorController');
const registrationController = require('../controllers/registrationController');
const userServiceController = require('../controllers/userServiceController');

// routes for login
router.get('/login/:username',
    inputValidationController.setupValidValueHolders,
    inputValidationController.userNameValidator,
    authenticationController.startAuthentication);

router.post('/login/otpToken',
    inputValidationController.setupValidValueHolders,
    inputValidationController.sessionIdValidator,
    inputValidationController.totpTokenValidator,
    authenticationController.verifyTotpToken);

router.post('/login/challenge',
    inputValidationController.setupValidValueHolders,
    inputValidationController.sessionIdValidator,
    authenticationController.generateChallenge);

router.post('/login/signedChallenge',
    inputValidationController.setupValidValueHolders,
    inputValidationController.sessionIdValidator,
    inputValidationController.signedChallengeValidator,
    authenticationController.checkSignature);

router.post('/login/retrieveToken',
    inputValidationController.setupValidValueHolders,
    inputValidationController.sessionIdValidator,
    authenticationController.retrieveToken);

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
    inputValidationController.preferredAuthTypeValidator,
    registrationController.finalize);

// routes for user service
router.delete('/management/user',
    inputValidationController.setupValidValueHolders,
    inputValidationController.jwtStringValidator,
    userServiceController.deleteUser);

router.post('/management/preferredAuthType',
    inputValidationController.setupValidValueHolders,
    inputValidationController.preferredAuthTypeValidator,
    inputValidationController.jwtStringValidator,
    userServiceController.changePreferredAuthType);

module.exports = router;
