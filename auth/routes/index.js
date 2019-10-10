'use strict';

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/auth', authController.createAuthToken);
router.post('/protected', authController.validateAuthToken, authController.protectedResource);

module.exports = router;