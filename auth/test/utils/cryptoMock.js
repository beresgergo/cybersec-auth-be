'use strict';

module.exports.moduleName = 'crypto';

module.exports.createVerify = _ => {
    return {
        update: _ => {},
        verify: (_, signature) => {
            return signature === 'OK';
        }
    };
};
