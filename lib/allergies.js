"use strict";

var libxmljs = require("libxmljs");
var libCCDAgen = require("../lib/templating_functions.js");
var bbm = require("blue-button-meta");
var sec_entries_codes = bbm.CCDA.sections_entries_codes.codes;

var js2xml = require("./templates/js2xml");
var entryLevel = require("./templates/entryLevel");

var observationAttrs = function (observation) {
    var attrs = {
        classCode: "OBS",
        moodCode: "EVN"
    };
    if (observation.hasOwnProperty('negation_indicator')) {
        attrs.negationInd = observation.negation_indicator.toString();
    }
    return attrs;
};

var updateAllergen = function (xmlDoc, allergen, index) {
    if (allergen) {
        var p = xmlDoc.node('participant').attr({
            typeCode: "CSM"
        });
        var pr = p.node('participantRole').attr({
            classCode: "MANU"
        });
        var pe = pr.node('playingEntity').attr({
            classCode: "MMAT"
        });
        var c = libCCDAgen.code(pe, allergen);
        c.node('originalText').node('reference').attr({
            value: "#allergen" + (index + 1)
        });
    } else {
        xmlDoc.node('participant').attr({
            nullFlavor: "UNK"
        });
    }
};

var updateObservation = function (xmlDoc, observation, index) {
    if (observation) {
        var er = xmlDoc.node('entryRelationship').attr({
            typeCode: "SUBJ",
            inversionInd: "true"
        });
        var ob = er.node('observation').attr(observationAttrs(observation));
        ob.node('templateId').attr({
            root: "2.16.840.1.113883.10.20.22.4.7"
        }); // allergy intolerance observation
        libCCDAgen.id(ob, observation.identifiers);
        libCCDAgen.asIsCode(ob, sec_entries_codes.AllergyObservation);
        ob.node('statusCode').attr({
            code: 'completed'
        });
        if (observation.date_time) {
            libCCDAgen.effectiveTime(ob, observation.date_time);
        }
        if (observation.intolerance) {
            libCCDAgen.value(ob, observation.intolerance, "CD", (index + 1));
        }
        updateAllergen(ob, observation.allergen, index);
        js2xml.update(ob, observation, entryLevel.allergyIntoleranceObservation);
    }
};

var updateEntry = function (xmlDoc, entry, index) {
    var e = xmlDoc.node('entry').attr({
        typeCode: "DRIV"
    });
    var act = e.node('act').attr({
        classCode: "ACT",
        moodCode: "EVN"
    });
    act.node('templateId').attr({
        root: "2.16.840.1.113883.10.20.22.4.30"
    });
    libCCDAgen.id(act, entry.identifiers);
    libCCDAgen.asIsCode(act, sec_entries_codes.AllergiesSection);
    act.node('statusCode').attr({
        code: 'active'
    });
    if (entry.date_time) {
        libCCDAgen.effectiveTime(act, entry.date_time);
    }
    updateObservation(act, entry.observation, index);
};

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    // create a new xml document and generate the header
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAgen.header_v2(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.6", "2.16.840.1.113883.10.20.22.2.6.1",
        sec_entries_codes["AllergiesSection"], "ALLERGIES, ADVERSE REACTIONS, ALERTS", isCCD);

    // Now loop over each entry in the data set
    for (var i = 0; i < data.length; i++) {
        updateEntry(xmlDoc, data[i], i);
    }
    xmlDoc = xmlDoc.parent() // end section
        .parent(); // end clinicalDocument (or component)
    return isCCD ? xmlDoc : doc;
};
