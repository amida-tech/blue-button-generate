"use strict";

var bbm = require("blue-button-meta");

var templateCodes = bbm.CCDA.sections_entries_codes.codes;

exports.completed = {
    "$": {
        code: 'completed'
    }
};

exports.nullFlavor = {
    "$": {
        nullFlavor: "UNK"
    }
};

exports.templateId = function (id) {
    return {
        "$": {
            "root": id
        }
    };
};

exports.templateCode = function (name) {
    var raw = templateCodes[name];
    var result = {
        "$": {
            code: raw.code,
            displayName: raw.name,
            codeSystem: raw.code_system,
            codeSystemName: raw.code_system_name
        }
    };
    return result;
};
