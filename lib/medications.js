"use strict";

var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");

var js2xml = require("./templates/js2xml");
var entryLevel = require("./templates/entryLevel");

var administrationAttrs = function (entry) {
    var attrs = {
        classCode: "SBADM"
    };
    var status = entry.status;
    if (status === 'Prescribed') {
        attrs.moodCode = 'INT';
    } else if (status === 'Completed') {
        attrs.moodCode = 'EVN';
    }
    return attrs;
};

module.exports = function (data, codeSystems, isCCD, CCDxml) {

    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAGen.header(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.1", "2.16.840.1.113883.10.20.22.2.1.1", "10160-0",
        "2.16.840.1.113883.6.1", "LOINC", "HISTORY OF MEDICATION USE", "MEDICATIONS", isCCD);

    // entries loop
    for (var i = 0; i < data.length; i++) {
        var e = xmlDoc.node('entry').attr({
            typeCode: "DRIV"
        });
        var sa = e.node('substanceAdministration').attr(administrationAttrs(data[i]));
        sa.node('templateId').attr({
            root: "2.16.840.1.113883.10.20.22.4.16"
        });
        libCCDAGen.id(sa, data[i]["identifiers"]);
        if (data[i].sig) {
            sa.node('text', data[i].sig).node('reference').attr({
                value: "#MedSec_" + (i + 1)
            });
        }
        sa.node('statusCode').attr({
            code: 'completed'
        });
        if (data[i].date_time) {
            libCCDAGen.effectiveTime(sa, data[i].date_time);
        }
        if (data[i].administration && data[i].administration.interval) {
            var interval = sa.node('effectiveTime')
                .attr({
                    "xsi:type": "PIVL_TS"
                })
                .attr({
                    institutionSpecified: "true"
                })
                .attr({
                    operator: "A"
                });
            var period = data[i].administration.interval.period;
            if (period) {
                interval.node('period').attr({
                    value: period.value,

                    unit: period.unit
                });
            }
        }
        libCCDAGen.medication_administration(sa, data[i].administration);

        js2xml.update(sa, data[i], entryLevel.medicationActivity);
    }
    xmlDoc = xmlDoc.parent() // end section
        .parent(); // end clinicalDocument

    return isCCD ? xmlDoc : doc;
};
