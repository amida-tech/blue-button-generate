"use strict";

var bbm = require("blue-button-meta");

var common = require("./common");
var entryLevel = require("./entryLevel");

var sec = bbm.CCDA.sections_entries_codes;
var tid = common.templateId;
var txt = common.text;
var contains = common.contains;

exports.allergiesSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            common.templateId("2.16.840.1.113883.10.20.22.2.6"),
            common.templateId("2.16.840.1.113883.10.20.22.2.6.1"),
            common.templateCode("AllergiesSection"),
            common.templateTitle("AllergiesSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    "typeCode": "DRIV"
                },
                content: [
                    entryLevel.allergyProblemAct
                ],
                dataKey: "allergies"
            }
        ]
    }]
};
