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
    xpath: "2.16.840.1.113883.10.20.22.2.2",
    description: "Immunization Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "2.16.840.1.113883.10.20.22.4.20",
        description: "Instructions",
        type: "localTemplateParent",
        action: "addAttribute",
        params: {
            "inversionInd": "true"
        },
        comment: "erroneous in the sample file"
    }, {
        xpath: ".//h:effectiveTime[@xsi:type=\"IVL_TS\"]",
        action: "removeAttribute",
        params: "type"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.1",
    description: "Medications Section (entries optional)",
    type: "rootTemplate",
    childxpaths: [{
        xpath: ".//h:effectiveTime[@xsi:type=\"IVL_TS\"]",
        action: "removeAttribute",
        params: "type"
    }]
}];
