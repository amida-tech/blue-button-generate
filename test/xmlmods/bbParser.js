module.exports = [{
    xpath: "//*[@nullFlavor]"
}, {
    xpath: "//h:text"
}, {
    xpath: "//h:effectiveTime[@xsi:type='IVL_TS']",
    action: "removeAttribute",
    params: "type"
}, {
    xpath: " //h:telecom[@use='WP']",
    action: "normalizeTelNumber"
}, {
    xpath: "//h:reference"
}, {
    xpath: "//h:originalText"
}, {
    xpath: "//h:code[@codeSystemVersion]",
    action: "removeAttribute",
    params: "codeSystemVersion"
}, {
    xpath: "//*[@assigningAuthorityName]",
    action: "removeAttribute",
    params: "assigningAuthorityName"
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.1",
    description: "Medications Section (entries optional)",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "2.16.840.1.113883.10.20.22.4.16",
        description: "Medication Activity",
        type: "localTemplate",
        childxpaths: [{
            xpath: "2.16.840.1.113883.10.20.22.4.17",
            description: "Medication Supply Order",
            type: "localTemplate",
            childxpaths: [{
                xpath: "h:performer"
            }, {
                xpath: "h:product"
            }]
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.18",
            description: "Medication Dispense",
            type: "localTemplate",
            childxpaths: [{
                xpath: "h:product",
                comment: "not read by parser"
            }, {
                xpath: "h:quantity",
                comment: "not read by parser"
            }, {
                xpath: "h:repeatNumber",
                comment: "not read by parser"
            }, {
                xpath: "h:effectiveTime",
                comment: "not read by parser"
            }, {
                xpath: "h:performer",
                childxpaths: [{
                    xpath: "h:assignedEntity/h:assignedPerson",
                    comment: "not read by parser"
                }]
            }]
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.20",
            description: "Instructions",
            type: "localTemplate",
            childxpaths: [{
                xpath: "..",
                comment: "not read by parser"
            }]
        }]
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.2",
    description: "Immunization Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "2.16.840.1.113883.10.20.22.4.52",
        description: "Immunization Activity",
        type: "localTemplate",
        childxpaths: [{
            xpath: "2.16.840.1.113883.10.20.22.4.53",
            description: "Immunization Refusal Reason",
            type: "localTemplate",
            childxpaths: [{
                xpath: "h:id",
                comment: "not read by parser"
            }]
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.20",
            description: "Instructions",
            type: "localTemplate",
            childxpaths: [{
                xpath: "..",
                action: "removeAttribute",
                params: "inversionInd",
                comment: "erroneous in sample file"
            }]
        }]
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.7",
    description: "Procedures Section",
    type: "rootTemplate",
    childxpaths: [{
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
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.37",
            description: "Product Instance",
            type: "localTemplate",
            childxpaths: [{
                xpath: ".."
            }]
        }]
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.18",
    description: "Payers Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: ".//h:time",
        comment: "null flavored induced text value"
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.5",
    description: "Problems",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "2.16.840.1.113883.10.20.22.4.3",
        description: "Problem Concern Act",
        type: "localTemplate",
        childxpaths: [{
            xpath: "2.16.840.1.113883.10.20.22.4.4",
            description: "Problem Observation",
            type: "localTemplate",
            childxpaths: [{
                xpath: "h:code"
            }]
        }]
    }]
}, {
    xpath: ["2.16.840.1.113883.10.20.22.2.4", "2.16.840.1.113883.10.20.22.2.4.1"],
    description: "Vital Signs Section",
    type: "rootTemplate",
    childxpaths: [{
        xpath: "..",
        action: "flatten",
        params: "2.16.840.1.113883.10.20.22.4.27"
    }, {
        xpath: "h:entry"
    }]
}, {
    xpath: "//h:recordTarget/h:patientRole",
    description: "Demographics Section",
    childxpaths: [{
        xpath: "h:patient/h:ethnicGroupCode"
    }, {
        xpath: "h:providerOrganization"
    }]
}];
