"use strict";

var xml2js = require('xml2js');

var xpathutil = require('./xpathutil');

exports.findSection = function (sections, templateIds) {
    var n = sections.length;
    for (var i = 0; i < n; ++i) {
        var sectionInfo = sections[i].section[0];
        var ids = sectionInfo.templateId;
        if (ids) {
            for (var j = 0; j < ids.length; ++j) {
                var id = ids[j];
                for (var k = 0; k < templateIds.length; ++k) {
                    var templateId = templateIds[k];
                    if (id['$'].root === templateId) {
                        return sections[i].section[0];
                    }
                }
            }
        }
    }
    return null;
};

// Parser does not keep time zones.  This removes them from original until that is fixed
exports.removeTimeZones = function removeTimeZones(original) {
    Object.keys(original).forEach(function (key) {
        if ((key === '$') && original[key]) {
            var t = original[key].value;
            if (t && (typeof t === 'string')) {
                if (t.length > 14) {
                    var index = t.indexOf('-');
                    if (index < 0) {
                        index = t.indexOf('+');
                    }
                    if ((index > 12) && (index + 5) === t.length) {
                        original[key].value = t.slice(0, index);
                    }
                }
            }
        } else if (original[key] && (typeof original[key] === 'object')) {
            removeTimeZones(original[key]);
        }
    });
};

var normalizedDisplayNames = {
    "History of immunizations": 'Immunizations',
    "Patient Objection": "Patient objection",
    "HISTORY OF PROCEDURES": "History of Procedures",
    "HISTORY OF IMMUNIZATIONS": "Immunizations",
    "Payer": "Payers",
    "Treatment plan": "Plan of Care",
    "RESULTS": "Relevant diagnostic tests and/or laboratory data",
    "history of prior surgery   [For Hx of Tx, use H prefix]": "history of prior surgery [For Hx of Tx, use H prefix]",
    "TREATMENT PLAN": "Plan of Care",
    "PAYMENT SOURCES": "Payment sources",
    "Problem list": "PROBLEM LIST"
};

var normalizedCodeSystemNames = {
    "National Cancer Institute (NCI) Thesaurus": "Medication Route FDA",
    "NCI Thesaurus": "Medication Route FDA",
    "HL7 ActNoImmunizationReason": "Act Reason",
    "AdministrativeGender": "HL7 AdministrativeGender",
    "MaritalStatus": "HL7 Marital Status",
    "MaritalStatusCode": "HL7 Marital Status",
    "RxNorm": "RXNORM",
    "SNOMED-CT": "SNOMED CT",
    "SNOMED -CT": "SNOMED-CT",
    "HL7 ActEncounterCode": "HL7ActCode",
    "HL7 RoleClassRelationship": "HL7 RoleCode",
    "HL7 RoleCode": "HL7 Role",
    "HL7 Role code": "HL7 Role",
    "Race & Ethnicity - CDC": "Race and Ethnicity - CDC",
    "CPT-4": "CPT",
    "RoleCode": "HL7 Role",
    "ActCode": "HL7ActCode",
    "RoleClassRelationshipFormal": "HL7 RoleCode"
};

exports.processIntroducedCodeAttrs = function processIntroducedCodeAttrs(original, generated) {
    Object.keys(generated).forEach(function (key) {
        if ((key === '$') && original[key]) {
            var originalAttrs = original[key];
            var generatedAttrs = generated[key];
            ['codeSystem', 'codeSystemName', 'displayName'].forEach(function (attr) {
                if (generatedAttrs[attr] && !originalAttrs[attr]) {
                    delete generatedAttrs[attr];
                }
            });
            if (originalAttrs.codeSystemName && (originalAttrs.codeSystemName !== generatedAttrs.codeSystemName)) {
                if (normalizedCodeSystemNames[originalAttrs.codeSystemName]) {
                    originalAttrs.codeSystemName = normalizedCodeSystemNames[originalAttrs.codeSystemName];
                }
            }
            if (originalAttrs.displayName && (originalAttrs.displayName !== generatedAttrs.displayName)) {
                if (normalizedDisplayNames[originalAttrs.displayName]) {
                    originalAttrs.displayName = normalizedDisplayNames[originalAttrs.displayName];
                }
            }
        } else if (original[key] && (typeof original[key] === 'object') && (typeof generated[key] === 'object')) {
            processIntroducedCodeAttrs(original[key], generated[key]);
        }
    });
};

exports.modifyAndToObject = function (xml, modifications, callback) {
    var xmlModified = xpathutil.modifyXML(xml, modifications);
    var parser = new xml2js.Parser();
    parser.parseString(xmlModified, callback);
};
