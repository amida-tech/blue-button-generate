"use strict";

var libxmljs = require("libxmljs");
var libCCDAgen = require("../lib/templating_functions.js");
var bbm = require("blue-button-meta");
var sec_entries_codes = bbm.CCDA.sections_entries_codes.codes;

var js2xml = require("./templates/js2xml");
var entryLevel = require("./templates/entryLevel");

module.exports = function (data, codeSystems, isCCD, CCDxml) {
    // create a new xml document and generate the header
    var doc = new libxmljs.Document();
    var xmlDoc = libCCDAgen.header_v2(!isCCD ? doc : CCDxml, "2.16.840.1.113883.10.20.22.2.6", "2.16.840.1.113883.10.20.22.2.6.1",
        sec_entries_codes["AllergiesSection"], "ALLERGIES, ADVERSE REACTIONS, ALERTS", isCCD);

    // Now loop over each entry in the data set
    for (var i = 0; i < data.length; i++) {
        var e = xmlDoc.node('entry').attr({
            typeCode: "DRIV"
        });
        js2xml.fillUsingTemplate(e, data[i], entryLevel.allergyProblemAct);
    }
    xmlDoc = xmlDoc.parent() // end section
        .parent(); // end clinicalDocument (or component)
    return isCCD ? xmlDoc : doc;
};
