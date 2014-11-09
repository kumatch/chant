var assert = require('power-assert');
var chant = require("../");

describe("chant#chain", function () {

    describe("basic", function () {
        var d1 = {}, d2 = {};
        var basic;

        var front = chant.create({
            get: function (key, callback) {
                callback(null, d1[key]);
            },

            put: function (key, value, callback) {
                d1[key] = value;
                callback(null, "put front");
            },

            delete: function (key, callback) {
                delete d1[key];
                callback(null, "delete front");
            },

            clean: function (callback) {
                d1 = {};
                callback(null, "clean front");
            }
        });

        var back = chant.create({
            get: function (key, callback) {
                callback(null, d2[key]);
            },

            put: function (key, value, callback) {
                d2[key] = value;
                callback(null, "put back");
            },

            delete: function (key, callback) {
                delete d2[key];
                callback(null, "delete back");
            },

            clean: function (callback) {
                d2 = {};
                callback(null, "clean back");
            }
        });

        var key = "foo";
        var value = "OK.";
        var invalidValue = "NG.";

        beforeEach(function () {
            d1 = {};
            d2 = {};

            basic = chant.chain(front, back);
        });

        it("should put value of key.", function (done) {
            assert(d1[key] === undefined);
            assert(d2[key] === undefined);

            basic.put(key, value, function (err, results) {
                if (err) {
                    done(err);
                    return;
                }

                assert(d1[key] === value);
                assert(d2[key] === value);

                assert(results.length, 2);
                assert(results[0], "put front");
                assert(results[1], "put back");

                done();
            });
        });

        it("should get value of key from front.", function (done) {
            d1[key] = value;
            d2[key] = invalidValue;

            basic.get(key, function (err, result) {
                if (err) {
                    done(err);
                    return;
                }

                assert(result === value);

                assert(d1[key] === value);
                assert(d2[key] === invalidValue);

                done();
            });
        });

        it("should get value of key from back.", function (done) {
            d1[key] = undefined;
            d2[key] = value;

            basic.get(key, function (err, result) {
                if (err) {
                    done(err);
                    return;
                }

                assert(result === value);

                assert(d1[key] === value);
                assert(d2[key] === value);

                done();
            });
        });

        it("should get unfedined if noset key.", function (done) {
            d1[key] = undefined;
            d2[key] = undefined;

            basic.get(key, function (err, result) {
                if (err) {
                    done(err);
                    return;
                }

                assert(result === undefined);
                assert(d1[key] === undefined);
                assert(d2[key] === undefined);

                done();
            });
        });

        it("should delete value of key.", function (done) {
            d1[key] = value;
            d2[key] = value;

            basic.delete(key, function (err, results) {
                if (err) {
                    done(err);
                    return;
                }

                assert(d1[key] === undefined);
                assert(d2[key] === undefined);

                assert(results.length, 2);
                assert(results[0], "delete front");
                assert(results[1], "delete back");

                done();
            });
        });

        it("should clean up if clean task.", function (done) {
            d1[key] = value;
            d2[key] = value;

            basic.clean(function (err, results) {
                if (err) {
                    done(err);
                    return;
                }

                assert(d1[key] === undefined);
                assert(d2[key] === undefined);

                assert(results.length, 2);
                assert(results[0], "clean front");
                assert(results[1], "clean back");

                done();
            });
        });
    });
});
