module.exports = [{
    xpath: "//*[@nullFlavor]"
}, {
    xpath: "//h:text"
}, {
    xpath: "//h:effectiveTime[@xsi:type=\"IVL_TS\"]",
    action: "A",
    params: "type"
}, {
    xpath: "//h:reference"
}, {
    xpath: "//h:originalText"
}, {
    xpath: "//h:text",
    action: "W"
}, {
    xpath: ["2.16.840.1.113883.10.20.22.2.6", "2.16.840.1.113883.10.20.22.2.6.1"],
    description: "Allergies Section (entries optional)",
    type: "TR",
    childxpaths: [{
        xpath: "h:text"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.1",
    description: "Medications Section (entries optional)",
    type: "TR",
    childxpaths: [{
        xpath: "h:text"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.2",
    description: "Immunization Section",
    type: "TR",
    childxpaths: [{
        xpath: "h:text"
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.52",
        description: "Immunization Activity",
        type: "T",
        childxpaths: [{
            xpath: "2.16.840.1.113883.10.20.22.4.20",
            description: "Instructions",
            type: "T",
            childxpaths: [{
                xpath: "..",
                action: "A",
                params: "inversionInd"
            }]
        }]
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.7",
    description: "Procedures Section",
    type: "TR",
    childxpaths: [{
        xpath: "h:text"
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.12",
        description: "Procedure Actitivity Act",
        type: "T",
        childxpaths: [{
            xpath: ".",
            action: "A",
            params: "moodCode"
        }]
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.13",
        description: "Procedure Actitivity Observation",
        type: "T",
        childxpaths: [{
            xpath: ".",
            action: "A",
            params: "moodCode"
        }]
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.14",
        description: "Procedure Actitivity Procedure",
        type: "T",
        childxpaths: [{
            xpath: ".",
            action: "A",
            params: "moodCode"
        }]
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.22",
    description: "Encounters Section",
    type: "TR",
    childxpaths: [{
        xpath: "h:text"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.18",
    description: "Payers Section",
    type: "TR",
    childxpaths: [{
        xpath: "h:text"
    }, {
        xpath: ".//h:time"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.10",
    description: "Plan Of Care Section",
    type: "TR",
    childxpaths: [{
        xpath: "h:text"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.5",
    description: "Problems",
    type: "TR",
    childxpaths: [{
        xpath: "h:text"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.17",
    description: "Social History Section",
    type: "TR",
    childxpaths: [{
        xpath: "h:text"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.4",
    description: "Vital Signs Section",
    type: "TR",
    childxpaths: [{
        xpath: "h:text"
    }, {
        xpath: "..",
        action: "ADD",
        params: "2.16.840.1.113883.10.20.22.4.27"
    }, {
        xpath: "h:entry"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.3",
    description: "Results Section",
    type: "TR",
    childxpaths: [{
        xpath: "h:text"
    }]
}];
