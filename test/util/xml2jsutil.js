"use strict";

var xml2js = require('xml2js');

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

exports.modifyAndToObject = function (xml, callback) {
    var parser = new xml2js.Parser({
        async: false,
        normalize: true
    });
    parser.parseString(xml, callback);
};
