'use strict';

module.exports.createSessionMock = (id, username, setPassword, confirmPassword, publicKey) => {
    return {
        id: id || '',
        username: username || '',
        setPassword: setPassword || '',
        confirmPassword: confirmPassword || '',
        publicKey: publicKey || '',
        save: function() {
            return {
                then: cb => cb()
            };
        }
    };
};
