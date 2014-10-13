module.exports = [{
    xpath: "//*[@nullFlavor]"
}, {
    xpath: "//h:text"
}, {
    xpath: "//h:effectiveTime[@xsi:type=\"IVL_TS\"]",
    action: "removeAttribute",
    params: "type"
}, {
    xpath: "//h:originalText"
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.2",
    description: "Immunization Section",
    type: "rootTemplate",
    childxpaths: [{
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
    xpath: "2.16.840.1.113883.10.20.22.2.18",
    description: "Payers Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: ".//h:time"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.4",
    description: "Vital Signs Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "..",
        action: "flatten",
        params: "2.16.840.1.113883.10.20.22.4.27"
    }, {
        xpath: "h:entry"
    }]
}];
