"use strict";

var fieldLevel = require('../fieldLevel');
var leafLevel = require('../leafLevel');
var condition = require("../condition");

var vitalSignObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.27"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            content: {
                key: "translation",
                attributes: leafLevel.code,
                dataKey: "translations"
            },
            dataKey: "vital"
        }, {
            key: "statusCode",
            attributes: {
                code: leafLevel.data("status")
            }
        },
        fieldLevel.effectiveTime, {
            key: "value",
            attributes: {
                "xsi:type": "PQ",
                value: leafLevel.data("value"),
                unit: leafLevel.data("unit")
            },
            existsWhen: condition.keyExists("value")
        }, {
            key: "interpretationCode",
            attributes: leafLevel.codeName("2.16.840.1.113883.5.83"),
            dataKey: "interpretations"
        }
    ]
};

exports.vitalSignsOrganizer = {
    key: "organizer",
    attributes: {
        classCode: "CLUSTER",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.26"),
        fieldLevel.id,
        fieldLevel.templateCode("VitalSignsOrganizer"), {
            key: "statusCode",
            attributes: {
                code: leafLevel.data("status")
            }
        },
        fieldLevel.effectiveTime, {
            key: "component",
            content: vitalSignObservation
        }
    ]
};
