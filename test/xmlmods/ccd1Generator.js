"use strict";

var t = require("./templatePath");

module.exports = [{
    xpath: t.medSection + '/.//h:effectiveTime[@xsi:type="IVL_TS"]',
    action: "removeAttribute",
    params: "type"
}, {
    xpath: t.immSection + '/.//h:effectiveTime[@xsi:type="IVL_TS"]',
    action: "removeAttribute",
    params: "type"
}];
