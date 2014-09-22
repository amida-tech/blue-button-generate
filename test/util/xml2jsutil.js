"use strict";

exports.findSection = function (sections, templateId) {
    var n = sections.length;
    for (var i = 0; i < n; ++i) {
        var sectionInfo = sections[i].section[0];
        var ids = sectionInfo.templateId;
        if (ids) {
            for (var j = 0; j < ids.length; ++j) {
                var id = ids[j];
                if (id['$'].root === templateId) {
                    return sections[i].section[0];
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
                    if ((index + 5) === t.length) {
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
    "Patient Objection": "Patient objection"
};

var normalizedCodeSystemNames = {
    "National Cancer Institute (NCI) Thesaurus": "Medication Route FDA",
    "NCI Thesaurus": "Medication Route FDA",
    "HL7 ActNoImmunizationReason": "Act Reason",
    "RxNorm": "RXNORM"
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
