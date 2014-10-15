"use strict";

var leafLevel = require("./leafLevel");
var condition = require("./condition");
var fieldLevel = require("./fieldLevel");
var translate = require("./translate");
var contentModifier = require("./contentModifier");

var key = contentModifier.key;
var required = contentModifier.required;

exports.nullFlavor = function (name) {
    return {
        key: name,
        attributes: {
            nullFlavor: "UNK"
        }
    };
};

var usRealmAddress = exports.usRealmAddress = function (key, dataKey) {
    return {
        key: key,
        attributes: {
            use: leafLevel.use("use")
        },
        content: [{
            key: "country",
            text: leafLevel.data("country")
        }, {
            key: "state",
            text: leafLevel.data("state")
        }, {
            key: "city",
            text: leafLevel.data("city")
        }, {
            key: "postalCode",
            text: leafLevel.data("zip")
        }, {
            key: "streetAddressLine",
            text: leafLevel.input,
            dataKey: "street_lines"
        }],
        dataKey: dataKey || "address"
    };
};

var usRealmName = exports.usRealmName = {
    key: "name",
    content: [{
        key: "family",
        text: leafLevel.data("family")
    }, {
        key: "given",
        text: leafLevel.input,
        dataKey: "given"
    }, {
        key: "prefix",
        text: leafLevel.data("prefix")
    }, {
        key: "suffix",
        text: leafLevel.data("suffix")
    }],
    dataKey: "name",
    dataTransform: translate.name
};

var telecom = exports.telecom = {
    key: "telecom",
    attributes: {
        value: leafLevel.data("value"),
        use: leafLevel.data("use")
    },
    dataTransform: translate.telecom
};

var representedOrganization = {
    key: "representedOrganization",
    content: [
        fieldLevel.id, {
            key: "name",
            text: leafLevel.input,
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
            attributes: leafLevel.code,
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
        [fieldLevel.effectiveTime, required, key("time")], {
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
