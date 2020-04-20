'use strict';

module.exports.createSessionMock = (id, username, password, challenge) => {
    if (id === Object(id)) {
        return Object.assign({}, id, {
            save: function() {
                return {
                    then: cb => cb()
                };
            }
        });
    }
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
