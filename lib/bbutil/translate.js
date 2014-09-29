"use strict";

var bbm = require("blue-button-meta");

var codeSystems = bbm.CCDA.codeSystems;

exports.code = function (input) {
    var result = {};
    if (input.code) {
        result.code = input.code;
    }

    if (input.name) {
        result.displayName = input.name;
    }

    var code_system = input.code_system || (input.code_system_name && codeSystems[input.code_system_name] && codeSystems[input.code_system_name][0]);
    if (code_system) {
        result.codeSystem = code_system;
    }

    if (input.code_system_name) {
        result.codeSystemName = input.code_system_name;
    }

    return result;
};
