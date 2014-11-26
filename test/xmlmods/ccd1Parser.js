"use strict";

var t = require("./templatePath");

var titleMap = {
    "ALLERGIES, ADVERSE REACTIONS, ALERTS": "Allergies, adverse reactions, alerts",
    "MEDICATIONS": "History of medication use",
    "IMMUNIZATIONS": "Immunizations",
    "PROCEDURES": "History of Procedures",
    "ENCOUNTERS": "Encounters",
    "INSURANCE PROVIDERS": "Payers",
    "PLAN OF CARE": "Plan of Care",
    "PROBLEMS": "Problem List",
    "SOCIAL HISTORY": "Social History",
    "VITAL SIGNS": "Vital Signs",
    "RESULTS": "Relevant diagnostic tests and/or laboratory data"
};

var normalizedCodeSystemNames = {
    "RxNorm": "RXNORM",
    "SNOMED-CT": "SNOMED CT",
    "NCI Thesaurus": "Medication Route FDA",
    "National Cancer Institute (NCI) Thesaurus": "Medication Route FDA",
    "HL7 ActNoImmunizationReason": "Act Reason",
    "HL7 ActEncounterCode": "ActCode",
    "HL7 RoleClassRelationship": "HL7 RoleCode",
    "HL7 Role code": "HL7 Role",
    "HL7 RoleCode": {
        src: "2.16.840.1.113883.5.111",
        value: "HL7 Role"
    },
    "MaritalStatusCode": "HL7 Marital Status",
    "Race & Ethnicity - CDC": "Race and Ethnicity - CDC"
};

module.exports = [{
    xpath: "//h:title",
    action: "replaceText",
    params: titleMap,
    comment: "titles may differ"
}, {
    xpath: t.immSection + '/.//h:effectiveTime[@xsi:type="IVL_TS"]',
    action: "removeAttribute",
    params: "type"
}, {
    xpath: t.immInstructions,
    action: "addAttribute",
    params: {
        "inversionInd": "true"
    },
    comment: "erroneous in the sample file"
}, {
    xpath: t.medSection + '/.//h:effectiveTime[@xsi:type="IVL_TS"]',
    action: "removeAttribute",
    params: "type"
}, {
    xpath: "//*[@codeSystem][@codeSystemName]",
    action: "normalize",
    params: {
        attr: "codeSystemName",
        srcAttr: "codeSystem",
        map: normalizedCodeSystemNames
    },
    comment: 'blue-button parser normalization'
}];
