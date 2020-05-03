'use strict';

const express = require('express');
const router = express.Router();

const authenticationController = require('../controllers/authenticationController');
const userController = require('../controllers/userController');

router.delete('/user',
    authenticationController.verifyToken,
    userController.deleteUser);

router.post('/user/preferredAuthType',
    authenticationController.verifyToken,
    userController.changePreferredAuthenticationType);

module.exports = router;
