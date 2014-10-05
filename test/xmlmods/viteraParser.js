module.exports = [{
    "value": "//h:recordTarget/h:patientRole/h:patient/h:raceCode",
    "comment": "due to parser merging raceCode and ethnicGroupCode this is generated as ethnicGroupCode (#173)",
}, {
    "value": "//h:text",
    "comment": "text fields are not supported currently"
}, {
    "value": "//h:name[not(h:family)][not(text())]",
    "comment": "bunch of empty names to be investigated"
}, {
    "value": "//h:effectiveTime[not(*)][not(@*)]",
    "comment": "all childless and attributeless times (maybe previously removed nullFlavor)"
}, {
    "value": "//h:assignedPerson[not(*)]",
    "comment": "all childless and attributeless assignedPerson (maybe previously removed nullFlavor)"
}, {
    "value": "2.16.840.1.113883.10.20.22.2.6.1",
    "xpathcmt": "Allergies Section (entries required)",
    "type": "TR",
    "subPathSpecs": [{
        "value": ".//h:effectiveTime[not(@value | h:low | h:high)]"
    }, {
        "value": "h:id",
        "comment": "error in file: id does not exist in spec"
    }, {
        "value": "h:title",
        "comment": "title may differ"
    }, {
        "value": "2.16.840.1.113883.10.20.22.4.7",
        "type": "T",
        "subPathSpecs": [{
            "value": "h:informant",
            "comment": "error in file: informant does not exist in spec"
        }, {
            "value": "h:participant/h:participantRole/h:playingEntity/h:name",
            "comment": "needs to be researched"
        }, {
            "value": '..',
            "action": "A",
            "params": "inversionInd",
            "comment": "parser ignores inversionInd attribute"
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.9",
            "type": "T",
            "subPathSpecs": [{
                "value": "h:code",
                "comment": "can be anything according to spec and parser does not read it"
            }]
        }]
    }, {
        "value": "2.16.840.1.113883.10.20.22.4.64",
        "type": "TP",
        "comment": "error in file: Ignoring Comment Activity"
    }]
}, {
    "value": "2.16.840.1.113883.10.20.22.2.1.1",
    "xpathcmt": "Medications Section",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:id",
        "comment": "error in file: id does not exist in spec"
    }, {
        "value": "h:title",
        "comment": "title may differ"
    }, {
        "value": "2.16.840.1.113883.10.20.22.4.16",
        "xpathcmt": "Medication Activity",
        "type": "T",
        "subPathSpecs": [{
            "value": "h:effectiveTime[@operator='A']",
            "comment": "error in file: unexpected interval"
        }, {
            "value": "h:entryRelationship/h:observation[not(h:templateId)]/..",
            "comment": "error in file: template without templateId"
        }, {
            "value": "h:informant",
            "comment": "error in file: no informant node in spec"
        }, {
            "value": "h:title",
            "comment": "title may differ"
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.20",
            "xpathcmt": "Medication Information",
            "type": "TP",
            "comment": "not supported by parser"
        }, {
            "value": "2.16.840.1.113883.10.20.1.47",
            "xpathcmt": "Medication Status",
            "type": "TP",
            "comment": "error in file: C32 template not valid in CCDA"
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.3",
            "xpathcmt": 'Problem Concern Act',
            "type": "TP",
            "comment": "error in file: there is no Problem Act in meidcations"
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.18",
            "xpathcmt": "Medication Dispense",
            "type": "T",
            "subPathSpecs": [{
                "value": "h:performer[@typeCode='PRF']",
                "action": "A",
                "params": "typeCode",
                "comment": "needs more research"
            }, {
                "value": "h:performer/h:assignedEntity[@classCode='ASSIGNED']",
                "action": "A",
                "params": "classCode",
                "comment": "needs more research"
            }, {
                "value": "2.16.840.1.113883.10.20.22.4.23",
                "xpathcmt": "Medication Information",
                "type": "TP",
                "comment": "parser does not read"
            }]
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.17",
            "xpathcmt": "Medication Supply Order",
            "type": "T",
            "subPathSpecs": [{
                "value": "h:id",
                "comment": "parser does not read"
            }, {
                "value": "h:author/h:assignedAuthor/h:addr",
                "comment:": "parser does not read"
            }, {
                "value": "h:quantity[@unit]",
                "action": "A",
                "params": "unit",
                "comment": "parser does not read"
            }, {
                "value": "2.16.840.1.113883.10.20.22.4.23",
                "xpathcmt": "Medication Information",
                "type": "TP",
                "comment": "parser does not read"
            }]
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.23",
            "xpathcmt": "Medication Information",
            "type": "T",
            "subPathSpecs": [{
                "value": "h:manufacturedMaterial/h:name",
                "comment": "parser does not read"
            }]
        }]
    }]
}, {
    "value": "2.16.840.1.113883.10.20.22.2.2.1",
    "xpathcmt": "Immunizations Section",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:id",
        "comment": "error in file: id does not exist in spec"
    }, {
        "value": "h:title",
        "comment": "title may differ"
    }, {
        "value": "2.16.840.1.113883.10.20.22.4.52",
        "type": "T",
        "xpathcmt": "Immunization Activity",
        "subPathSpecs": [{
            "value": "h:code",
            "comment": "parser does not read"
        }, {
            "value": "h:consumable/h:manufacturedProduct/h:manufacturedMaterial/h:name",
            "comment": "to be researched"
        }, {
            "value": "h:consumable/h:manufacturedProduct/h:manufacturerOrganization/h:standardIndustryClassCode",
            "comment": "to be researched"
        }, {
            "value": "2.16.840.1.113883.10.20.1.46",
            "type": "TP",
            "comment": "unknown CCDA templateId"
        }, {
            "value": "2.16.840.1.113883.10.20.1.47",
            "type": "TP",
            "comment": "unknown CCDA templateId"
        }, {
            "value": "h:informant",
            "comment": "to be researched"
        }, {
            "value": "h:performer[@typeCode='PRF']",
            "action": "A",
            "params": "typeCode",
            "comment": "to be researched"
        }, {
            "value": "h:performer/h:assignedEntity[@classCode='ASSIGNED']",
            "action": "A",
            "params": "classCode",
            "comment": "to be researched"
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.64",
            "type": "TP",
            "subPathSpecs": [{
                "value": ".",
                "action": "A",
                "params": "inversionInd",
                "comment": "just change  ...22.4.64 is not good anyway"
            }, {
                "value": "h:act",
                "action": "A",
                "params": "moodCode",
                "comment": "just change  ...22.4.64 is not good anyway"
            }, {
                "value": "h:act/h:templateId",
                "action": "AM",
                "params": ["root", "2.16.840.1.113883.10.20.22.4.20"],
                "comment": "2.16.840.1.113883.10.20.22.4.64 (comment) or 2.16.840.1.113883.10.20.22.4.20"
            }]
        }]
    }, {
        "value": "2.16.840.1.113883.10.20.22.2.7.1",
        "xpathcmt": "Procedures Section",
        "type": "TR",
        "subPathSpecs": [{
            "value": "h:id",
            "comment": "error in file: id does not exist in spec"
        }, {
            "value": "h:title",
            "comment": "title may differ"
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.14",
            "xpathcmt": "Procedure Activity Procedure",
            "type": "T",
            "subPathSpecs": [{
                "value": ".",
                "action": "A",
                "params": "moodCode"
            }, {
                "value": "2.16.840.1.113883.10.20.22.4.4",
                "type": "TP",
                "comment": "to be researched"
            }, {
                "value": "h:informant",
                "comment": "to be researched"
            }, {
                "value": "h:participant/h:templateId",
                "comment": "error in file: this should be in participantRole"
            }, {
                "value": "h:participant/h:participantRole/h:id",
                "comment": "to be researched"
            }, {
                "value": "h:performer[@typeCode='PRF']",
                "action": "A",
                "params": "typeCode",
                "comment": "to be researched"
            }, {
                "value": "h:performer/h:assignedEntity[@classCode='ASSIGNED']",
                "action": "A",
                "params": "classCode",
                "comment": "to be researched"
            }]
        }]
    }, {
        "value": "2.16.840.1.113883.10.20.22.2.22",
        "xpathcmt": "Encounters Section",
        "type": "TR",
        "subPathSpecs": [{
            "value": "h:id",
            "comment": "error in file: id does not exist in spec"
        }, {
            "value": "h:title",
            "comment": "title may differ"
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.49",
            "xpathcmt": "Encounters Activities",
            "type": "T",
            "subPathSpecs": [{
                "value": "h:informant",
                "comment": "to be researched"
            }, {
                "value": "h:participant/h:templateId",
                "comment": "error in file: this should be in participantRole"
            }, {
                "value": "h:participant/h:participantRole/h:id",
                "comment": "to be researched"
            }, {
                "value": "h:performer[@typeCode='PRF']",
                "action": "A",
                "params": "typeCode",
                "comment": "to be researched"
            }, {
                "value": "h:performer/h:assignedEntity[@classCode='ASSIGNED']",
                "action": "A",
                "params": "classCode",
                "comment": "to be researched"
            }]
        }]
    }, {
        "value": "2.16.840.1.113883.10.20.22.2.18",
        "xpathcmt": "Payers Section",
        "type": "TR",
        "subPathSpecs": [{
            "value": "h:id",
            "comment": "error in file: id does not exist in spec"
        }, {
            "value": "h:title",
            "comment": "title may differ"
        }, {
            "value": "h:code",
            "action": "A",
            "params": "displayName"
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.60",
            "xpathcmt": "Coverage Activity",
            "type": "T",
            "subPathSpecs": [{
                "value": "h:informant",
                "comment": "to be researched"
            }, {
                "value": "h:entryRelationship/h:sequenceNumber",
                "comment": "to be researched"
            }, {
                "value": "2.16.840.1.113883.10.20.22.4.61",
                "xpathcmt": "Policy Activity",
                "type": "T",
                "subPathSpecs": [{
                    "value": "h:entryRelationship/h:act[@moodCode=\"DEF\"]",
                    "action": "AM",
                    "params": ["moodCode", "EVN"],
                    "comment": "to be researched"
                }, {
                    "value": "h:participant/h:participantRole/h:playingEntity/*[@value=\"19381212\"]",
                    "comment": "to be researched"
                }, {
                    "value": "h:performer/h:assignedEntity[@classCode='ASSIGNED']",
                    "action": "A",
                    "params": "classCode",
                    "comment": "to be researched"
                }, {
                    "value": "h:performer/h:assignedEntity/h:representedOrganization[not(*)]"
                }, {
                    "value": "h:performer/h:assignedEntity/h:representedOrganization[@classCode=\"ORG\"]",
                    "action": "A",
                    "params": "classCode"
                }]
            }]
        }]
    }]
}, {
    "value": "2.16.840.1.113883.10.20.22.2.10",
    "xpathcmt": "Plan of Care Section",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:id",
        "comment": "error in file: id does not exist in spec"
    }, {
        "value": "h:title",
        "comment": "title may differ"
    }, {
        "value": "2.16.840.1.113883.10.20.22.4.41",
        "xpathcmt": "Plan of Care Activity Procedure",
        "type": "T",
        "subPathSpecs": [{
            "value": ".",
            "action": "AM",
            "params": ["moodCode", "RQO"],
            "comment": "parser does not support"
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.4",
            "type": "TP",
            "comment": "not clear in specification, parser does not read"
        }, {
            "value": "h:performer",
            "comment": "not clear in specification, parser does not read"
        }]
    }]
}, {
    "value": "2.16.840.1.113883.10.20.22.2.5.1",
    "xpathcmt": "Problems Section",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:id",
        "comment": "error in file: id does not exist in spec"
    }, {
        "value": "h:title",
        "comment": "title may differ"
    }, {
        "value": "2.16.840.1.113883.10.20.22.4.3",
        "xpathcmt": "Problem Act",
        "type": "T",
        "subPathSpecs": [{
            "value": "h:statusCode",
            "action": "AM",
            "params": ["code", "completed"],
            "comment": "parser deficiency: not read"
        }, {
            "value": "h:performer",
            "comment": "invalid"
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.4",
            "xpathcmt": "Problem Observation",
            "type": "T",
            "subPathSpecs": [{
                "value": "..",
                "action": "A",
                "params": "inversionInd"
            }, {
                "value": "h:informant",
                "comment": "invalid"
            }, {
                "value": "h:code"
            }, {
                "value": "2.16.840.1.113883.10.20.22.4.6",
                "type": "TP",
                "subPathSpecs": [{
                    "value": ".",
                    "action": "A",
                    "params": "inversionInd"
                }, {
                    "value": "h:observation/h:value",
                    "action": "AM",
                    "params": ["xsi:type", "CD"]
                }]
            }]
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.64",
            "xpathcmt": "Comment Activity",
            "type": "TP",
            "comment": "Comment Activity is not implemented by Parser"
        }]
    }]
}, {
    "value": "2.16.840.1.113883.10.20.22.2.4.1",
    "xpathcmt": "Vital Signs Section",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:title"
    }, {
        "value": "h:id"
    }, {
        "value": "2.16.840.1.113883.10.20.22.4.27",
        "type": "T",
        "subPathSpecs": [{
            "value": "h:informant"
        }, {
            "value": "h:methodCode"
        }]
    }]
}, {
    "value": "2.16.840.1.113883.10.20.22.2.3.1",
    "xpathcmt": "Results Section",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:entry",
        "action": "AM",
        "params": ["typeCode", "DRIV"]
    }, {
        "value": "h:title"
    }, {
        "value": "h:id"
    }, {
        "value": "2.16.840.1.113883.10.20.22.4.1",
        "type": "T",
        "subPathSpecs": [{
            "value": "h:participant"
        }, {
            "value": "h:component/h:procedure"
        }, {
            "value": "h:specimen"
        }, {
            "value": "h:effectiveTime"
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.2",
            "type": "T",
            "subPathSpecs": [{
                "value": "h:performer"
            }, {
                "value": "h:value[@xsi:type=\"ST\"]",
            }, {
                "value": "h:value[@value]",
                "action": "remove_zeros"
            }]
        }]
    }, {
        "value": "2.16.840.1.113883.10.20.22.4.64",
        "type": "TP",
        "comment": "error in file: Ignoring Comment Activity"
    }]
}, {
    "value": "//*[not(*)][not(@*)][not(text())]",
}];
