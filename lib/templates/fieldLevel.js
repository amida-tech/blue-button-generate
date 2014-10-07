"use strict";

var condition = require('./condition');
var attrLevel = require('./attrLevel');

exports.id = {
    attributes: {
        root: attrLevel.data("identifier"),
        extension: attrLevel.data("extension")
    },
    dataKey: 'identifiers',
    existsWhen: condition.keyExists('identifier'),
    required: true
};

exports.effectiveTime = function (required) {
    return {
        attributes: {
            "value": attrLevel.time,
        },
        attributeKey: 'point',
        content: {
            low: {
                attributes: {
                    "value": attrLevel.time
                },
                dataKey: 'low',
            },
            high: {
                attributes: {
                    "value": attrLevel.time
                },
                dataKey: 'high',
            }
        },
        dataKey: 'date_time',
        existsWhen: condition.eitherKeyExists('point', 'low', 'high'),
        required: required
    };
};

exports.text = {
    text: attrLevel.data("value"),
    content: {
        "reference": {
            attributes: {
                "value": attrLevel.data("reference")
            }
        }
    },
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
