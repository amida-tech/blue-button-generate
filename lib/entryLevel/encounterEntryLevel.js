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

exports.encounterActivities = {
    key: "encounter",
    attributes: {
        classCode: "ENC",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.49"),
        fieldLevel.id, {
            key: "code",
            attributes: [
                leafLevel.code
            ],
            content: [{
                key: "originalText",
                content: [{
                    key: "reference",
                    attributes: [
                        leafLevel.code
                    ]
                }]
            }, {
                key: "translation",
                attributes: [
                    leafLevel.code
                ],
                dataKey: "translations"
            }],
            dataKey: "encounter"
        },
        fieldLevel.effectiveTime, {
            key: "performer",
            content: common.assignedEntity,
            dataKey: "performers"
        }, {
            key: "participant",
            attributes: {
                typeCode: "LOC"
            },
            content: sharedEntryLevel.serviceDeliveryLocation,
            dataKey: "locations"
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "RSON"
            },
            content: [
                sharedEntryLevel.indication
            ],
            dataKey: "findings",
            dataTransform: function (input) {
                input = input.map(function (e) {
                    e.code = {
                        code: "404684003",
                        name: "Finding",
                        code_system: "2.16.840.1.113883.6.96",
                        code_system_name: "SNOMED CT"
                    };
                    return e;
                });
                return input;
            }
        }
    ]
};
