"use strict";

var bbm = require("blue-button-meta");

var common = require("./common");
var entryLevel = require("./entryLevel");

var sec = bbm.CCDA.sections_entries_codes;
var tid = common.templateId;
var txt = common.text;
var contains = common.contains;

exports.allergiesSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            common.templateId("2.16.840.1.113883.10.20.22.2.6"),
            common.templateId("2.16.840.1.113883.10.20.22.2.6.1"),
            common.templateCode("AllergiesSection"),
            common.templateTitle("AllergiesSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    "typeCode": "DRIV"
                },
                content: [
                    entryLevel.allergyProblemAct
                ],
                dataKey: "allergies"
            }
        ]
    }]
};

exports.medicationsSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            common.templateId("2.16.840.1.113883.10.20.22.2.1"),
            common.templateId("2.16.840.1.113883.10.20.22.2.1.1"),
            common.templateCode("MedicationsSection"),
            common.templateTitle("MedicationsSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    "typeCode": "DRIV"
                },
                content: [
                    entryLevel.medicationActivity
                ],
                dataKey: "medications"
            }
        ]
    }]
};

exports.immunizationsSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            common.templateId("2.16.840.1.113883.10.20.22.2.2"),
            common.templateId("2.16.840.1.113883.10.20.22.2.2.1"),
            common.templateCode("ImmunizationsSection"),
            common.templateTitle("ImmunizationsSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    "typeCode": "DRIV"
                },
                content: [
                    entryLevel.immunizationActivity
                ],
                dataKey: "immunizations"
            }
        ]
    }]
};

exports.problemsSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            common.templateId("2.16.840.1.113883.10.20.22.2.5"),
            common.templateId("2.16.840.1.113883.10.20.22.2.5.1"),
            common.templateCode("ProblemSection"),
            common.templateTitle("ProblemSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    "typeCode": "DRIV"
                },
                content: [
                    entryLevel.problemConcernAct
                ],
                dataKey: "problems"
            }
        ]
    }]
};

exports.encountersSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            common.templateId("2.16.840.1.113883.10.20.22.2.22"),
            common.templateId("2.16.840.1.113883.10.20.22.2.22.1"),
            common.templateCode("EncountersSection"),
            common.templateTitle("EncountersSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    "typeCode": "DRIV"
                },
                content: [
                    entryLevel.encounterActivities
                ],
                dataKey: "encounters"
            }
        ]
    }]
};

exports.proceduresSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            common.templateId("2.16.840.1.113883.10.20.22.2.7"),
            common.templateId("2.16.840.1.113883.10.20.22.2.7.1"),
            common.templateCode("ProceduresSection"),
            common.templateTitle("ProceduresSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    "typeCode": function (input) {
                        return input.procedure_type === "procedure" ? "DRIV" : null;
                    }
                },
                content: [
                    entryLevel.procedureActivityAct,
                    entryLevel.procedureActivityProcedure,
                    entryLevel.procedureActivityObservation,
                ],
                dataKey: "procedures"
            }
        ]
    }]
};
