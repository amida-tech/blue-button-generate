"use strict";

exports.keyExists = function (key) {
    return function (input) {
        return input[key];
    };
};

exports.eitherKeyExists = function (key0, key1, key2) {
    return function (input) {
        return input[key0] || input[key1] || input[key2];
    };
};

exports.eitherChildKeyExists = function (key, childKey0, childKey1) {
    return function (input) {
        var v = input[key];
        return v && (v[childKey0] || v[childKey1]);
    };
};
