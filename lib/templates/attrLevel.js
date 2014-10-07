"use strict";

var translate = require('../bbutil/translate');

exports.data = function (key) {
    return function (input) {
        return input && input[key];
    };
};

exports.code = translate.code;

exports.time = translate.time;
