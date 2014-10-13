"use strict";

var fieldLevel = require('../fieldLevel');
var attrLevel = require('../attrLevel');
var common = require("../common");
var condition = require('../condition');
var contentModifier = require("../contentModifier");

var key = contentModifier.key;
var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

var sel = require("./sharedEntryLevel");

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

var allergyIntoleranceObservation = exports.allergyIntoleranceObservation = {
    key: "observation",
    attributes: {
        "classCode": "OBS",
        "moodCode": "EVN",
        "negationInd": attrLevel.booleanData("negation_indicator") // TODO: Double check.  It does not exist on the template
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.7"),
        fieldLevel.id,
        common.templateCode("AllergyObservation"),
        common.completed,
        fieldLevel.effectiveTime, {
            key: "value",
            attributes: [{
                    "xsi:type": "CD"
                },
                attrLevel.code
            ],
            dataKey: 'intolerance',
            existsWhen: condition.eitherKeyExists('code', 'name'),
        }, {
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
            content: sel.reactionObservation,
            dataKey: 'reactions',
            existsWhen: condition.keyExists('reaction')
        }, {
            key: "entryRelationship",
            attributes: {
                "typeCode": "SUBJ",
                "inversionInd": "true"
            },
            content: sel.severityObservation,
            existsWhen: condition.keyExists('severity')
        }
    ],
    dataKey: "observation",
};

var allergyProblemAct = exports.allergyProblemAct = {
    key: "act",
    attributes: {
        classCode: "ACT",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.30"),
        fieldLevel.id,
        common.templateCode("AllergyProblemAct"),
        common.active, // this is not constant in spec
        fieldLevel.effectiveTime, {
            key: "entryRelationship",
            attributes: {
                typeCode: "SUBJ",
                inversionInd: "true" // is not in spec, need to be checked
            },
            content: allergyIntoleranceObservation,
            existsWhen: condition.keyExists('observation')
        }
    ]
};
