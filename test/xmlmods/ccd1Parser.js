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

var normalizedDisplayNames = {
  "HISTORY OF MEDICATION USE": "History of medication use",
  "History of immunizations": "Immunizations",
  "Patient Objection": "Patient objection",
  "HISTORY OF PROCEDURES": "History of Procedures",
  "History of encounters": "Encounters",
  "Payer": "Payers",
  "Treatment plan": "Plan of Care",
  "PROBLEM LIST": "Problem List",
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
}, {
  xpath: "//*[@codeSystem][@codeSystemName]",
  action: "normalize",
  params: {
    attr: "codeSystemName",
    srcAttr: "codeSystem",
    map: normalizedCodeSystemNames
  },
  comment: 'blue-button parser normalization'
}, {
  xpath: "//*[@codeSystem][@displayName][@code]",
  action: "normalize",
  params: {
    attr: "displayName",
    srcAttr: "code",
    map: normalizedDisplayNames
  },
  comment: 'blue-button parser normalization'
}, {
  xpath: "//*[@codeSystem=\"2.16.840.1.113883.5.1\"]",
  action: "addAttributeWhenEmpty",
  params: {
    "codeSystemName": "HL7 AdministrativeGender"
  }
}, {
  xpath: "//*[@codeSystem=\"2.16.840.1.113883.6.96\"]",
  action: "addAttributeWhenEmpty",
  params: {
    "codeSystemName": "SNOMED CT"
  }
}, {
  xpath: "//*[@codeSystem=\"2.16.840.1.113883.6.1\"]",
  action: "addAttributeWhenEmpty",
  params: {
    "codeSystemName": "LOINC"
  }
}, {
  xpath: "//*[@codeSystem=\"2.16.840.1.113883.6.88\"]",
  action: "addAttributeWhenEmpty",
  params: {
    "codeSystemName": "RXNORM"
  }
}, {
  xpath: "//*[@codeSystem=\"2.16.840.1.113883.5.6\"]",
  action: "addAttributeWhenEmpty",
  params: {
    "codeSystemName": "HL7ActClass"
  }
}, {
  xpath: "//*[@codeSystem=\"2.16.840.1.113883.5.111\"]",
  action: "addAttributeWhenEmpty",
  params: {
    "codeSystemName": "HL7 Role"
  }
}, {
  xpath: "//*[@codeSystem=\"2.16.840.1.113883.5.83\"][@code=\"N\"]",
  action: "addAttributeWhenEmpty",
  params: {
    "codeSystemName": "ObservationInterpretation",
    "displayName": "Normal"
  }
}, {
  xpath: "//*[@codeSystem=\"2.16.840.1.113883.5.83\"][@code=\"L\"]",
  action: "addAttributeWhenEmpty",
  params: {
    "codeSystemName": "ObservationInterpretation",
    "displayName": "Low"
  }
}, {
  xpath: t.allergyObs + "/h:code[@codeSystem=\"2.16.840.1.113883.5.4\"][@code=\"ASSERTION\"]",
  action: "addAttributeWhenEmpty",
  params: {
    "codeSystemName": "ActCode",
    "displayName": "Assertion"
  }
}, {
  xpath: t.socHistObs + "/h:code[@codeSystem=\"2.16.840.1.113883.5.4\"][@code=\"ASSERTION\"]",
  action: "addAttributeWhenEmpty",
  params: {
    "codeSystemName": "ActCode",
    "displayName": "Assertion"
  }
}, {
  xpath: t.allergiesSection + "/h:code[@code=\"48765-2\"]",
  action: "addAttributeWhenEmpty",
  params: {
    "displayName": "Allergies, adverse reactions, alerts"
  }
}];
