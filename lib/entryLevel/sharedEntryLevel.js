"use strict";

var fieldLevel = require('../fieldLevel');
var leafLevel = require('../leafLevel');
var common = require("../common");
var condition = require('../condition');
var contentModifier = require("../contentModifier");

var key = contentModifier.key;
var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

var severityObservation = exports.severityObservation = {
    key: "observation",
    attributes: {
        "classCode": "OBS",
        "moodCode": "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.8"),
        fieldLevel.templateCode("SeverityObservation"),
        fieldLevel.statusCodeCompleted, {
            key: "value",
            attributes: [
                leafLevel.typeCD,
                leafLevel.code
            ],
            dataKey: "code",
            existsWhen: condition.codeOrDisplayname,
            required: true
        }, {
            key: "interpretationCode",
            attributes: leafLevel.code,
            dataKey: "interpretation",
            existsWhen: condition.codeOrDisplayname
        }
    ],
    dataKey: "severity",
    existsWhen: condition.keyExists("code")
};

var reactionObservation = exports.reactionObservation = {
    key: "observation",
    attributes: {
        "classCode": "OBS",
        "moodCode": "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.9"),
        fieldLevel.id,
        common.nullFlavor("code"),
        fieldLevel.statusCodeCompleted,
        fieldLevel.effectiveTime, {
            key: "value",
            attributes: [{
                    "xsi:type": "CD"
                },
                leafLevel.code
            ],
            dataKey: 'reaction',
            existsWhen: condition.codeOrDisplayname,
            required: true
        }, {
            key: "entryRelationship",
            attributes: {
                "typeCode": "SUBJ",
                "inversionInd": "true"
            },
            content: severityObservation,
            existsWhen: condition.keyExists('severity')
        }
    ]
};

exports.serviceDeliveryLocation = {
    key: "participantRole",
    attributes: {
        classCode: "SDLOC"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.32"), {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "location_type"
        },
        common.usRealmAddress("addr"),
        common.telecom, {
            key: "playingEntity",
            attributes: {
                classCode: "PLC"
            },
            content: {
                key: "name",
                text: leafLevel.data("name"),
            },
            existsWhen: condition.keyExists("name")
        }
    ]
};

exports.ageObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.31"),
        fieldLevel.templateCode("AgeObservation"),
        fieldLevel.statusCodeCompleted, {
            key: "value",
            attributes: {
                "xsi:type": "PQ",
                value: leafLevel.data("onset_age"),
                unit: leafLevel.codeCodeOnly("2.16.840.1.113883.11.20.9.21", "onset_age_unit")
            }
        }
    ]
};

exports.indication = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.19"),
        fieldLevel.id, {
            key: "code",
            attributes: [
                leafLevel.code
            ],
            dataKey: "code"
        },
        fieldLevel.statusCodeCompleted,
        fieldLevel.effectiveTime, {
            key: "value",
            attributes: [{
                    "xsi:type": "CD"
                },
                leafLevel.code
            ],
            dataKey: "value",
            existsWhen: condition.codeOrDisplayname
        }
    ]
};

exports.preconditionForSubstanceAdministration = {
    key: "criterion",
    content: [{
        key: "code",
        attributes: {
            code: leafLevel.data("code"),
            codeSystem: "2.16.840.1.113883.5.4"
        },
        dataKey: "code"
    }, {
        key: "value",
        attributes: [{
                "xsi:type": "CE"
            },
            leafLevel.code
        ],
        dataKey: "value",
        existsWhen: condition.codeOrDisplayname
    }]
};

exports.drugVehicle = {
    key: "participantRole",
    attributes: {
        classCode: "MANU"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.24"), {
            key: "code",
            attributes: {
                code: "412307009",
                displayName: "drug vehicle",
                codeSystem: "2.16.840.1.113883.6.96"
            }
        }, {
            key: "playingEntity",
            attributes: {
                classCode: "MMAT"
            },
            content: [{
                key: "code",
                attributes: leafLevel.code
            }, {
                key: "name",
                text: leafLevel.data("name")
            }]
        }
    ]
};

exports.instructions = {
    key: "act",
    attributes: {
        classCode: "ACT",
        moodCode: "INT"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.20"), {
            key: "code",
            attributes: [
                leafLevel.code
            ],
            dataKey: "code"
        }, {
            key: "text",
            text: leafLevel.data("free_text")
        },
        fieldLevel.statusCodeCompleted
    ]
};
