'use strict';

const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const sessionController = require('../controllers/sessionController');

router.get('/user/:username',
    sessionController.createSession,
    registrationController.checkUsername);

router.post('/user/:username/setPassword',
    sessionController.populateSession,
    registrationController.setPassword);

router.post('/user/:username/confirmPassword',
    sessionController.populateSession,
    registrationController.confirmPassword);

router.post('/user/:username/finalize',
    sessionController.populateSession,
    sessionController.removeSession,
    registrationController.finalize);

module.exports = router;
