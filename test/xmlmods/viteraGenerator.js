module.exports = [{
    "value": "//h:recordTarget/h:patientRole/h:patient/h:ethnicGroupCode",
    "comment": "due to parser merging raceCode and ethnicGroupCode original raceCode is converted to ethnicGroupCode (#173)"
}, {
    "value": "//h:text",
    "comment": "text fields are not supported currently"
}, {
    "value": "//h:recordTarget/h:patientRole/h:patient/h:name[@use]",
    "action": "A",
    "params": "use",
    "comment": "parser does read @use and generator assumes it is always 'L'"
}, {
    "value": "2.16.840.1.113883.10.20.22.2.6.1",
    "xpathcmt": "Allergies Section (entries required)",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:title",
        "comment": "title may differ"
    }, {
        "value": ".//h:effectiveTime[not(@value | h:low | h:high)]"
    }, {
        "value": "h:templateId[@root=\"2.16.840.1.113883.10.20.22.2.6\"]",
        "comment": "this templateId does not exist in the file"
    }, {
        "value": "2.16.840.1.113883.10.20.22.4.7",
        "type": "T",
        "subPathSpecs": [{
            "value": "..",
            "action": "A",
            "params": "inversionInd",
            "comment": "parser ignores inversionInd attribute and generator always generates true"
        }]
    }]
}, {
    "value": "2.16.840.1.113883.10.20.22.2.1.1",
    "xpathcmt": "Medication Section",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:title",
        "comment": "title may differ"
    }, {
        "value": "h:templateId[@root=\"2.16.840.1.113883.10.20.22.2.1\"]",
        "comment": "this templateId does not exist in the file"
    }]
}, {
    "value": "2.16.840.1.113883.10.20.22.2.2.1",
    "xpathcmt": "Immunizations Section",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:title",
        "comment": "title may differ"
    }, {
        "value": "h:templateId[@root=\"2.16.840.1.113883.10.20.22.2.2\"]",
        "comment": "this templateId does not exist in the file"
    }, {
        "value": "2.16.840.1.113883.10.20.22.4.52",
        "type": "T",
        "xpathcmt": "Immunization Activity",
        "subPathSpecs": [{
            "value": "2.16.840.1.113883.10.20.22.4.20",
            "type": "T",
            "action": "A",
            "params": "moodCode",
        }]
    }, {
        "value": "2.16.840.1.113883.10.20.22.2.7.1",
        "xpathcmt": "Procedures Section",
        "type": "TR",
        "subPathSpecs": [{
            "value": "h:title",
            "comment": "title may differ"
        }, {
            "value": "h:templateId[@root=\"2.16.840.1.113883.10.20.22.2.7\"]"
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.14",
            "xpathcmt": "Procedure Activity Procedure",
            "type": "T",
            "subPathSpecs": [{
                "value": "h:participant/h:participantRole/h:templateId",
                "comment": "error in file: this should be in participantRole"
            }]
        }]
    }, {
        "value": "2.16.840.1.113883.10.20.22.2.22",
        "xpathcmt": "Encounters Section",
        "type": "TR",
        "subPathSpecs": [{
            "value": "h:title",
            "comment": "title may differ"
        }, {
            "value": "h:templateId[@root=\"2.16.840.1.113883.10.20.22.2.22.1\"]"
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.49",
            "xpathcmt": "Encounters Activities",
            "type": "T",
            "subPathSpecs": [{
                "value": "h:participant/h:participantRole/h:templateId",
                "comment": "error in file: this should be in participantRole"
            }]
        }]
    }, {
        "value": "2.16.840.1.113883.10.20.22.2.18",
        "xpathcmt": "Payers Section",
        "type": "TR",
        "subPathSpecs": [{
            "value": "h:title",
            "comment": "title may differ"
        }, {
            "value": "h:code",
            "action": "A",
            "params": "displayName"
        }, {
            "value": ".//h:templateId[@root=\"2.16.840.1.113883.10.20.1.19\"]"
        }]
    }, {
        "value": "2.16.840.1.113883.10.20.22.2.10",
        "xpathcmt": "Plan of Care Section",
        "type": "TR",
        "subPathSpecs": [{
            "value": "h:title",
            "comment": "title may differ"
        }, {
            "value": ".//h:statusCode[@code=\"new\"]",
            "comment": "to be researched"
        }]
    }, {
        "value": "2.16.840.1.113883.10.20.22.2.5.1",
        "xpathcmt": "Problems Section",
        "type": "TR",
        "subPathSpecs": [{
            "value": "h:templateId[@root=\"2.16.840.1.113883.10.20.22.2.5\"]",
        }, {
            "value": "h:title",
            "comment": "title may differ"
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.6",
            "type": "T",
            "subPathSpecs": [{
                "value": "h:id",
                "comment": "to be researched"
            }]
        }]
    }]
}, {
    "value": "2.16.840.1.113883.10.20.22.2.4.1",
    "xpathcmt": "Vital Signs Section",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:title"
    }, {
        "value": "h:templateId[@root=\"2.16.840.1.113883.10.20.22.2.4\"]",
    }]
}];
