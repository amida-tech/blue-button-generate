"use strict";

var fieldLevel = require('./fieldLevel');
var attrLevel = require('./attrLevel');
var common = require("./common");
var condition = require('./condition');

var allergyStatusObservation = {
    key: "observation",
    attributes: {
        "classCode": "OBS",
        "moodCode": "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.28"),
        common.templateCode("AllergyStatusObservation"),
        common.completed, {
            key: "value",
            attributes: [{
                    "xsi:type": "CE"
                },
                attrLevel.code
            ],
            existsWhen: condition.eitherKeyExists('code', 'name')
        }

    ],
    dataKey: "status"
};

var severityObservation = {
    key: "observation",
    attributes: {
        "classCode": "OBS",
        "moodCode": "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.8"),
        common.templateCode("SeverityObservation"),
        common.completed, {
            key: "value",
            attributes: [{
                    "xsi:type": "CD"
                },
                attrLevel.code
            ],
            dataKey: "code",
            existsWhen: condition.eitherKeyExists('code', 'name')
        }, {
            key: "interpretationCode",
            attributes: attrLevel.code,
            dataKey: "interpretation",
            existsWhen: condition.eitherKeyExists('code', 'name')
        }
    ],
    dataKey: "severity",
    existsWhen: condition.keyExists('code')
};

var reactionObservation = exports.reactionObservation = {
    key: "observation",
    attributes: {
        "classCode": "OBS",
        "moodCode": "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.9"),
        fieldLevel.id,
        common.nullFlavor("code"),
        common.completed,
        fieldLevel.effectiveTime(), {
            key: "value",
            attributes: [{
                    "xsi:type": "CD"
                },
                attrLevel.code
            ],
            dataKey: 'reaction',
            existsWhen: condition.eitherKeyExists('code', 'name'),
            required: true
        }, {
            key: "entryRelationship",
            attributes: {
                "typeCode": "SUBJ",
                "inversionInd": "true"
            },
            content: [
                severityObservation
            ],
            existsWhen: condition.keyExists('severity')
        }
    ]
};

var allergyIntoleranceObservation = exports.allergyIntoleranceObservation = [{
    key: "participant",
    attributes: {
        "typeCode": "CSM"
    },
    content: [{
        key: "participantRole",
        attributes: {
            "classCode": "MANU"
        },
        content: [{
            key: "playingEntity",
            attributes: {
                classCode: "MMAT"
            },
            content: [{
                key: "code",
                attributes: [
                    attrLevel.code
                ],
                content: [{
                    key: "originalText",
                    content: [{
                        key: "reference",
                        attributes: [
                            attrLevel.code
                        ]
                    }]
                }, {
                    key: "translation",
                    attributes: [
                        attrLevel.code
                    ],
                    dataKey: "translations"
                }]
            }]
        }]
    }],
    dataKey: 'allergen'
}, {
    key: "entryRelationship",
    attributes: {
        "typeCode": "SUBJ",
        "inversionInd": "true"
    },
    content: [
        allergyStatusObservation
    ],
    existsWhen: condition.keyExists("status")
}, {
    key: "entryRelationship",
    attributes: {
        "typeCode": "MFST",
        "inversionInd": "true"
    },
    content: [
        reactionObservation
    ],
    dataKey: 'reactions',
    existsWhen: condition.keyExists('reaction')
}, {
    key: "entryRelationship",
    attributes: {
        "typeCode": "SUBJ",
        "inversionInd": "true"
    },
    content: [
        severityObservation
    ],
    existsWhen: condition.keyExists('severity')
}];
