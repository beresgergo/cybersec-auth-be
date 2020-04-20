'use strict';

module.exports.createVerify = _ => {
    return {
        update: _ => {},
        verify: (_, signature) => {
            return signature === 'OK';
        }
    };
};
