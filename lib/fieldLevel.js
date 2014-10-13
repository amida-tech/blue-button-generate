"use strict";

var condition = require('./condition');
var leafLevel = require('./leafLevel');

exports.id = {
    key: "id",
    attributes: {
        root: leafLevel.data("identifier"),
        extension: leafLevel.data("extension")
    },
    dataKey: 'identifiers',
    existsWhen: condition.keyExists('identifier'),
    required: true
};

exports.effectiveTime = {
    key: "effectiveTime",
    attributes: {
        "value": leafLevel.time,
    },
    attributeKey: 'point',
    content: [{
        key: "low",
        attributes: {
            "value": leafLevel.time
        },
        dataKey: 'low',
    }, {
        key: "high",
        attributes: {
            "value": leafLevel.time
        },
        dataKey: 'high',
    }, {
        key: "center",
        attributes: {
            "value": leafLevel.time
        },
        dataKey: 'center',
    }],
    dataKey: 'date_time',
    existsWhen: condition.eitherKeyExists('point', 'low', 'high', 'center')
};

exports.text = {
    key: "text",
    text: leafLevel.data("value"),
    content: [{
        key: "reference",
        attributes: {
            "value": leafLevel.data("reference")
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
