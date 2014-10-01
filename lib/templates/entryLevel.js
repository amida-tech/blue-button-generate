"use strict";

var fieldLevel = require('./fieldLevel');
var attrLevel = require('./attrLevel');
var common = require("./common");
var condition = require('./condition');

var severityObservation = {
    "$": {
        "classCode": "OBS",
        "moodCode": "EVN"
    },
    "templateId": common.templateId("2.16.840.1.113883.10.20.22.4.8"),
    "code": common.templateCode("SeverityObservation"),
    "text": fieldLevel.text,
    "statusCode": common.completed,
    "value": {
        "$": {
            "xsi:type": "CD",
            "@": attrLevel.code
        },
        "#": "code",
        '+': condition.eitherKeyExists('code', 'name')
    },
    "interpretationCode": {
        "$": {
            "@": attrLevel.code
        },
        '#': "interpretation",
        '+': condition.eitherKeyExists('code', 'name')
    },
    '#': "severity",
    '+': condition.keyExists('code')
};

var reactionObservation = exports.reactionObservation = {
    "$": {
        "classCode": "OBS",
        "moodCode": "EVN"
    },
    "templateId": common.templateId("2.16.840.1.113883.10.20.22.4.9"),
    "id": fieldLevel.id,
    "code": common.nullFlavor,
    "text": fieldLevel.text,
    "statusCode": common.completed,
    "effectiveTime": fieldLevel.effectiveTime,
    "value": {
        "$": {
            "xsi:type": "CD",
            "@": attrLevel.code
        },
        '#': 'reaction',
        '+': condition.eitherKeyExists('code', 'name'),
        '*': true
    },
    "entryRelationship": {
        "$": {
            "typeCode": "SUBJ",
            "inversionInd": "true"
        },
        "observation": severityObservation,
        "+": condition.keyExists('severity')
    }
};

var allergyIntoleranceObservation = exports.allergyIntoleranceObservation = {
    "entryRelationship": {
        "$": {
            "typeCode": "MFST",
            "inversionInd": "true"
        },
        "observation": reactionObservation,
        '#': 'reactions',
        '+': condition.keyExists('reaction')
    }
};