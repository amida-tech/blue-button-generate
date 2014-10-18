"use strict";

var t = require("./templatePath");

module.exports = [{
    xpath: "//h:recordTarget/h:patientRole/h:patient/h:ethnicGroupCode",
    action: "removeNode",
    comment: "due to parser merging raceCode and ethnicGroupCode original raceCode is converted to ethnicGroupCode (#173)"
}, {
    xpath: t.allergiesSection + '/.//h:effectiveTime[not(@value | h:low | h:high)]',
    action: "removeNode"
}, {
    xpath: t.allergiesSection + '/h:templateId[@root="2.16.840.1.113883.10.20.22.2.6"]',
    action: "removeNode",
    comment: "this templateId does not exist in the file"
}, {
    xpath: t.medSection + '/h:templateId[@root="2.16.840.1.113883.10.20.22.2.1"]',
    action: "removeNode",
    comment: "this templateId does not exist in the file"
}, {
    xpath: t.medDispense + '/h:performer',
    action: "addAttribute",
    params: {
        "typeCode": "PRF"
    },
    comment: "needs more research"
}, {
    xpath: t.medDispense + '/h:performer/h:assignedEntity',
    action: "addAttribute",
    params: {
        "classCode": "ASSIGNED"
    },
    comment: "needs more research"
}, {
    xpath: t.immSection + '/h:templateId[@root="2.16.840.1.113883.10.20.22.2.2"]',
    action: "removeNode",
    comment: "this templateId does not exist in the file"
}, {
    xpath: t.immActivity + '/h:performer',
    action: "addAttribute",
    params: {
        "typeCode": "PRF"
    },
    comment: "needs more research"
}, {
    xpath: t.immActivity + '/h:performer/h:assignedEntity',
    action: "addAttribute",
    params: {
        "classCode": "ASSIGNED"
    },
    comment: "needs more research"
}, {
    xpath: t.procSection + '/h:templateId[@root="2.16.840.1.113883.10.20.22.2.7"]',
    action: "removeNode",
    comment: "this templateId does not exist in the file"
}, {
    xpath: t.procActProc + '/h:participant/h:participantRole/h:templateId',
    action: "removeNode",
    comment: "error in file: this should be in participantRole"
}, {
    xpath: t.procActProc + '/h:performer',
    action: "addAttribute",
    params: {
        "typeCode": "PRF"
    },
    comment: "needs more research"
}, {
    xpath: t.procActProc + '/h:performer/h:assignedEntity',
    action: "addAttribute",
    params: {
        "classCode": "ASSIGNED"
    },
    comment: "needs more research"
}, {
    xpath: t.encSection + '/h:templateId[@root="2.16.840.1.113883.10.20.22.2.22.1"]',
    action: "removeNode",
    comment: "this templateId does not exist in the file"
}, {
    xpath: t.encAct + '/h:participant/h:participantRole/h:templateId',
    action: "removeNode",
    comment: "error in file: this should be in participantRole"
}, {
    xpath: t.encAct + '/h:performer',
    action: "addAttribute",
    params: {
        "typeCode": "PRF"
    },
    comment: "needs more research"
}, {
    xpath: t.encAct + '/h:performer/h:assignedEntity',
    action: "addAttribute",
    params: {
        "classCode": "ASSIGNED"
    },
    comment: "needs more research"
}, {
    xpath: t.payersSection + '/.//h:templateId[@root="2.16.840.1.113883.10.20.1.19"]',
    action: "removeNode",
    comment: "this templateId does not exist in the file"
}, {
    xpath: t.policyAct + '/h:performer/h:assignedEntity',
    action: "addAttribute",
    params: {
        "classCode": "ASSIGNED"
    },
    comment: "needs more research"
}, {
    xpath: t.policyAct + '/h:performer/h:assignedEntity/h:representedOrganization',
    action: "addAttribute",
    params: {
        "classCode": "ORG"
    },
    comment: "needs more research"
}, {
    xpath: t.pocSection + '/.//h:statusCode[@code="new"]',
    action: "removeNode",
    comment: "to be researched"
}, {
    xpath: t.probSection + '/h:templateId[@root="2.16.840.1.113883.10.20.22.2.5"]',
    action: "removeNode",
    comment: "this templateId does not exist in the file"
}, {
    xpath: t.probStatus + '/h:id',
    action: "removeNode",
    comment: "to be researched"
}, {
    xpath: t.vitalsSection + '/h:templateId[@root="2.16.840.1.113883.10.20.22.2.4"]',
    action: "removeNode",
    comment: "this templateId does not exist in the file"
}, {
    xpath: t.resultsSection + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.2.3"]',
    action: "removeNode",
    comment: "this templateId does not exist in the file"
}, {
    xpath: t.resultsSection + '/.//h:observationRange[not(*)][not(@*)][not(text())]',
    action: "removeNode"
}, {
    xpath: t.resultsObs + '/h:value[@xsi:type=\"PQ\"][not(@value)]',
    action: "removeNode"
}];
