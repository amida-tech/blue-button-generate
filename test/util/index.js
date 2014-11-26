"use strict";

var xpathutil = require('./xpathutil');
var xml2jsutil = require('./xml2jsutil');

var bb = require('blue-button');
var bbg = require('../../index');

exports.toSectionJSONs = function (xml, mods, callback) {
    if (mods) {
        xml = xpathutil.modifyXML(xml, mods);
    }
    xml2jsutil.toOrderedSectionJSONs(xml, callback);
};

exports.toBBSectionJSONs = function (xml, validate, mods, callback) {
    var bbJSON = bb.parseString(xml);
    if (validate) {
        var val = bb.validator.validateDocumentModel(bbJSON);
        if (!val) {
            callback(new Error("Validation failed."));
            return;
        }
    }

    var xmlGenerated = bbg.generateCCD(bbJSON);
    if (mods) {
        xmlGenerated = xpathutil.modifyXML(xmlGenerated, mods);
    }
    xml2jsutil.toOrderedSectionJSONs(xmlGenerated, callback);
};
