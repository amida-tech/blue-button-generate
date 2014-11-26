"use strict";

var t = require("./templatePath");

module.exports = [{
    xpath: "//*[@nullFlavor]",
    action: "removeNode"
}, {
    xpath: "//h:text",
    action: "removeNode"
}, {
    xpath: "//h:originalText",
    action: "removeNode"
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
}, {
    xpath: "//h:effectiveTime[@value] | //h:effectiveTime/h:low[@value] | //h:effectiveTime/h:high[@value]",
    action: "removeTimezone",
    comment: "parser bug: timezones are not read"
}];
