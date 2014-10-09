"use strict";

var translate = require('../bbutil/translate');

exports.input = function (input) {
    return input;
};

exports.data = function (key) {
    return function (input) {
        return input && input[key];
    };
};

exports.booleanData = function (key) {
    return function (input) {
        if (input && input.hasOwnProperty(key)) {
            return input[key].toString();
        } else {
            return null;
        }
    };
};

exports.code = translate.code;

exports.codeName = translate.codeName;

exports.time = translate.time;
