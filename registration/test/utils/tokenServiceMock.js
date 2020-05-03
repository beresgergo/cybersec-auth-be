'use strict';

module.exports.moduleName = '../services/tokenService';

module.exports.verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        if (token === 'authToken') {
            resolve({ username: 'username' });
        }
        else {
            reject();
        }

    });
};

