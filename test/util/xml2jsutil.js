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
