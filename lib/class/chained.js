var Promise = require("bluebird");

module.exports = function (front, back) {
    [front, back].forEach(function (c) {
        ["get", "put", "delete", "clean"].forEach(function (name) {
            if (typeof c[name] !== "function") {
                throw Error("Invalid parameter: set chant class.");
            }
        });
    });

    var f = Promise.promisifyAll(front);
    var b = Promise.promisifyAll(back);

    return {
        get: function (key, callback) {
            f.getAsync(key).then(function (v) {
                if (typeof v !== "undefined") {
                    callback(null, v);
                    return null;
                }

                return b.getAsync(key).then(function (v) {
                    if (typeof v === "undefined") {
                        callback();
                        return null;
                    }

                    return f.putAsync(key, v).then(function () {
                        callback(null, v);
                        return;
                    });
                });
            }).catch(callback);
        },

        put: function (key, value, callback) {
            Promise.all([
                f.putAsync(key, value),
                b.putAsync(key, value)
            ]).then(function (results) {
                callback(null, results);
            }).catch(callback);
        },

        delete: function (key, callback) {
            Promise.all([
                f.deleteAsync(key),
                b.deleteAsync(key)
            ]).then(function (results) {
                callback(null, results);
            }).catch(callback);
        },

        clean: function (callback) {
            Promise.all([
                f.cleanAsync(),
                b.cleanAsync()
            ]).then(function (results) {
                callback(null, results);
            }).catch(callback);
        }
    };
};
