"use strict";

var t = require("./templatePath");

module.exports = [{
    xpath: "//*[@nullFlavor]"
}, {
    xpath: "//h:text"
}, {
    xpath: "//h:originalText"
}, {
    xpath: t.payersSection + '/.//h:time',
    action: "removeNode"
}, {
    xpath: t.vitalsSection + '/..',
    action: "flatten",
    params: "2.16.840.1.113883.10.20.22.4.27"
}, {
    xpath: t.vitalsSection + '/h:entry',
    action: 'removeNode'
}];
