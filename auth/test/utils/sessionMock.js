'use strict';

module.exports.createSessionMock = (id, username, password, challenge) => {
    return {
        id: id || '',
        username: username || '',
        password: password || '',
        challenge: challenge || '',
        save: function() {
            return {
                then: cb => cb()
            };
        }
    };
};
