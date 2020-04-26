'use strict';

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const registrationController = require('../controllers/registrationController');

router.get('/auth', authController.getAuthenticationToken);
router.post('/protected', authController.getProtectedResource);
router.get('/ping', authController.ping);

// routes for login
router.get('/login/:username');

// routes for registration
router.get('/user/:username', registrationController.checkUsername);
router.post('/user/:username/totpSecret', registrationController.totpSecret);
router.post('/user/:username/publicKey', registrationController.publicKey);
router.post('/user/:username/finalize', registrationController.finalize);

module.exports = router;
