module.exports = [{
    xpath: "2.16.840.1.113883.10.20.22.2.2",
    description: "Immunization Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: ".//h:effectiveTime[@xsi:type=\"IVL_TS\"]",
        action: "removeAttribute",
        params: "type"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.1",
    description: "Medications Section (entries optional)",
    type: "rootTemplate",
    childxpaths: [{
        xpath: ".//h:effectiveTime[@xsi:type=\"IVL_TS\"]",
        action: "removeAttribute",
        params: "type"
    }]
}];
