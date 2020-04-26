'use strict';

const AUTHENTICATION_CONSTANTS = require('../utils/authenticationConstants');

function isTotpPreferred(preferredAuthType) {
    return preferredAuthType === AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_TOTP;
}

function isRsaPreferred(preferredAuthType) {
    return preferredAuthType === AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_RSA;
}

function isMfaPreferred(preferredAuthType) {
    return preferredAuthType === AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_MFA;
}

module.exports.isSessionValid = session => {
    if (session.totpDone && isTotpPreferred(session.preferredAuthType)) {
        return true;
    }

    if (session.rsaDone && isRsaPreferred(session.preferredAuthType)) {
        return true;
    }

    return isMfaPreferred(session.preferredAuthType) && session.totpDone && session.rsaDone;

};
