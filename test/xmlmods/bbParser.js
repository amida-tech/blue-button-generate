module.exports = [{
    xpath: "//*[@nullFlavor]"
}, {
    xpath: "//h:text"
}, {
    xpath: "//h:effectiveTime[@xsi:type='IVL_TS']",
    action: "A",
    params: "type"
        //}, {
        //    xpath: "//h:effectiveTime",
        //    action: "remove_timezone"
}, {
    xpath: " //h:telecom[@use='WP']",
    action: "TEL"
}, {
    xpath: "//h:streetAddressLine",
    action: "W"
}, {
    xpath: "//h:reference"
}, {
    xpath: "//h:originalText"
}, {
    xpath: "//h:text",
    action: "W"
}, {
    xpath: "//h:code[@codeSystemVersion]",
    action: "A",
    params: "codeSystemVersion"
}, {
    xpath: "//*[@assigningAuthorityName]",
    action: "A",
    params: "assigningAuthorityName"
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
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.16",
        description: "Medication Activity",
        type: "T",
        childxpaths: [{
            xpath: "2.16.840.1.113883.10.20.22.4.17",
            description: "Medication Supply Order",
            type: "T",
            childxpaths: [{
                xpath: "h:performer"
            }, {
                xpath: "h:product"
            }]
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.18",
            description: "Medication Dispense",
            type: "T",
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
            type: "T",
            childxpaths: [{
                xpath: "..",
                comment: "not read by parser"
            }]
        }]
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
            xpath: "2.16.840.1.113883.10.20.22.4.53",
            description: "Immunization Refusal Reason",
            type: "T",
            childxpaths: [{
                xpath: "h:id",
                comment: "not read by parser"
            }]
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.20",
            description: "Instructions",
            type: "T",
            childxpaths: [{
                xpath: "..",
                action: "A",
                params: "inversionInd",
                comment: "erroneous in sample file"
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
        }, {
            xpath: "2.16.840.1.113883.10.20.22.4.37",
            description: "Product Instance",
            type: "T",
            childxpaths: [{
                xpath: ".."
            }]
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
        xpath: ".//h:time",
        comment: "null flavored induced text value"
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
    }, {
        xpath: "2.16.840.1.113883.10.20.22.4.3",
        description: "Problem Concern Act",
        type: "T",
        childxpaths: [{
            xpath: "2.16.840.1.113883.10.20.22.4.4",
            description: "Problem Observation",
            type: "T",
            childxpaths: [{
                xpath: "h:code"
            }]
        }]
    }]
}, {
    xpath: "2.16.840.1.113883.10.20.22.2.17",
    description: "Social History Section",
    type: "TR",
    childxpaths: [{
        xpath: "h:text"
    }]
}, {
    xpath: ["2.16.840.1.113883.10.20.22.2.4", "2.16.840.1.113883.10.20.22.2.4.1"],
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
    xpath: ["2.16.840.1.113883.10.20.22.2.3", "2.16.840.1.113883.10.20.22.2.3.1"],
    description: "Results Section",
    type: "TR",
    childxpaths: [{
        xpath: "h:text"
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
