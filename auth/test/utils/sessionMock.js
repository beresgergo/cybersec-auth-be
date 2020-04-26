'use strict';

module.exports.createSessionMock = opts => {
    return Object.assign({}, opts, {
        save: function() {
            return {
                then: cb => cb()
            };
        }
    });
};
