"use strict";

var condition = require('./condition');
var attrLevel = require('./attrLevel');

exports.id = {
    key: "id",
    attributes: {
        root: attrLevel.data("identifier"),
        extension: attrLevel.data("extension")
    },
    dataKey: 'identifiers',
    existsWhen: condition.keyExists('identifier'),
    required: true
};

exports.effectiveTime = function (required, key, dataKey) {
    return {
        key: key || "effectiveTime",
        attributes: {
            "value": attrLevel.time,
        },
        attributeKey: 'point',
        content: [{
            key: "low",
            attributes: {
                "value": attrLevel.time
            },
            dataKey: 'low',
        }, {
            key: "high",
            attributes: {
                "value": attrLevel.time
            },
            dataKey: 'high',
        }, {
            key: "center",
            attributes: {
                "value": attrLevel.time
            },
            dataKey: 'center',
        }],
        dataKey: dataKey || 'date_time',
        existsWhen: condition.eitherKeyExists('point', 'low', 'high', 'center'),
        required: required
    };
};

exports.text = {
    key: "text",
    text: attrLevel.data("value"),
    content: [{
        key: "reference",
        attributes: {
            "value": attrLevel.data("reference")
        }
    }],
    dataKey: 'text',
    existsWhen: condition.eitherKeyExists('reference', 'value'),
    required: true
};

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
