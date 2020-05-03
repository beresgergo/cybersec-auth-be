'use strict';

module.exports.moduleName = '../services/authenticationService';

module.exports.createAuthenticationToken = (_) => {
    return new Promise((resolve, _) => {
        resolve('authToken');
    });
};

module.exports.validateToken = (token) => {
    return new Promise((resolve, reject) => {
        if (token === 'authToken') {
            resolve();
        }
        else {
            reject();
        }

    });
};

