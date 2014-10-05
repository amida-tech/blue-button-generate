module.exports = [{
    xpath: "//h:recordTarget/h:patientRole/h:patient/h:raceCode",
    comment: "due to parser merging raceCode and ethnicGroupCode this is generated as ethnicGroupCode (#173)",
}, {
    xpath: "//h:text",
    comment: "text fields are not supported currently"
}, {
    xpath: "//h:name[not(h:family)][not(text())]",
    comment: "bunch of empty names to be investigated"
}, {
    xpath: "//h:effectiveTime[not(*)][not(@*)]",
    comment: "all childless and attributeless times (maybe previously removed nullFlavor)"
}, {
    xpath: "//h:assignedPerson[not(*)]",
    comment: "all childless and attributeless assignedPerson (maybe previously removed nullFlavor)"
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.6.1",
    description: "Allergies Section (entries required)",
    type: "rootTemplate",
    childxpaths: [{
        xpath: ".//h:effectiveTime[not(@value | h:low | h:high)]"
    }, {
        xpath: "h:id",
        comment: "error in file: id does not exist in spec"
    }, {
        xpath: "h:title",
        comment: "title may differ"
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.7",
        type: "localTemplate",
        childxpaths: [{
            xpath: "h:informant",
            comment: "error in file: informant does not exist in spec"
        }, {
            xpath: "h:participant/h:participantRole/h:playingEntity/h:name",
            comment: "needs to be researched"
        }, {
            xpath: '..',
            action: "removeAttribute",
            params: "inversionInd",
            comment: "parser ignores inversionInd attribute"
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.9",
            type: "localTemplate",
            childxpaths: [{
                xpath: "h:code",
                comment: "can be anything according to spec and parser does not read it"
            }]
        }]
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.64",
        type: "localTemplateParent",
        comment: "error in file: Ignoring Comment Activity"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.1.1",
    description: "Medications Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:id",
        comment: "error in file: id does not exist in spec"
    }, {
        xpath: "h:title",
        comment: "title may differ"
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.16",
        description: "Medication Activity",
        type: "localTemplate",
        childxpaths: [{
            xpath: "h:effectiveTime[@operator='A']",
            comment: "error in file: unexpected interval"
        }, {
            xpath: "h:entryRelationship/h:observation[not(h:templateId)]/..",
            comment: "error in file: template without templateId"
        }, {
            xpath: "h:informant",
            comment: "error in file: no informant node in spec"
        }, {
            xpath: "h:title",
            comment: "title may differ"
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.20",
            description: "Medication Information",
            type: "localTemplateParent",
            comment: "not supported by parser"
        }, {
            xpath: "2.16.840.1.113883.10.20.1.47",
            description: "Medication Status",
            type: "localTemplateParent",
            comment: "error in file: C32 template not valid in CCDA"
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.3",
            description: 'Problem Concern Act',
            type: "localTemplateParent",
            comment: "error in file: there is no Problem Act in meidcations"
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.18",
            description: "Medication Dispense",
            type: "localTemplate",
            childxpaths: [{
                xpath: "h:performer[@typeCode='PRF']",
                action: "removeAttribute",
                params: "typeCode",
                comment: "needs more research"
            }, {
                xpath: "h:performer/h:assignedEntity[@classCode='ASSIGNED']",
                action: "removeAttribute",
                params: "classCode",
                comment: "needs more research"
            }, {
                xpath: "2.16.840.1.113883.10.20.22.4.23",
                description: "Medication Information",
                type: "localTemplateParent",
                comment: "parser does not read"
            }]
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.17",
            description: "Medication Supply Order",
            type: "localTemplate",
            childxpaths: [{
                xpath: "h:id",
                comment: "parser does not read"
            }, {
                xpath: "h:author/h:assignedAuthor/h:addr",
                "comment:": "parser does not read"
            }, {
                xpath: "h:quantity[@unit]",
                action: "removeAttribute",
                params: "unit",
                comment: "parser does not read"
            }, {
                xpath: "2.16.840.1.113883.10.20.22.4.23",
                description: "Medication Information",
                type: "localTemplateParent",
                comment: "parser does not read"
            }]
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.23",
            description: "Medication Information",
            type: "localTemplate",
            childxpaths: [{
                xpath: "h:manufacturedMaterial/h:name",
                comment: "parser does not read"
            }]
        }]
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.2.1",
    description: "Immunizations Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:id",
        comment: "error in file: id does not exist in spec"
    }, {
        xpath: "h:title",
        comment: "title may differ"
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.52",
        type: "localTemplate",
        description: "Immunization Activity",
        childxpaths: [{
            xpath: "h:code",
            comment: "parser does not read"
        }, {
            xpath: "h:consumable/h:manufacturedProduct/h:manufacturedMaterial/h:name",
            comment: "to be researched"
        }, {
            xpath: "h:consumable/h:manufacturedProduct/h:manufacturerOrganization/h:standardIndustryClassCode",
            comment: "to be researched"
        }, {
            xpath: "2.16.840.1.113883.10.20.1.46",
            type: "localTemplateParent",
            comment: "unknown CCDA templateId"
        }, {
            xpath: "2.16.840.1.113883.10.20.1.47",
            type: "localTemplateParent",
            comment: "unknown CCDA templateId"
        }, {
            xpath: "h:informant",
            comment: "to be researched"
        }, {
            xpath: "h:performer[@typeCode='PRF']",
            action: "removeAttribute",
            params: "typeCode",
            comment: "to be researched"
        }, {
            xpath: "h:performer/h:assignedEntity[@classCode='ASSIGNED']",
            action: "removeAttribute",
            params: "classCode",
            comment: "to be researched"
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.64",
            type: "localTemplateParent",
            childxpaths: [{
                xpath: ".",
                action: "removeAttribute",
                params: "inversionInd",
                comment: "just change  ...22.4.64 is not good anyway"
            }, {
                xpath: "h:act",
                action: "removeAttribute",
                params: "moodCode",
                comment: "just change  ...22.4.64 is not good anyway"
            }, {
                xpath: "h:act/h:templateId",
                action: "addAttribute",
                params: ["root", "2.16.840.1.113883.10.20.22.4.20"],
                comment: "2.16.840.1.113883.10.20.22.4.64 (comment) or 2.16.840.1.113883.10.20.22.4.20"
            }]
        }]
    }, {
        xpath: "2.16.840.1.113883.10.20.22.2.7.1",
        description: "Procedures Section",
        type: "rootTemplate",
        childxpaths: [{
            xpath: "h:id",
            comment: "error in file: id does not exist in spec"
        }, {
            xpath: "h:title",
            comment: "title may differ"
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.14",
            description: "Procedure Activity Procedure",
            type: "localTemplate",
            childxpaths: [{
                xpath: ".",
                action: "removeAttribute",
                params: "moodCode"
            }, {
                xpath: "2.16.840.1.113883.10.20.22.4.4",
                type: "localTemplateParent",
                comment: "to be researched"
            }, {
                xpath: "h:informant",
                comment: "to be researched"
            }, {
                xpath: "h:participant/h:templateId",
                comment: "error in file: this should be in participantRole"
            }, {
                xpath: "h:participant/h:participantRole/h:id",
                comment: "to be researched"
            }, {
                xpath: "h:performer[@typeCode='PRF']",
                action: "removeAttribute",
                params: "typeCode",
                comment: "to be researched"
            }, {
                xpath: "h:performer/h:assignedEntity[@classCode='ASSIGNED']",
                action: "removeAttribute",
                params: "classCode",
                comment: "to be researched"
            }]
        }]
    }, {
        xpath: "2.16.840.1.113883.10.20.22.2.22",
        description: "Encounters Section",
        type: "rootTemplate",
        childxpaths: [{
            xpath: "h:id",
            comment: "error in file: id does not exist in spec"
        }, {
            xpath: "h:title",
            comment: "title may differ"
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.49",
            description: "Encounters Activities",
            type: "localTemplate",
            childxpaths: [{
                xpath: "h:informant",
                comment: "to be researched"
            }, {
                xpath: "h:participant/h:templateId",
                comment: "error in file: this should be in participantRole"
            }, {
                xpath: "h:participant/h:participantRole/h:id",
                comment: "to be researched"
            }, {
                xpath: "h:performer[@typeCode='PRF']",
                action: "removeAttribute",
                params: "typeCode",
                comment: "to be researched"
            }, {
                xpath: "h:performer/h:assignedEntity[@classCode='ASSIGNED']",
                action: "removeAttribute",
                params: "classCode",
                comment: "to be researched"
            }]
        }]
    }, {
        xpath: "2.16.840.1.113883.10.20.22.2.18",
        description: "Payers Section",
        type: "rootTemplate",
        childxpaths: [{
            xpath: "h:id",
            comment: "error in file: id does not exist in spec"
        }, {
            xpath: "h:title",
            comment: "title may differ"
        }, {
            xpath: "h:code",
            action: "removeAttribute",
            params: "displayName"
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.60",
            description: "Coverage Activity",
            type: "localTemplate",
            childxpaths: [{
                xpath: "h:informant",
                comment: "to be researched"
            }, {
                xpath: "h:entryRelationship/h:sequenceNumber",
                comment: "to be researched"
            }, {
                xpath: "2.16.840.1.113883.10.20.22.4.61",
                description: "Policy Activity",
                type: "localTemplate",
                childxpaths: [{
                    xpath: "h:entryRelationship/h:act[@moodCode=\"DEF\"]",
                    action: "addAttribute",
                    params: ["moodCode", "EVN"],
                    comment: "to be researched"
                }, {
                    xpath: "h:participant/h:participantRole/h:playingEntity/*[@value=\"19381212\"]",
                    comment: "to be researched"
                }, {
                    xpath: "h:performer/h:assignedEntity[@classCode='ASSIGNED']",
                    action: "removeAttribute",
                    params: "classCode",
                    comment: "to be researched"
                }, {
                    xpath: "h:performer/h:assignedEntity/h:representedOrganization[not(*)]"
                }, {
                    xpath: "h:performer/h:assignedEntity/h:representedOrganization[@classCode=\"ORG\"]",
                    action: "removeAttribute",
                    params: "classCode"
                }]
            }]
        }]
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.10",
    description: "Plan of Care Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:id",
        comment: "error in file: id does not exist in spec"
    }, {
        xpath: "h:title",
        comment: "title may differ"
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.41",
        description: "Plan of Care Activity Procedure",
        type: "localTemplate",
        childxpaths: [{
            xpath: ".",
            action: "addAttribute",
            params: ["moodCode", "RQO"],
            comment: "parser does not support"
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.4",
            type: "localTemplateParent",
            comment: "not clear in specification, parser does not read"
        }, {
            xpath: "h:performer",
            comment: "not clear in specification, parser does not read"
        }]
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.5.1",
    description: "Problems Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:id",
        comment: "error in file: id does not exist in spec"
    }, {
        xpath: "h:title",
        comment: "title may differ"
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.3",
        description: "Problem Act",
        type: "localTemplate",
        childxpaths: [{
            xpath: "h:statusCode",
            action: "addAttribute",
            params: ["code", "completed"],
            comment: "parser deficiency: not read"
        }, {
            xpath: "h:performer",
            comment: "invalid"
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.4",
            description: "Problem Observation",
            type: "localTemplate",
            childxpaths: [{
                xpath: "..",
                action: "removeAttribute",
                params: "inversionInd"
            }, {
                xpath: "h:informant",
                comment: "invalid"
            }, {
                xpath: "h:code"
            }, {
                xpath: "2.16.840.1.113883.10.20.22.4.6",
                type: "localTemplateParent",
                childxpaths: [{
                    xpath: ".",
                    action: "removeAttribute",
                    params: "inversionInd"
                }, {
                    xpath: "h:observation/h:value",
                    action: "addAttribute",
                    params: ["xsi:type", "CD"]
                }]
            }]
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.64",
            description: "Comment Activity",
            type: "localTemplateParent",
            comment: "Comment Activity is not implemented by Parser"
        }]
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.4.1",
    description: "Vital Signs Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:title"
    }, {
        xpath: "h:id"
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.27",
        type: "localTemplate",
        childxpaths: [{
            xpath: "h:informant"
        }, {
            xpath: "h:methodCode"
        }]
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.3.1",
    description: "Results Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:entry",
        action: "addAttribute",
        params: ["typeCode", "DRIV"]
    }, {
        xpath: "h:title"
    }, {
        xpath: "h:id"
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.1",
        type: "localTemplate",
        childxpaths: [{
            xpath: "h:participant"
        }, {
            xpath: "h:component/h:procedure"
        }, {
            xpath: "h:specimen"
        }, {
            xpath: "h:effectiveTime"
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.2",
            type: "localTemplate",
            childxpaths: [{
                xpath: "h:performer"
            }, {
                xpath: "h:value[@xsi:type=\"ST\"]",
            }, {
                xpath: "h:value[@value]",
                action: "removeZeros"
            }]
        }]
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.64",
        type: "localTemplateParent",
        comment: "error in file: Ignoring Comment Activity"
    }]
}, {
    xpath: "//*[not(*)][not(@*)][not(text())]",
}];
