module.exports = [{
    xpath: "//*[@nullFlavor]"
}, {
    xpath: "//h:text"
}, {
    xpath: "//h:effectiveTime[@xsi:type=\"IVL_TS\"]",
    action: "removeAttribute",
    params: "type"
}, {
    xpath: "//h:reference"
}, {
    xpath: "//h:originalText"
}, {
    xpath: "//h:text",
    action: "removeWhitespace"
}, {
    xpath: ["2.16.840.1.113883.10.20.22.2.6", "2.16.840.1.113883.10.20.22.2.6.1"],
    description: "Allergies Section (entries optional)",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:text"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.1",
    description: "Medications Section (entries optional)",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:text"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.2",
    description: "Immunization Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:text"
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.52",
        description: "Immunization Activity",
        type: "localTemplate",
        childxpaths: [{
            xpath: "2.16.840.1.113883.10.20.22.4.20",
            description: "Instructions",
            type: "localTemplate",
            childxpaths: [{
                xpath: "..",
                action: "removeAttribute",
                params: "inversionInd"
            }]
        }]
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.7",
    description: "Procedures Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:text"
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.12",
        description: "Procedure Actitivity Act",
        type: "localTemplate",
        childxpaths: [{
            xpath: ".",
            action: "removeAttribute",
            params: "moodCode"
        }]
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.13",
        description: "Procedure Actitivity Observation",
        type: "localTemplate",
        childxpaths: [{
            xpath: ".",
            action: "removeAttribute",
            params: "moodCode"
        }]
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.14",
        description: "Procedure Actitivity Procedure",
        type: "localTemplate",
        childxpaths: [{
            xpath: ".",
            action: "removeAttribute",
            params: "moodCode"
        }]
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.22",
    description: "Encounters Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:text"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.18",
    description: "Payers Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:text"
    }, {
        xpath: ".//h:time"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.10",
    description: "Plan Of Care Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:text"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.5",
    description: "Problems",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:text"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.17",
    description: "Social History Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:text"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.4",
    description: "Vital Signs Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:text"
    }, {
        xpath: "..",
        action: "flatten",
        params: "2.16.840.1.113883.10.20.22.4.27"
    }, {
        xpath: "h:entry"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.3",
    description: "Results Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "h:text"
    }]
}];
