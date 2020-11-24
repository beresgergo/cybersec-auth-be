'use strict';

module.exports.moduleName = 'crypto';

module.exports.createVerify = _ => {
    return {
        update: _ => {},
        verify: (_, signature) => {
            return signature === 'T0s=';
        }
    };
};

module.exports.constants = {
    RSA_PKCS1_PSS_PADDING: 'RSA_PKCS1_PSS_PADDING'
};
