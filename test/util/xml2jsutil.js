"use strict";

var xml2js = require('xml2js');
var jsonutil = require('../util/jsonutil');

exports.findSection = (function () {
    var templateIdsForSection = {
        'allergies': ["2.16.840.1.113883.10.20.22.2.6", "2.16.840.1.113883.10.20.22.2.6.1"],
        'medications': ["2.16.840.1.113883.10.20.22.2.1", "2.16.840.1.113883.10.20.22.2.1.1"],
        'immunizations': ["2.16.840.1.113883.10.20.22.2.2", "2.16.840.1.113883.10.20.22.2.2.1"],
        'procedures': ["2.16.840.1.113883.10.20.22.2.7", "2.16.840.1.113883.10.20.22.2.7.1"],
        'encounters': ["2.16.840.1.113883.10.20.22.2.22"],
        'payers': ["2.16.840.1.113883.10.20.22.2.18"],
        'plan_of_care': ["2.16.840.1.113883.10.20.22.2.10"],
        'problems': ["2.16.840.1.113883.10.20.22.2.5", "2.16.840.1.113883.10.20.22.2.5.1"],
        'social_history': ["2.16.840.1.113883.10.20.22.2.17"],
        'vitals': ["2.16.840.1.113883.10.20.22.2.4", "2.16.840.1.113883.10.20.22.2.4.1"],
        'results': ["2.16.840.1.113883.10.20.22.2.3", "2.16.840.1.113883.10.20.22.2.3.1"]
    };

    var findNormalSection = function (ccd, sectionName) {
        var root = jsonutil.getDeepValue(ccd, 'ClinicalDocument.component.0.structuredBody.0.component');
        if (root) {
            var n = root.length;
            var templateIds = templateIdsForSection[sectionName];
            for (var i = 0; i < n; ++i) {
                var sectionInfo = root[i].section[0];
                var ids = sectionInfo.templateId;
                if (ids) {
                    for (var j = 0; j < ids.length; ++j) {
                        var id = ids[j];
                        for (var k = 0; k < templateIds.length; ++k) {
                            var templateId = templateIds[k];
                            if (id['$'].root === templateId) {
                                return root[i].section[0];
                            }
                        }
                    }
                }
            }
        }
        return null;
    };

    var findDemographics = function (ccd) {
        var result = jsonutil.getDeepValue(ccd, 'ClinicalDocument.recordTarget.0.patientRole.0');
        return result;
    };

    return function (ccd, sectionName) {
        if (sectionName === 'demographics') {
            return findDemographics(ccd);
        } else {
            return findNormalSection(ccd, sectionName);
        }
    };
})();

exports.toOrderedJSON = function (xml, callback) {
    var parser = new xml2js.Parser({
        async: false,
        normalize: true
    });
    parser.parseString(xml, function (err, result) {
        if (err) {
            callback(err);
        } else {
            var orderedResult = jsonutil.orderByKeys(result);
            callback(err, orderedResult);
        }
    });
};
