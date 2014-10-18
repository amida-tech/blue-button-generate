"use strict";

var t = require("./templatePath");

module.exports = [{
    xpath: "//*[@nullFlavor]",
    action: "removeNode"
}, {
    xpath: "//h:text",
    action: "removeNode"
}, {
    xpath: " //h:telecom[@use='WP']",
    action: "normalizeTelNumber"
}, {
    xpath: "//h:originalText",
    action: "removeNode"
}, {
    xpath: "//h:code[@codeSystemVersion]",
    action: "removeAttribute",
    params: "codeSystemVersion"
}, {
    xpath: "//*[@assigningAuthorityName]",
    action: "removeAttribute",
    params: "assigningAuthorityName"
}, {
    xpath: t.medSupplyOrder + '/h:product',
    action: "removeNode"
}, {
    xpath: t.medSupplyOrder + '/h:performer',
    action: "removeNode"
}, {
    xpath: t.medDispense + '/h:product',
    action: "removeNode",
    comment: "not read by parser"
}, {
    xpath: t.medDispense + '/h:product',
    action: "removeNode",
    comment: "not read by parser"
}, {
    xpath: t.medDispense + '/h:quantity',
    action: "removeNode",
    comment: "not read by parser"
}, {
    xpath: t.medDispense + '/h:repeatNumber',
    action: "removeNode",
    comment: "not read by parser"
}, {
    xpath: t.medDispense + '/h:effectiveTime',
    action: "removeNode",
    comment: "not read by parser"
}, {
    xpath: t.medDispense + '/h:performer/h:assignedEntity/h:assignedPerson',
    action: "removeNode",
    comment: "not read by parser"
}, {
    xpath: t.medActivityInstructions,
    action: "removeNode",
    comment: "not read by parser"
}, {
    xpath: t.immRefusalReason + '/h:id',
    action: "removeNode",
    comment: "not read by parser"
}, {
    xpath: t.procProductInstance,
    action: "removeNode",
    comment: "not read by parser"
}, {
    xpath: t.payersSection + '/.//h:time',
    action: "removeNode"
}, {
    xpath: t.probObservation + '/h:code',
    action: "removeNode"
}, {
    xpath: t.vitalsSection + '/..',
    action: "flatten",
    params: "2.16.840.1.113883.10.20.22.4.27"
}, {
    xpath: t.vitalsSection + '/h:entry',
    action: 'removeNode'
}, {
    xpath: '//h:recordTarget/h:patientRole/h:patient/h:ethnicGroupCode',
    action: 'removeNode'
}, {
    xpath: '//h:recordTarget/h:patientRole/h:providerOrganization',
    action: 'removeNode'
}];
