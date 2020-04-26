'use strict';
module.exports.moduleName = 'jsonwebtoken';
module.exports.sign = (_p, _key, _opt, cb) => cb(null, 'authToken');
module.exports.verify = (token, _, cb) => {
    if (token === 'authToken') {
        cb();
    }
    cb({
        message: 'test'
    }, token);
};
