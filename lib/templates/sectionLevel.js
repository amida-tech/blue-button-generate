"use strict";

var bbm = require("blue-button-meta");

var common = require("./common");
var entryLevel = require("./entryLevel");

var sec = bbm.CCDA.sections_entries_codes;
var tid = common.templateId;
var txt = common.text;
var contains = common.contains;

// var sectionCode = function (name) {
//     var raw = sec[name];
//     var result = {
//         "$": {
//             code: raw.code,
//             displayName: raw.name,
//             codeSystem: raw.code_system,
//             codeSystemName: raw.code_system_name
//         }
//     }
//     return result;
// }

// exports.allergiesSectionEntriesRequired = {
//     "templateId": [tid("2.16.840.1.113883.10.20.22.2.6"), tid("2.16.840.1.113883.10.20.22.2.6.1")],
//     "code": sectionCode("AllergiesSection"),
//     "title": sec["AllergiesSection"].name,
//     "text": txt(""),
//     "entry": [contains(entryLevel.allergyProblemAct)]
// };
