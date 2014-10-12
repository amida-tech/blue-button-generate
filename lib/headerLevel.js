"use strict";

var fieldLevel = require('./fieldLevel');
var attrLevel = require('./attrLevel');
var common = require("./common");
var condition = require('./condition');

var patientName = Object.create(common.usRealmName);
patientName.attributes = {
    use: "L"
};

var patient = exports.patient = {
    key: "patient",
    content: [
        patientName, {
            key: "administrativeGenderCode",
            attributes: {
                code: function (input) {
                    return input.substring(0, 1);
                },
                codeSystem: "2.16.840.1.113883.5.1",
                codeSystemName: "HL7 AdministrativeGender",
                displayName: attrLevel.input
            },
            dataKey: "gender"
        },
        fieldLevel.effectiveTime(undefined, "birthTime", "dob"), {
            key: "maritalStatusCode",
            attributes: {
                code: function (input) {
                    return input.substring(0, 1);
                },
                displayName: attrLevel.input,
                codeSystem: "2.16.840.1.113883.5.2",
                codeSystemName: "HL7 Marital Status"
            },
            dataKey: "marital_status"
        }, {
            key: "religiousAffiliationCode",
            attributes: attrLevel.codeName("2.16.840.1.113883.5.1076"),
            dataKey: "religion"
        }, {
            key: "ethnicGroupCode",
            attributes: attrLevel.codeName("2.16.840.1.113883.6.238"),
            dataKey: "race_ethnicity",
            existsWhen: function (input) {
                return input === "Hispanic or Latino";
            }
        }, {
            key: "raceCode",
            attributes: attrLevel.codeName("2.16.840.1.113883.6.238"),
            dataKey: "race_ethnicity",
            existsWhen: function (input) {
                return input !== "Hispanic or Latino";
            }
        }, {
            key: "guardian",
            content: [{
                    key: "code",
                    attributes: attrLevel.codeName("2.16.840.1.113883.5.111"),
                    dataKey: "relation"
                }, common.usRealmAddress("addr", "addresses"),
                common.telecom, {
                    key: "guardianPerson",
                    content: {
                        key: "name",
                        content: [{
                            key: "given",
                            text: attrLevel.data("first")
                        }, {
                            key: "family",
                            text: attrLevel.data("last")
                        }],
                        dataKey: "names"
                    }
                }
            ],
            dataKey: "guardians"
        }, {
            key: "birthplace",
            content: {
                key: "place",
                content: common.usRealmAddress("addr", "birthplace")
            },
            existsWhen: condition.keyExists("birthplace")
        }, {
            key: "languageCommunication",
            content: [{
                key: "languageCode",
                attributes: {
                    code: attrLevel.input
                },
                dataKey: "language"
            }, {
                key: "modeCode",
                attributes: attrLevel.codeName("2.16.840.1.113883.5.60"),
                dataKey: "mode"
            }, {
                key: "proficiencyLevelCode",
                attributes: {
                    code: function (input) {
                        return input.substring(0, 1);
                    },
                    displayName: attrLevel.input,
                    codeSystem: "2.16.840.1.113883.5.61",
                    codeSystemName: "LanguageAbilityProficiency"
                },
                dataKey: "proficiency"
            }, {
                key: "preferenceInd",
                attributes: {
                    value: function (input) {
                        return input.toString();
                    }
                },
                dataKey: "preferred"
            }],
            dataKey: "languages"
        }
    ]
};

var recordTarget = exports.recordTarget = {
    key: "recordTarget",
    content: {
        key: "patientRole",
        content: [
            fieldLevel.id,
            common.usRealmAddress("addr", "addresses"),
            common.telecom,
            patient
        ]
    },
    dataKey: "demographics"
};

exports.header = [{
        key: "realmCode",
        attributes: {
            code: "US"
        }
    }, {
        key: "typeId",
        attributes: {
            root: "2.16.840.1.113883.1.3",
            extension: "POCD_HD000040"
        }
    },
    common.templateId("2.16.840.1.113883.10.20.22.1.1"),
    common.templateId("2.16.840.1.113883.10.20.22.1.2"),
    fieldLevel.id, {
        key: "code",
        attributes: {
            codeSystem: "2.16.840.1.113883.6.1",
            codeSystemName: "LOINC",
            code: "34133-9",
            displayName: "Summarization of Episode Note"
        }
    }, {
        key: "title",
        text: "Community Health and Hospitals: Health Summary"
    },
    fieldLevel.effectiveTime(true), {
        key: "confidentialityCode",
        attributes: {
            code: "N",
            codeSystem: "2.16.840.1.113883.5.25"
        }
    }, {
        key: "languageCode",
        attributes: {
            code: "en-US"
        }
    }, {
        key: "setId",
        attributes: {
            extension: "sTT988",
            root: "2.16.840.1.113883.19.5.99999.19"
        }
    }, {
        key: "versionNumber",
        attributes: {
            value: "1"
        }
    },
    recordTarget
];
