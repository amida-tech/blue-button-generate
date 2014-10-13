"use strict";

var translate = require('./translate');

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

exports.codeCodeOnly = function (OID, key) {
    var f = translate.codeName(OID);
    return function (input) {
        if (input && input[key]) {
            return f(input[key]).code;
        } else {
            return null;
        }
    };
};

exports.time = translate.time;

exports.immunizationActivityAttributes = function (input) {
    if (input.status) {
        if (input.status === "refused") {
            return {
                moodCode: "EVN",
                negationInd: "true"
            };
        }
        if (input.status === "pending") {
            return {
                moodCode: "INT",
                negationInd: "false"
            };
        }
        if (input.status === "complete") {
            return {
                moodCode: "EVN",
                negationInd: "false"
            };
        }
    }
    return null;
};

exports.use = function (key) {
    return function (input) {
        var value = input && input[key];
        if (value) {
            return translate.acronymize(value);
        } else {
            return null;
        }
    };
};
