"use strict";

var t = require("./templatePath");

var titleMap = {
    "Allergies": "Allergies, adverse reactions, alerts",
    "Medications": "History of medication use",
    "Procedures and Surgical/Medical History": "History of Procedures",
    "Insurance": "Payers",
    "Problems": "Problem List",
    "SOCIAL HISTORY": "Social History",
    "Lab Results": "Relevant diagnostic tests and/or laboratory data"
};

module.exports = [{
    xpath: "//h:recordTarget/h:patientRole/h:patient/h:raceCode",
    action: "removeNode",
    comment: "due to parser merging raceCode and ethnicGroupCode this is generated as ethnicGroupCode (#173)",
}, {
    xpath: "//h:name[not(h:family)][not(text())]",
    action: "removeNode",
    comment: "bunch of empty names to be investigated"
}, {
    xpath: "//h:effectiveTime[not(*)][not(@*)]",
    action: "removeNode",
    comment: "all childless and attributeless times (maybe previously removed nullFlavor)"
}, {
    xpath: "//h:assignedPerson[not(*)]",
    action: "removeNode",
    comment: "all childless and attributeless assignedPerson (maybe previously removed nullFlavor)"
}, {
    xpath: t.allergiesSection + '/.//h:effectiveTime[not(@value | h:low | h:high)]',
    action: "removeNode",
}, {
    xpath: t.allergiesSection + '/h:id',
    action: "removeNode",
    comment: "error in file: id does not exist in spec"
}, {
    xpath: t.allergyObs + '/..',
    action: "addAttribute",
    params: {
        "inversionInd": "true"
    },
    comment: "parser expects a value",
}, {
    xpath: t.allergyObs + '/h:informant',
    action: "removeNode",
    comment: "error in file: informant does not exist in spec",
}, {
    xpath: t.allergyObs + '/h:participant/h:participantRole/h:playingEntity/h:name',
    action: "removeNode",
    comment: "needs to be researched"
}, {
    xpath: t.allergyReaction + '/h:code',
    action: "removeNode",
    comment: "can be anything according to spec and parser does not read it"
}, {
    xpath: t.allergyCommentAct,
    action: "removeNode",
    comment: "error in file: Ignoring Comment Activity"
}, {
    xpath: t.medSection + '/h:id',
    action: "removeNode",
    comment: "error in file: id does not exist in spec"
}, {
    xpath: t.medActivity + '/h:effectiveTime[@operator="A"]',
    action: "removeNode",
    comment: "error in file: unexpected interval"
}, {
    xpath: t.medActivity + '/h:informant',
    action: "removeNode",
    comment: "error in file: no informant node in spec"
}, {
    xpath: t.medActivity + '/h:entryRelationship/h:observation[not(h:templateId)]/..',
    action: "removeNode",
    comment: "error in file: template without templateId"
}, {
    xpath: t.medStatus,
    action: "removeNode",
    comment: "error in file: C32 template not valid in CCDA"
}, {
    xpath: t.medProbAct,
    action: "removeNode",
    comment: "error in file: there is no Problem Act in meidcations"
}, {
    xpath: t.medDispenseInfo,
    action: "removeNode",
    comment: "parser does not read"
}, {
    xpath: t.medSupplyInfo,
    action: "removeNode",
    comment: "parser does not read"
}, {
    xpath: t.medActivityInfo + '/h:manufacturedMaterial/h:name',
    action: "removeNode",
    comment: "parser does not read"
}, {
    xpath: t.medSupplyOrder + '/h:id',
    action: "removeNode",
    comment: "parser does not read"
}, {
    xpath: t.medSupplyOrder + '/h:effectiveTime',
    action: "removeNode",
    comment: "no value"
}, {
    xpath: t.medSupplyOrder + '/h:author/h:assignedAuthor/h:addr',
    action: "removeNode",
    comment: "parser does not read"
}, {
    xpath: t.medSupplyOrder + '/h:quantity[@unit]',
    action: "removeAttribute",
    params: "unit",
    comment: "parser does not read"
}, {
    xpath: t.immSection + '/h:id',
    action: "removeNode",
    comment: "error in file: id does not exist in spec"
}, {
    xpath: t.immActivity + '/h:code',
    action: "removeNode",
    comment: "parser does not read"
}, {
    xpath: t.immActivity + '/h:consumable/h:manufacturedProduct/h:manufacturedMaterial/h:name',
    action: "removeNode",
    comment: "to be researched"
}, {
    xpath: t.immActivity + '/h:consumable/h:manufacturedProduct/h:manufacturerOrganization/h:standardIndustryClassCode',
    action: "removeNode",
    comment: "to be researched"
}, {
    xpath: t.immActivity + '/h:informant',
    action: "removeNode",
    comment: "to be researched"
}, {
    xpath: t.immActUnknown1,
    action: "removeNode",
    comment: "unknown CCDA templateId"
}, {
    xpath: t.immActUnknown2,
    action: "removeNode",
    comment: "unknown CCDA templateId"
}, {
    xpath: t.immActComment + '/h:act',
    action: "addAttribute",
    params: {
        "moodCode": "INT"
    },
    comment: "just change  ...22.4.64 is not good anyway"
}, {
    xpath: t.immActComment + '/h:act/h:templateId',
    action: "addAttribute",
    params: {
        "root": "2.16.840.1.113883.10.20.22.4.20"
    },
    comment: "2.16.840.1.113883.10.20.22.4.64 (comment) or 2.16.840.1.113883.10.20.22.4.20"
}, {
    xpath: t.procSection + '/h:id',
    action: "removeNode",
    comment: "error in file: id does not exist in spec"
}, {
    xpath: t.procActProc + '/h:informant',
    action: "removeNode",
    comment: "to be researched"
}, {
    xpath: t.procActProc + '/h:participant/h:templateId',
    action: "removeNode",
    comment: "error in file: this should be in participantRole"
}, {
    xpath: t.procActProc + '/h:participant/h:participantRole/h:id',
    action: "removeNode",
    comment: "to be researched"
}, {
    xpath: t.procActProcUnknown,
    action: "removeNode",
    comment: "to be researched"
}, {
    xpath: t.encSection + '/h:id',
    action: "removeNode",
    comment: "error in file: id does not exist in spec"
}, {
    xpath: t.encAct + '/h:informant',
    action: "removeNode",
    comment: "to be researched"
}, {
    xpath: t.encAct + '/h:participant/h:templateId',
    action: "removeNode",
    comment: "error in file: this should be in participantRole"
}, {
    xpath: t.encAct + '/h:participant/h:participantRole/h:id',
    action: "removeNode",
    comment: "to be researched"
}, {
    xpath: t.payersSection + '/h:id',
    action: "removeNode",
    comment: "error in file: id does not exist in spec"
}, {
    xpath: t.payersSection + '/h:code',
    action: "addAttribute",
    params: {
        "displayName": "Payers"
    }
}, {
    xpath: t.coverageAct + '/h:informant',
    action: "removeNode",
    comment: "to be researched"
}, {
    xpath: t.coverageAct + '/h:entryRelationship/h:sequenceNumber',
    action: "removeNode",
    comment: "to be researched"
}, {
    xpath: t.policyAct + '/h:entryRelationship/h:act[@moodCode="DEF"]',
    action: "addAttribute",
    params: {
        "moodCode": "EVN"
    },
    comment: "to be researched"
}, {
    xpath: t.policyAct + '/h:participant/h:participantRole/h:playingEntity/*[@value="19381212"]',
    action: "removeNode",
    comment: "to be researched"
}, {
    xpath: t.policyAct + '/h:performer/h:assignedEntity/h:representedOrganization[not(*)]',
    action: "removeNode",
    comment: "to be researched"
}, {
    xpath: t.pocSection + '/h:id',
    action: "removeNode",
    comment: "error in file: id does not exist in spec"
}, {
    xpath: t.pocActProc,
    action: "addAttribute",
    params: {
        "moodCode": "RQO"
    },
    comment: "parser does not support"
}, {
    xpath: t.pocActProcUnknown,
    action: "removeNode",
    comment: "not clear in specification, parser does not read"
}, {
    xpath: t.pocActProc + '/h:performer',
    action: "removeNode",
    comment: "not clear in specification, parser does not read"
}, {
    xpath: t.probSection + '/h:id',
    action: "removeNode",
    comment: "error in file: id does not exist in spec"
}, {
    xpath: t.probAct + '/h:statusCode',
    action: "addAttribute",
    params: {
        "code": "completed"
    },
    comment: "parser deficiency: not read"
}, {
    xpath: t.probAct + '/h:performer',
    action: "removeNode",
    comment: "invalid"
}, {
    xpath: t.probObservation + '/h:informant',
    action: "removeNode",
    comment: "invalid"
}, {
    xpath: t.probObservation + '/h:code',
    action: "removeNode",
}, {
    xpath: t.probObservation + '/..',
    action: "removeAttribute",
    params: "inversionInd",
}, {
    xpath: t.probStatus + '/..',
    action: "removeAttribute",
    params: "inversionInd",
}, {
    xpath: t.probStatus + '/h:value',
    action: "addAttribute",
    params: {
        "xsi:type": "CD"
    }
}, {
    xpath: t.probActComment,
    action: "removeNode",
    comment: "Comment Activity is not implemented by Parser"
}, {
    xpath: t.resultsSection + '/h:id',
    action: "removeNode",
    comment: "error in file: id does not exist in spec"
}, {
    xpath: t.resultsSection + '/h:entry',
    action: "addAttribute",
    params: {
        "typeCode": "DRIV"
    }
}, {
    xpath: t.resultOrg + '/h:participant',
    action: "removeNode"
}, {
    xpath: t.resultOrg + '/h:component/h:procedure',
    action: "removeNode"
}, {
    xpath: t.resultOrg + '/h:specimen',
    action: "removeNode"
}, {
    xpath: t.resultOrg + '/h:effectiveTime',
    action: "removeNode"
}, {
    xpath: t.resultObs + '/h:performer',
    action: "removeNode"
}, {
    xpath: t.resultObs + '/h:value[@xsi:type="ST"]',
    action: "removeNode"
}, {
    xpath: t.resultObs + '/h:value[@value]',
    action: "removeZeros"
}, {
    xpath: t.resultsCommentAct,
    action: "removeNode",
    comment: "error in file: Ignoring Comment Activity"
}, {
    xpath: t.vitalsSection + '/h:id',
    action: "removeNode",
    comment: "error in file: id does not exist in spec"
}, {
    xpath: t.vitalsObs + '/h:informant',
    action: "removeNode"
}, {
    xpath: t.vitalsObs + '/h:methodCode',
    action: "removeNode"
}, {
    xpath: t.resultsSection + "/.//*[not(*)][not(@*)][not(text())]",
    action: "removeNode"
}, {
    xpath: "//h:title",
    action: "replaceText",
    params: titleMap,
    comment: "titles may differ"
}, {
    xpath: "//h:recordTarget/h:patientRole/h:patient/h:name",
    action: "addAttribute",
    params: {
        "use": "L"
    },
    comment: "parser does read @use and generator assumes it is always 'L'"
}];
