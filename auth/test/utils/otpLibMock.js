'use strict';

module.exports.moduleName = 'otplib';

module.exports.totp = {
    options: {},
    check: (token, _) => token === 'valid'

};

