
module.exports = function (params) {
    ["get", "put", "delete", "clean"].forEach(function (name) {
        if (typeof params[name] !== "function") {
            throw Error("Invalid parameter: set " + name + " function.");
        }
    });

    return {
        get: function (key, callback) {
            params.get.call(params, key, callback);
        },

        put: function (key, value, callback) {
            params.put.call(params, key, value, callback);
        },

        delete: function (key, callback) {
            params.delete.call(params, key, callback);
        },

        clean: function (callback) {
            params.clean.call(params, callback);
        }
    };
};
