module.exports = [{
    "value": "//*[@nullFlavor]"
}, {
    "value": "//h:text"
}, {
    "value": "//h:effectiveTime[@xsi:type='IVL_TS']",
    "action": "A",
    "params": "type"
        //}, {
        //    "value": "//h:effectiveTime",
        //    "action": "remove_timezone"
}, {
    "value": " //h:telecom[@use='WP']",
    "action": "TEL"
}, {
    "value": "//h:streetAddressLine",
    "action": "W"
}, {
    "value": "//h:reference"
}, {
    "value": "//h:originalText"
}, {
    "value": "//h:text",
    "action": "W"
}, {
    "value": "//h:code[@codeSystemVersion]",
    "action": "A",
    "params": "codeSystemVersion"
}, {
    "value": "//*[@assigningAuthorityName]",
    "action": "A",
    "params": "assigningAuthorityName"
}, {
    "value": ["2.16.840.1.113883.10.20.22.2.6", "2.16.840.1.113883.10.20.22.2.6.1"],
    "xpathcmt": "Allergies Section (entries optional)",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:text"
    }]
}, {
    "value": "2.16.840.1.113883.10.20.22.2.1",
    "xpathcmt": "Medications Section (entries optional)",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:text"
    }, {
        "value": "2.16.840.1.113883.10.20.22.4.16",
        "xpathcmt": "Medication Activity",
        "type": "T",
        "subPathSpecs": [{
            "value": "2.16.840.1.113883.10.20.22.4.17",
            "xpathcmt": "Medication Supply Order",
            "type": "T",
            "subPathSpecs": [{
                "value": "h:performer"
            }, {
                "value": "h:product"
            }]
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.18",
            "xpathcmt": "Medication Dispense",
            "type": "T",
            "subPathSpecs": [{
                "value": "h:product",
                "comment": "not read by parser"
            }, {
                "value": "h:quantity",
                "comment": "not read by parser"
            }, {
                "value": "h:repeatNumber",
                "comment": "not read by parser"
            }, {
                "value": "h:effectiveTime",
                "comment": "not read by parser"
            }, {
                "value": "h:performer",
                "subPathSpecs": [{
                    "value": "h:assignedEntity/h:assignedPerson",
                    "comment": "not read by parser"
                }]
            }]
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.20",
            "xpathcmt": "Instructions",
            "type": "T",
            "subPathSpecs": [{
                "value": "..",
                "comment": "not read by parser"
            }]
        }]
    }]
}, {
    "value": "2.16.840.1.113883.10.20.22.2.2",
    "xpathcmt": "Immunization Section",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:text"
    }, {
        "value": "2.16.840.1.113883.10.20.22.4.52",
        "xpathcmt": "Immunization Activity",
        "type": "T",
        "subPathSpecs": [{
            "value": "2.16.840.1.113883.10.20.22.4.53",
            "xpathcmt": "Immunization Refusal Reason",
            "type": "T",
            "subPathSpecs": [{
                "value": "h:id",
                "comment": "not read by parser"
            }]
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.20",
            "xpathcmt": "Instructions",
            "type": "T",
            "subPathSpecs": [{
                "value": "..",
                "action": "A",
                "params": "inversionInd",
                "comment": "erroneous in sample file"
            }]
        }]
    }]
}, {
    "value": "2.16.840.1.113883.10.20.22.2.7",
    "xpathcmt": "Procedures Section",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:text"
    }, {
        "value": "2.16.840.1.113883.10.20.22.4.12",
        "xpathcmt": "Procedure Actitivity Act",
        "type": "T",
        "subPathSpecs": [{
            "value": ".",
            "action": "A",
            "params": "moodCode"
        }]
    }, {
        "value": "2.16.840.1.113883.10.20.22.4.13",
        "xpathcmt": "Procedure Actitivity Observation",
        "type": "T",
        "subPathSpecs": [{
            "value": ".",
            "action": "A",
            "params": "moodCode"
        }]
    }, {
        "value": "2.16.840.1.113883.10.20.22.4.14",
        "xpathcmt": "Procedure Actitivity Procedure",
        "type": "T",
        "subPathSpecs": [{
            "value": ".",
            "action": "A",
            "params": "moodCode"
        }, {
            "value": "2.16.840.1.113883.10.20.22.4.37",
            "xpathcmt": "Product Instance",
            "type": "T",
            "subPathSpecs": [{
                "value": ".."
            }]
        }]
    }]
}, {
    "value": "2.16.840.1.113883.10.20.22.2.22",
    "xpathcmt": "Encounters Section",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:text"
    }]
}, {
    "value": "2.16.840.1.113883.10.20.22.2.18",
    "xpathcmt": "Payers Section",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:text"
    }, {
        "value": ".//h:time",
        "comment": "null flavored induced text value"
    }]
}, {
    "value": "2.16.840.1.113883.10.20.22.2.10",
    "xpathcmt": "Plan Of Care Section",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:text"
    }]
}, {
    "value": "2.16.840.1.113883.10.20.22.2.5",
    "xpathcmt": "Problems",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:text"
    }, {
        "value": "2.16.840.1.113883.10.20.22.4.3",
        "xpathcmt": "Problem Concern Act",
        "type": "T",
        "subPathSpecs": [{
            "value": "2.16.840.1.113883.10.20.22.4.4",
            "xpathcmt": "Problem Observation",
            "type": "T",
            "subPathSpecs": [{
                "value": "h:code"
            }]
        }]
    }]
}, {
    "value": "2.16.840.1.113883.10.20.22.2.17",
    "xpathcmt": "Social History Section",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:text"
    }]
}, {
    "value": ["2.16.840.1.113883.10.20.22.2.4", "2.16.840.1.113883.10.20.22.2.4.1"],
    "xpathcmt": "Vital Signs Section",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:text"
    }, {
        "value": "..",
        "action": "ADD",
        "params": "2.16.840.1.113883.10.20.22.4.27"
    }, {
        "value": "h:entry"
    }]
}, {
    "value": ["2.16.840.1.113883.10.20.22.2.3", "2.16.840.1.113883.10.20.22.2.3.1"],
    "xpathcmt": "Results Section",
    "type": "TR",
    "subPathSpecs": [{
        "value": "h:text"
    }]
}, {
    "value": "//h:recordTarget/h:patientRole",
    "xpathcmt": "Demographics Section",
    "subPathSpecs": [{
        "value": "h:patient/h:ethnicGroupCode"
    }, {
        "value": "h:providerOrganization"
    }]
}];