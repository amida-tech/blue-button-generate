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
                    entryLevel.procedureActivityObservation
                ],
                dataKey: "procedures"
            }
        ]
    }]
};

exports.planOfCareSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            common.templateId("2.16.840.1.113883.10.20.22.2.10"),
            common.templateCode("PlanOfCareSection"),
            common.templateTitle("PlanOfCareSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    "typeCode": function (input) {
                        return input.type === "observation" ? "DRIV" : null;
                    }
                },
                content: [
                    entryLevel.planOfCareActivityAct,
                    entryLevel.planOfCareActivityObservation,
                    entryLevel.planOfCareActivityProcedure,
                    entryLevel.planOfCareActivityEncounter,
                    entryLevel.planOfCareActivitySubstanceAdministration,
                    entryLevel.planOfCareActivitySupply,
                    entryLevel.planOfCareActivityInstructions
                ],
                dataKey: "plan_of_care"
            }
        ]
    }]
};

exports.payersSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            common.templateId("2.16.840.1.113883.10.20.22.2.18"),
            common.templateCode("PayersSection"),
            common.templateTitle("PayersSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    typeCode: "DRIV"
                },
                content: entryLevel.coverageActivity,
                dataKey: "payers"
            }
        ]
    }]
};

exports.vitalsSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            common.templateId("2.16.840.1.113883.10.20.22.2.4"),
            common.templateId("2.16.840.1.113883.10.20.22.2.4.1"),
            common.templateCode("VitalSignsSection"),
            common.templateTitle("VitalSignsSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    typeCode: "DRIV"
                },
                content: entryLevel.vitalSignsOrganizer,
                dataKey: "vitals"
            }
        ]
    }]
};

exports.resultsSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            common.templateId("2.16.840.1.113883.10.20.22.2.3"),
            common.templateId("2.16.840.1.113883.10.20.22.2.3.1"),
            common.templateCode("ResultsSection"),
            common.templateTitle("ResultsSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    typeCode: "DRIV"
                },
                content: entryLevel.resultOrganizer,
                dataKey: "results"
            }
        ]
    }]
};

exports.socialHistorySectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            common.templateId("2.16.840.1.113883.10.20.22.2.17"),
            common.templateCode("SocialHistorySection"),
            common.templateTitle("SocialHistorySection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    typeCode: "DRIV"
                },
                content: [
                    entryLevel.smokingStatusObservation,
                    entryLevel.socialHistoryObservation
                ],
                dataKey: "social_history"
            }
        ]
    }]
};
