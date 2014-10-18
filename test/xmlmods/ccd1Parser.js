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
}];
