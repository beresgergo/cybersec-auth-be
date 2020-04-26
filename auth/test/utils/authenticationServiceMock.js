'use strict';

module.exports.moduleName = '../services/authenticationService';

module.exports.createAuthenticationToken = (_) => {
    return new Promise((resolve, _) => {
        resolve('authToken');
    });
};

module.exports.validateToken = (_) => {
    return new Promise((resolve, _) => {
        resolve();
    });
};

