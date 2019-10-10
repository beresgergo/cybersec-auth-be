'use strict';

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requestLogController = require('../controllers/requestLoggerController');

router.get('/auth', requestLogController.logRequest, authController.getAuthenticationToken);
router.post('/protected', requestLogController.logRequest, authController.getProtectedResource);
router.get('/ping', requestLogController.logRequest, authController.ping);

module.exports = router;