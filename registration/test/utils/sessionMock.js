'use strict';

module.exports.createSessionMock = (opts) => {
    return {
        id: opts.id || '',
        username: opts.username || '',
        totpSecret: opts.totpSecret || '',
        publicKey:opts.publicKey || '',
        preferredAuth: opts.preferredAuth || '',
        save: function() {
            return {
                then: cb => cb()
            };
        }
    };
};
