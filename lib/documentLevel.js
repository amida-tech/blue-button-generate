"use strict";

var headerLevel = require('./headerLevel');
var fieldLevel = require('./fieldLevel');
var leafLevel = require('./leafLevel');
var sectionLevel = require('./sectionLevel');
var contentModifier = require("./contentModifier");
var condition = require("./condition");

var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

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
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.1.2"), [fieldLevel.id, dataKey("meta.identifiers")], {
            key: "code",
            attributes: {
                codeSystem: "2.16.840.1.113883.6.1",
                codeSystemName: "LOINC",
                code: "34133-9",
                displayName: "Summarization of Episode Note"
            }
        }, {
            key: "title",
            text: leafLevel.inputProperty("title"),
            dataKey: "meta.ccda_header"
        },
        [fieldLevel.effectiveTimeNow, required], {
            key: "confidentialityCode",
            attributes: leafLevel.codeFromName("2.16.840.1.113883.5.25"),
            dataKey: "meta.confidentiality"
        }, {
            key: "languageCode",
            attributes: {
                code: "en-US"
            }
        }, {
            key: "setId",
            attributes: {
                root: leafLevel.inputProperty("identifier"),
                extension: leafLevel.inputProperty("extension")
            },
            dataKey: 'meta.set_id',
            existsWhen: condition.keyExists('identifier')
        }, {
            key: "versionNumber",
            attributes: {
                value: "1"
            }
        },
        headerLevel.recordTarget,
        headerLevel.headerAuthor,
        headerLevel.headerInformant,
        headerLevel.headerCustodian,
        headerLevel.providers, {
            key: "component",
            content: {
                key: "structuredBody",
                content: [
                    [sectionLevel.allergiesSectionEntriesRequired, required],
                    [sectionLevel.medicationsSectionEntriesRequired, required],
                    [sectionLevel.problemsSectionEntriesRequired, required],
                    [sectionLevel.proceduresSectionEntriesRequired, required],
                    [sectionLevel.resultsSectionEntriesRequired, required],
                    sectionLevel.encountersSectionEntriesOptional,
                    sectionLevel.immunizationsSectionEntriesOptional,
                    sectionLevel.payersSection,
                    sectionLevel.planOfCareSection,
                    sectionLevel.socialHistorySection,
                    sectionLevel.vitalSignsSectionEntriesOptional
                ],
                notImplemented: [
                    "advanceDirectivesSectionEntriesOptional",
                    "familyHistorySection",
                    "functionalStatusSection",
                    "medicalEquipmentSection",
                ]
            },
            dataKey: 'data'
        }
    ]
};

var sectionLevel2 = require('./sectionLevel2');

exports.ccd2 = function (html_renderer) {
    var ccd_template = {
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
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.1.2"), [fieldLevel.id, dataKey("meta.identifiers")], {
                key: "code",
                attributes: {
                    codeSystem: "2.16.840.1.113883.6.1",
                    codeSystemName: "LOINC",
                    code: "34133-9",
                    displayName: "Summarization of Episode Note"
                }
            }, {
                key: "title",
                text: leafLevel.inputProperty("title"),
                dataKey: "meta.ccda_header"
            },
            [fieldLevel.effectiveTimeNow, required], {
                key: "confidentialityCode",
                attributes: leafLevel.codeFromName("2.16.840.1.113883.5.25"),
                dataKey: "meta.confidentiality"
            }, {
                key: "languageCode",
                attributes: {
                    code: "en-US"
                }
            }, {
                key: "setId",
                attributes: {
                    root: leafLevel.inputProperty("identifier"),
                    extension: leafLevel.inputProperty("extension")
                },
                dataKey: 'meta.set_id',
                existsWhen: condition.keyExists('identifier')
            }, {
                key: "versionNumber",
                attributes: {
                    value: "1"
                }
            },
            headerLevel.recordTarget,
            headerLevel.headerAuthor,
            headerLevel.headerInformant,
            headerLevel.headerCustodian,
            headerLevel.providers, {
                key: "component",
                content: {
                    key: "structuredBody",
                    content: [
                        [sectionLevel2.allergiesSectionEntriesRequired(html_renderer.allergiesSectionEntriesRequiredHtmlHeader), required],
                        [sectionLevel2.medicationsSectionEntriesRequired(html_renderer.medicationsSectionEntriesRequiredHtmlHeader), required],
                        [sectionLevel2.problemsSectionEntriesRequired(html_renderer.problemsSectionEntriesRequiredHtmlHeader), required],
                        [sectionLevel2.proceduresSectionEntriesRequired(html_renderer.proceduresSectionEntriesRequiredHtmlHeader), required],
                        [sectionLevel2.resultsSectionEntriesRequired(html_renderer.resultsSectionEntriesRequiredHtmlHeader), required],
                        sectionLevel2.encountersSectionEntriesOptional(html_renderer.encountersSectionEntriesOptionalHtmlHeader),
                        sectionLevel2.immunizationsSectionEntriesOptional(html_renderer.immunizationsSectionEntriesOptionalHtmlHeader),
                        sectionLevel2.payersSection(html_renderer.payersSectionHtmlHeader),
                        sectionLevel2.planOfCareSection(html_renderer.planOfCareSectionHtmlHeader),
                        sectionLevel2.socialHistorySection(html_renderer.socialHistorySectionHtmlHeader),
                        sectionLevel2.vitalSignsSectionEntriesOptional(html_renderer.vitalSignsSectionEntriesOptionalHtmlHeader)
                    ],
                    notImplemented: [
                        "advanceDirectivesSectionEntriesOptional",
                        "familyHistorySection",
                        "functionalStatusSection",
                        "medicalEquipmentSection",
                    ]
                },
                dataKey: 'data'
            }
        ]
    };
    return ccd_template;
};
