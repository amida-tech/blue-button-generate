"use strict";

var bbm = require("blue-button-meta");

var templateCodes = bbm.CCDA.sections_entries_codes.codes;

exports.completed = {
    key: "statusCode",
    attributes: {
        code: 'completed'
    }
};

exports.active = {
    key: "statusCode",
    attributes: {
        code: 'active'
    }
};

exports.nullFlavor = function (name) {
    return {
        key: name,
        attributes: {
            nullFlavor: "UNK"
        }
    };
};

exports.templateId = function (id) {
    return {
        key: "templateId",
        attributes: {
            "root": id
        }
    };
};

exports.templateCode = function (name) {
    var raw = templateCodes[name];
    var result = {
        key: "code",
        attributes: {
            code: raw.code,
            displayName: raw.name,
            codeSystem: raw.code_system,
            codeSystemName: raw.code_system_name
        }
    };
    return result;
};
