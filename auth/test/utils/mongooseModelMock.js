'use strict';

module.exports.createModelMock = (model) => {
    const ModelMock = function(opts) {
        return {
            save: function(cb) {
                if (!cb) {
                    return {
                        then: cb => cb()
                    };
                }
                cb(null, opts);
            }
        };
    };

    ModelMock.findOne = function (prop, cb) {
        if (prop.id === '1') {
            cb(null, model);
            return;
        }

        if (!cb) {
            return {
                then: cb => {
                    if (prop.username === 'username') {
                        return cb(model);
                    }
                    return cb(null);
                }
            };
        }
        cb(null, null);
    };

    ModelMock.deleteOne = function(_, cb) { cb(); };
    ModelMock.deleteMany = function(_) {
        return {
            then: cb => cb(ModelMock)
        };
    };

    return ModelMock;
};
