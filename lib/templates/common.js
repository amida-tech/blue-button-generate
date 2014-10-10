"use strict";

var bbm = require("blue-button-meta");

var attrLevel = require("./attrLevel");
var condition = require("./condition");
var fieldLevel = require("./fieldLevel");
var translate = require("../bbutil/translate");

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

exports.statusCodeNew = {
    key: "statusCode",
    attributes: {
        code: 'new'
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

exports.templateTitle = function (name) {
    var raw = templateCodes[name];
    var result = {
        key: "title",
        text: raw.name,
    };
    return result;
};

var usRealmAddress = exports.usRealmAddress = function (key) {
    return {
        key: key,
        attributes: {
            use: attrLevel.use("use")
        },
        content: [{
            key: "country",
            text: attrLevel.data("country")
        }, {
            key: "state",
            text: attrLevel.data("state")
        }, {
            key: "city",
            text: attrLevel.data("city")
        }, {
            key: "postalCode",
            text: attrLevel.data("zip")
        }, {
            key: "streetAddressLine",
            text: attrLevel.input,
            dataKey: "street_lines"
        }],
        dataKey: "address"
    };
};

var usRealmName = exports.usRealmName = {
    key: "name",
    content: [{
        key: "family",
        text: attrLevel.data("family")
    }, {
        key: "given",
        text: attrLevel.input,
        dataKey: "given"
    }, {
        key: "prefix",
        text: attrLevel.data("prefix")
    }, {
        key: "suffix",
        text: attrLevel.data("suffix")
    }],
    dataKey: "name",
    dataTransform: translate.name
};

var telecom = exports.telecom = {
    key: "telecom",
    attributes: {
        value: attrLevel.data("value"),
        use: attrLevel.data("use")
    },
    dataTransform: translate.telecom
};

var representedOrganization = {
    key: "representedOrganization",
    content: [
        fieldLevel.id, {
            key: "name",
            text: attrLevel.input,
            dataKey: "name"
        },
        usRealmAddress("addr"),
        telecom
    ],
    dataKey: "organization"
};

var assignedEntity = exports.assignedEntity = {
    key: "assignedEntity",
    content: [{
            key: "code",
            attributes: attrLevel.code,
            dataKey: "code"
        },
        fieldLevel.id,
        usRealmAddress("addr"),
        telecom, {
            key: "assignedPerson",
            content: usRealmName,
            existsWhen: condition.keyExists("name")
        },
        representedOrganization
    ],
    existsWhen: condition.eitherKeyExists("address", "identifiers", "organization", "name")
};

exports.author = {
    key: "author",
    content: [
        fieldLevel.effectiveTime(true, "time"), {
            key: "assignedAuthor",
            content: [
                fieldLevel.id, {
                    key: "assignedPerson",
                    content: usRealmName
                }
            ]
        }
    ],
    dataKey: "author"
};
