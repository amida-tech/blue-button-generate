"use strict";

var libxmljs = require("libxmljs");
var libCCDAGen = require("../lib/templating_functions.js");

var js2xml = require("./templates/js2xml");
var entryLevel = require("./templates/entryLevel");

var updateIndication = function (xmlDoc, indication) {
    if (indication) {
        var er = xmlDoc.node('entryRelationship').attr({
            typeCode: "RSON"
        });
        var ob = er.node('observation').attr({
            classCode: "OBS",
            moodCode: "EVN"
        });
        ob.node('templateId').attr({
            root: "2.16.840.1.113883.10.20.22.4.19"
        });
        libCCDAGen.id(ob, indication.identifiers);
        libCCDAGen.code(ob, indication.code);
        ob.node('statusCode').attr({
            code: "completed"
        });
        libCCDAGen.effectiveTime(ob, indication.date_time);
        libCCDAGen.value(ob, indication.value, "CD");
    }
};

var updateDrugVehicle = function (xmlDoc, drugVehicle) {
    if (drugVehicle) {
        var p = xmlDoc.node('participant').attr({
            typeCode: "CSM"
        });
        var pr = p.node('participantRole').attr({
            classCode: "MANU"
        }); // drug vehicle
        pr.node('templateId').attr({
            root: "2.16.840.1.113883.10.20.22.4.24"
        });
        pr.node('code').attr({
            code: "412307009",
            displayName: "drug vehicle",
            codeSystem: "2.16.840.1.113883.6.96"
        });
        var pe = pr.node('playingEntity').attr({
            classCode: "MMAT"
        });
        libCCDAGen.code(pe, drugVehicle);
        pe.node('name', drugVehicle.name);
    }
};

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
        if (data[i].product.unencoded_name) {
            libCCDAGen.consumable(sa, data[i].product, data[i].product.unencoded_name);
        } else {
            libCCDAGen.consumable(sa, data[i].product, "");
        }
        libCCDAGen.performerRevised(sa, data[i].performer);
        updateDrugVehicle(sa, data[i].drug_vehicle);
        updateIndication(sa, data[i].indication);

        js2xml.update(sa, data[i], entryLevel.medicationActivity);

        libCCDAGen.precondition(sa, data[i].precondition);
    }
    xmlDoc = xmlDoc.parent() // end section
        .parent(); // end clinicalDocument

    return isCCD ? xmlDoc : doc;
};
