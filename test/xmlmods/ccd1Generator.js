"use strict";

var t = require("./templatePath");

var normalizedCodeSystemNames = {
    "SNOMED-CT": "SNOMED CT" // codes available from  blue-button-meta should be consinstent with normalization, fix in blue-button-meta
};

module.exports = [{
    xpath: t.medSection + '/.//h:effectiveTime[@xsi:type="IVL_TS"]',
    action: "removeAttribute",
    params: "type"
}, {
    xpath: t.immSection + '/.//h:effectiveTime[@xsi:type="IVL_TS"]',
    action: "removeAttribute",
    params: "type"
}, {
    xpath: "//*[@codeSystem][@codeSystemName]",
    action: "normalize",
    params: {
        attr: "codeSystemName",
        srcAttr: "codeSystem",
        map: normalizedCodeSystemNames
    },
    comment: 'needs to be fixed in blue-button-meta'
}];
