var assert = require('power-assert');
var chant = require("../");

describe("chant#create", function () {

    describe("simple", function () {
        var data = {};
        var simple = chant.create({
            get: function (key, callback) {
                callback(null, data[key]);
            },

            put: function (key, value, callback) {
                data[key] = value;
                callback();
            },

            delete: function (key, callback) {
                delete data[key];
                callback();
            },

            clean: function (callback) {
                data = {};
                callback();
            },

            other: function () {
                throw Error();
            }
        });

        var key = "foo";
        var value = "OK.";

        beforeEach(function () {
            data = {};
        });

        it("should put value of key.", function (done) {
            assert(data[key] === undefined);

            simple.put(key, value, function (err) {
                if (err) {
                    done(err);
                    return;
                }

                assert(data[key] === value);
                done();
            });
        });

        it("should get value of key.", function (done) {
            data[key] = value;

            simple.get(key, function (err, result) {
                if (err) {
                    done(err);
                    return;
                }

                assert(result === value);
                done();
            });
        });

        it("should get unfedined if noset key.", function (done) {
            simple.get(key, function (err, result) {
                if (err) {
                    done(err);
                    return;
                }

                assert(result === undefined);
                done();
            });
        });

        it("should delete value of key.", function (done) {
            data[key] = value;

            simple.delete(key, function (err) {
                if (err) {
                    done(err);
                    return;
                }

                assert(data[key] === undefined);
                done();
            });
        });

        it("should clean up if clean task.", function (done) {
            data[key] = value;

            simple.clean(function (err) {
                if (err) {
                    done(err);
                    return;
                }

                assert(data[key] === undefined);
                done();
            });
        });

        it("should not run other method in params.", function () {
            assert(simple.other === undefined);
        });
    });

    describe("handle error", function () {
        var errorAll = chant.create({
            get: function (key, callback) {
                callback("raise error in get.");
            },
            put: function (key, value, callback) {
                callback("raise error in put.");
            },
            delete: function (key, callback) {
                callback("raise error in delete.");
            },
            clean: function (callback) {
                callback("raise error in clean.");
            }
        });

        it("should handle get error.", function (done) {
            errorAll.get("foo", function (err) {
                assert(err === "raise error in get.");
                done();
            });
        });

        it("should handle put error.", function (done) {
            errorAll.put("foo", "bar", function (err) {
                assert(err === "raise error in put.");
                done();
            });
        });

        it("should handle delete error.", function (done) {
            errorAll.delete("foo", function (err) {
                assert(err === "raise error in delete.");
                done();
            });
        });

        it("should handle clean error.", function (done) {
            errorAll.clean(function (err) {
                assert(err === "raise error in clean.");
                done();
            });
        });
    });

    describe("invalid parameter", function () {
        var params;

        beforeEach(function () {
            params = {
                get: function () {},
                put: function () {},
                delete: function () {},
                clean: function () {}
            };
        });

        it("should not raise error if valid params.", function () {
            assert.doesNotThrow(function () {
                chant.create(params);
            });
        });

        [ "get", "put", "delete", "clean"].forEach(function (name) {
            it("should raise error if undefined " + name + " params.", function () {
                delete params[name];
                assert.throws(function () {
                    chant.create(params);
                });
            });
        });
    });


    describe("access params properties", function (done) {

        it("should use self properties.", function (done) {
            var foo = chant.create({
                get: function (key, callback) {
                    callback(null, this._transformTest( key + this._addition ));
                },
                put: function (key, value, callback) { },
                delete: function (key, callback) { },
                clean: function (callback) { },

                _addition: "baz",

                _transformTest: function (v) {
                    return v + v.toUpperCase();
                }
            });

            foo.get("bar", function (err, result) {
                assert(result === "barbazBARBAZ");
                done(err);
            });
        });
    });
});
