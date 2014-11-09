
var CallbackClass = require('./class/callback');
var ChainedClass  = require('./class/chained');

exports.create = function (params) {
    return CallbackClass(params);
};

exports.chain = function (front, back) {
    return ChainedClass(front, back);
};
