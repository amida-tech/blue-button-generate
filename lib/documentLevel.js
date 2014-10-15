var headerLevel = require('./headerLevel');
var fieldLevel = require('./fieldLevel');
var sectionLevel = require('./sectionLevel');
var common = require("./common");
var contentModifier = require("./contentModifier");

var required = contentModifier.required;

exports.ccd = {
    key: "ClinicalDocument",
    attributes: {
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "xmlns": "urn:hl7-org:v3",
        "xmlns:cda": "urn:hl7-org:v3",
        "xmlns:sdtc": "urn:hl7-org:sdtc"
    },
    content: [{
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
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.1.1"),
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.1.2"),
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
        [fieldLevel.effectiveTime, required], {
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
        headerLevel.recordTarget, {
            key: "component",
            content: {
                key: "structuredBody",
                content: [
                    sectionLevel.allergiesSectionEntriesRequired,
                    sectionLevel.encountersSectionEntriesRequired,
                    sectionLevel.immunizationsSectionEntriesRequired,
                    sectionLevel.medicationsSectionEntriesRequired,
                    sectionLevel.payersSectionEntriesRequired,
                    sectionLevel.planOfCareSectionEntriesRequired,
                    sectionLevel.problemsSectionEntriesRequired,
                    sectionLevel.proceduresSectionEntriesRequired,
                    sectionLevel.resultsSectionEntriesRequired,
                    sectionLevel.socialHistorySectionEntriesRequired,
                    sectionLevel.vitalsSectionEntriesRequired
                ]
            }
        }
    ]
};
