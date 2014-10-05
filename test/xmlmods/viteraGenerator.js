module.exports = [{
    xpath: "//h:recordTarget/h:patientRole/h:patient/h:ethnicGroupCode",
    comment: "due to parser merging raceCode and ethnicGroupCode original raceCode is converted to ethnicGroupCode (#173)"
}, {
    xpath: "//h:text",
    comment: "text fields are not supported currently"
}, {
    xpath: "//h:recordTarget/h:patientRole/h:patient/h:name[@use]",
    action: "removeAttribute",
    params: "use",
    comment: "parser does read @use and generator assumes it is always 'L'"
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.6.1",
    description: "Allergies Section (entries required)",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:title",
        comment: "title may differ"
    }, {
        xpath: ".//h:effectiveTime[not(@value | h:low | h:high)]"
    }, {
        xpath: "h:templateId[@root=\"2.16.840.1.113883.10.20.22.2.6\"]",
        comment: "this templateId does not exist in the file"
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.7",
        type: "localTemplate",
        childxpaths: [{
            xpath: "..",
            action: "removeAttribute",
            params: "inversionInd",
            comment: "parser ignores inversionInd attribute and generator always generates true"
        }]
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.1.1",
    description: "Medication Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:title",
        comment: "title may differ"
    }, {
        xpath: "h:templateId[@root=\"2.16.840.1.113883.10.20.22.2.1\"]",
        comment: "this templateId does not exist in the file"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.2.1",
    description: "Immunizations Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:title",
        comment: "title may differ"
    }, {
        xpath: "h:templateId[@root=\"2.16.840.1.113883.10.20.22.2.2\"]",
        comment: "this templateId does not exist in the file"
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.52",
        type: "localTemplate",
        description: "Immunization Activity",
        childxpaths: [{
            xpath: "2.16.840.1.113883.10.20.22.4.20",
            type: "localTemplate",
            action: "removeAttribute",
            params: "moodCode",
        }]
    }, {
        xpath: "2.16.840.1.113883.10.20.22.2.7.1",
        description: "Procedures Section",
        type: "rootTemplate",
        childxpaths: [{
            xpath: "h:title",
            comment: "title may differ"
        }, {
            xpath: "h:templateId[@root=\"2.16.840.1.113883.10.20.22.2.7\"]"
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.14",
            description: "Procedure Activity Procedure",
            type: "localTemplate",
            childxpaths: [{
                xpath: "h:participant/h:participantRole/h:templateId",
                comment: "error in file: this should be in participantRole"
            }]
        }]
    }, {
        xpath: "2.16.840.1.113883.10.20.22.2.22",
        description: "Encounters Section",
        type: "rootTemplate",
        childxpaths: [{
            xpath: "h:title",
            comment: "title may differ"
        }, {
            xpath: "h:templateId[@root=\"2.16.840.1.113883.10.20.22.2.22.1\"]"
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.49",
            description: "Encounters Activities",
            type: "localTemplate",
            childxpaths: [{
                xpath: "h:participant/h:participantRole/h:templateId",
                comment: "error in file: this should be in participantRole"
            }]
        }]
    }, {
        xpath: "2.16.840.1.113883.10.20.22.2.18",
        description: "Payers Section",
        type: "rootTemplate",
        childxpaths: [{
            xpath: "h:title",
            comment: "title may differ"
        }, {
            xpath: "h:code",
            action: "removeAttribute",
            params: "displayName"
        }, {
            xpath: ".//h:templateId[@root=\"2.16.840.1.113883.10.20.1.19\"]"
        }]
    }, {
        xpath: "2.16.840.1.113883.10.20.22.2.10",
        description: "Plan of Care Section",
        type: "rootTemplate",
        childxpaths: [{
            xpath: "h:title",
            comment: "title may differ"
        }, {
            xpath: ".//h:statusCode[@code=\"new\"]",
            comment: "to be researched"
        }]
    }, {
        xpath: "2.16.840.1.113883.10.20.22.2.5.1",
        description: "Problems Section",
        type: "rootTemplate",
        childxpaths: [{
            xpath: "h:templateId[@root=\"2.16.840.1.113883.10.20.22.2.5\"]",
        }, {
            xpath: "h:title",
            comment: "title may differ"
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.6",
            type: "localTemplate",
            childxpaths: [{
                xpath: "h:id",
                comment: "to be researched"
            }]
        }]
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.4.1",
    description: "Vital Signs Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:title"
    }, {
        xpath: "h:templateId[@root=\"2.16.840.1.113883.10.20.22.2.4\"]",
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.3.1",
    description: "Results Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:title"
    }, {
        xpath: "h:templateId[@root=\"2.16.840.1.113883.10.20.22.2.3\"]"
    }, {
        xpath: "//h:observationRange[not(*)][not(@*)][not(text())]"
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.2",
        type: "localTemplate",
        childxpaths: [{
            xpath: "h:value[@xsi:type=\"PQ\"][not(@value)]",
        }]
    }]
}];
