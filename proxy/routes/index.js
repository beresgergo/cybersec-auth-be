'use strict';

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const registrationController = require('../controllers/registrationController');

router.get('/auth', authController.getAuthenticationToken);
router.post('/protected', authController.getProtectedResource);
router.get('/ping', authController.ping);
router.get('/user/:username', registrationController.checkUsername);
router.post('/user/:username/setPassword', registrationController.setPassword);
router.post('/user/:username/confirmPassword', registrationController.confirmPassword);
router.post('/user/:username/publicKey', registrationController.publicKey);
router.post('/user/:username/finalize', registrationController.finalize);

module.exports = router;
