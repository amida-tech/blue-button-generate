"use strict";

var fieldLevel = require('../fieldLevel');
var leafLevel = require('../leafLevel');
var common = require("../common");
var condition = require("../condition");
var contentModifier = require("../contentModifier");

var sharedEntryLevel = require("./sharedEntryLevel");

var key = contentModifier.key;
var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

var problemStatus = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.6"),
        fieldLevel.id,
        common.templateCode("ProblemStatus"),
        common.statusCodeCompleted,
        fieldLevel.effectiveTime, {
            key: "value",
            attributes: [{
                    "xsi:type": "CD"
                },
                leafLevel.codeName("2.16.840.1.113883.3.88.12.80.68", {
                    codeSystem: "2.16.840.1.113883.6.96",
                    codeSystemName: "SNOMED CT"
                })
            ],
            dataKey: "name"
        }
    ]
};

var healthStatusObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.5"),
        common.templateCode("HealthStatusObservation"),
        common.statusCodeCompleted, {
            key: "value",
            attributes: {
                "xsi:type": "CD",
                code: "81323004", // TODO fix
                codeSystem: "2.16.840.1.113883.6.96",
                codeSystemName: "SNOMED CT",
                displayName: leafLevel.data("patient_status")
            }
        }
    ]
};

var problemObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN",
        negationInd: leafLevel.booleanData("negation_indicator")
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.4"),
        fieldLevel.id,
        common.statusCodeCompleted, [fieldLevel.effectiveTime, dataKey("problem.date_time")], {
            key: "value",
            attributes: [{
                    "xsi:type": "CD"
                },
                leafLevel.code
            ],
            content: [{
                key: "translation",
                attributes: leafLevel.code,
                dataKey: "translations"
            }],
            dataKey: "problem.code",
            existsWhen: condition.eitherKeyExists('code', 'name')
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "REFR"
            },
            content: problemStatus,
            dataTransform: function (input) {
                if (input && input.status) {
                    var result = input.status;
                    result.identifiers = input.identifiers;
                    return result;
                }
                return null;
            }
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "SUBJ",
                inversionInd: "true"
            },
            content: sharedEntryLevel.ageObservation,
            existsWhen: condition.keyExists("onset_age")
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "REFR"
            },
            content: healthStatusObservation,
            existsWhen: condition.keyExists("patient_status")
        }
    ]
};

exports.problemConcernAct = {
    key: "act",
    attributes: {
        classCode: "ACT",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.3"),
        common.templateCode("ProblemConcernAct"), {
            key: "id",
            attributes: {
                root: leafLevel.data("identifier"),
                extension: leafLevel.data("extension")
            },
            dataKey: 'source_list_identifiers',
            existsWhen: condition.keyExists('identifier'),
            required: true
        },
        common.statusCodeCompleted,
        fieldLevel.effectiveTime, {
            key: "entryRelationship",
            attributes: {
                typeCode: "SUBJ"
            },
            content: problemObservation
        }
    ]
};
