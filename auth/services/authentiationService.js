'use strict';

const TOKEN = 'authToken';

module.exports.createAuthenticationToken = () => {
    return TOKEN;
};

module.exports.validateToken = (token) => {
    return new Promise((resolve, reject) => {
        if (token === TOKEN) {
            resolve();
            return;
        }
        reject();
    });
};
