var headerLevel = require('./templates/headerLevel');
var sectionLevel = require('./templates/sectionLevel');

exports.ccd = {
    key: "ClinicalDocument",
    attributes: {
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "xmlns": "urn:hl7-org:v3",
        "xmlns:cda": "urn:hl7-org:v3",
        "xmlns:sdtc": "urn:hl7-org:sdtc"
    },
    content: [
        headerLevel.header, {
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
