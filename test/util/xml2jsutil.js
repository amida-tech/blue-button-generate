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

var normalizedDisplayNames = {
    "History of immunizations": 'Immunizations',
    "History of encounters": 'Encounters',
    "Patient Objection": "Patient objection",
    "HISTORY OF PROCEDURES": "History of Procedures",
    "HISTORY OF IMMUNIZATIONS": "Immunizations",
    "HISTORY OF MEDICATION USE": "History of medication use",
    "Payer": "Payers",
    "Treatment plan": "Plan of Care",
    "RESULTS": "Relevant diagnostic tests and/or laboratory data",
    "history of prior surgery   [For Hx of Tx, use H prefix]": "history of prior surgery [For Hx of Tx, use H prefix]",
    "TREATMENT PLAN": "Plan of Care",
    "PAYMENT SOURCES": "Payment sources",
    "VITAL SIGNS": "Vital Signs",
    "Problem list": "Problem List",
    "PROBLEM LIST": "Problem List"
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
    var parser = new xml2js.Parser({
        async: false,
        normalize: true
    });
    parser.parseString(xmlModified, callback);
};
