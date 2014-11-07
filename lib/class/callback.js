
module.exports = function (params) {
    ["get", "put", "delete", "clean"].forEach(function (name) {
        if (typeof params[name] !== "function") {
            throw Error("Invalid parameter: set " + name + " function.");
        }
    });

    return {
        get: function (key, callback) {
            params.get.call(this, key, callback);
        },

        put: function (key, value, callback) {
            params.put.call(this, key, value, callback);
        },

        delete: function (key, callback) {
            params.delete.call(this, key, callback);
        },

        clean: function (callback) {
            params.clean.call(this, callback);
        }
    };
};
