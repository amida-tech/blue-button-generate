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

var procedureActivity = [{
        key: "templateId",
        attributes: {
            "root": "2.16.840.1.113883.10.20.22.4.12"
        },
        existsWhen: function (input) {
            return input.procedure_type === "act";
        }
    }, {
        key: "templateId",
        attributes: {
            "root": "2.16.840.1.113883.10.20.22.4.13"
        },
        existsWhen: function (input) {
            return input.procedure_type === "observation";
        }
    }, {
        key: "templateId",
        attributes: {
            "root": "2.16.840.1.113883.10.20.22.4.14"
        },
        existsWhen: function (input) {
            return input.procedure_type === "procedure";
        }
    }, fieldLevel.id, {
        key: "code",
        attributes: leafLevel.code,
        dataKey: "procedure"
    }, {
        key: "value",
        attributes: {
            "xsi:type": "CD"
        },
        existsWhen: function (input) {
            return input.procedure_type === "observation";
        }
    }, {
        key: "priorityCode",
        attributes: leafLevel.code,
        dataKey: "priority"
    }, {
        key: "statusCode",
        attributes: leafLevel.codeName("2.16.840.1.113883.11.20.9.22"),
        dataKey: "status"
    }, {
        key: "targetSiteCode",
        attributes: leafLevel.code,
        dataKey: "body_sites"
    }, {
        key: "performer",
        content: common.assignedEntity,
        dataKey: "performer"
    }, {
        key: "participant",
        attributes: {
            typeCode: "LOC"
        },
        content: sharedEntryLevel.serviceDeliveryLocation,
        dataKey: "locations"
    },
    fieldLevel.effectiveTime, {
        key: "specimen",
        attributes: {
            typeCode: "SPC"
        },
        content: {
            key: "specimenRole",
            attributes: {
                classCode: "SPEC"
            },
            content: [
                fieldLevel.id, {
                    key: "specimenPlayingEntity",
                    content: {
                        key: "code",
                        attributes: leafLevel.code,
                        dataKey: "code"
                    },
                    existsWhen: condition.keyExists("code")
                }
            ]
        },
        dataKey: "specimen"
    }
];

exports.procedureActivityAct = {
    key: "act",
    attributes: {
        classCode: "ACT",
        moodCode: "INT" // not constant in the specification
    },
    content: procedureActivity,
    existsWhen: function (input) {
        return input.procedure_type === "act";
    }
};

exports.procedureActivityProcedure = {
    key: "procedure",
    attributes: {
        classCode: "PROC",
        moodCode: "EVN" // not constant in the specification
    },
    content: procedureActivity,
    existsWhen: function (input) {
        return input.procedure_type === "procedure";
    }
};

exports.procedureActivityObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN" // not constant in the specification
    },
    content: procedureActivity,
    existsWhen: function (input) {
        return input.procedure_type === "observation";
    }
};
