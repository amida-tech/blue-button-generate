"use strict";

var bbm = require("blue-button-meta");

var templateCodes = bbm.CCDA.sections_entries_codes.codes;

exports.completed = {
    attributes: {
        code: 'completed'
    }
};

exports.nullFlavor = {
    attributes: {
        nullFlavor: "UNK"
    }
};

exports.templateId = function (id) {
    return {
        attributes: {
            "root": id
        }
    };
};

exports.templateCode = function (name) {
    var raw = templateCodes[name];
    var result = {
        attributes: {
            code: raw.code,
            displayName: raw.name,
            codeSystem: raw.code_system,
            codeSystemName: raw.code_system_name
        }
    };
    return result;
};
