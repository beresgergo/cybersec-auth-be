'use strict';

module.exports.authenticationServiceMock = {
    createAuthenticationToken: () => 'authToken',
    validateToken: (_) => {
        return new Promise((resolve, _) => {
            resolve(true);
        });
    }
};
