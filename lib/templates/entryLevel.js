"use strict";

var fieldLevel = require('./fieldLevel');
var attrLevel = require('./attrLevel');
var common = require("./common");
var condition = require('./condition');

var severityObservation = (function () {
    var f = function (input) {
        return {
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
                '+': condition.keyOrKeyExist('code', 'name')
            },
            "interpretationCode": {
                "$": {
                    "@": attrLevel.code
                },
                '#': "interpretation",
                '+': condition.keyOrKeyExist('code', 'name')
            }
        };
    };
    f['#'] = "severity";
    f['+'] = condition.keyExists('code');
    return f;
})();

var reactionObservation = exports.reactionObservation = (function () {
    var f = function (input) {
        return {
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
                '+': condition.keyOrKeyExist('code', 'name'),
                '*': true
            },
            "entryRelationship": {
                "$": {
                    "typeCode": "SUBJ",
                    "inversionInd": "true"
                },
                "observation": severityObservation,
                "+": condition.eitherChildKeyExists('severity', 'code', 'name')
            }
        };
    };
    return f;
})();

var allergyIntoleranceObservation = exports.allergyIntoleranceObservation = (function () {
    var f = function (input) {
        return {
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
    };
    return f;
})();
