"use strict";

var fieldLevel = require('../fieldLevel');
var leafLevel = require('../leafLevel');
var common = require("../common");
var condition = require("../condition");
var contentModifier = require("../contentModifier");

var sharedEntryLevel = require("./sharedEntryLevel");

var key = contentModifier.key;
var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

var medicationInformation = {
    key: "manufacturedProduct",
    attributes: {
        classCode: "MANU"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.23"),
        fieldLevel.id, {
            key: "manufacturedMaterial",
            content: [{
                key: "code",
                attributes: [
                    leafLevel.code
                ],
                content: [{
                    key: "originalText",
                    text: leafLevel.data("unencoded_name"),
                    content: [{
                        key: "reference",
                        attributes: [
                            leafLevel.code
                        ]
                    }]
                }, {
                    key: "translation",
                    attributes: [
                        leafLevel.code
                    ],
                    dataKey: "translations"
                }]
            }],
            dataKey: "product"
        }, {
            key: "manufacturerOrganization",
            content: {
                key: "name",
                text: leafLevel.input,
            },
            dataKey: "manufacturer"
        }
    ],
    dataTransform: function (input) {
        if (input.product) {
            input.product.unencoded_name = input.unencoded_name;
        }
        return input;
    }
};

var medicationSupplyOrder = {
    key: "supply",
    attributes: {
        classCode: "SPLY",
        moodCode: "INT"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.17"),
        fieldLevel.id,
        fieldLevel.statusCodeCompleted,
        fieldLevel.effectiveTime, {
            key: "repeatNumber",
            attributes: {
                value: leafLevel.input
            },
            dataKey: "repeatNumber"
        }, {
            key: "quantity",
            attributes: {
                value: leafLevel.input
            },
            dataKey: "quantity"
        }, {
            key: "product",
            content: medicationInformation,
            dataKey: "product"
        },
        common.author, {
            key: "entryRelationship",
            attributes: {
                typeCode: "SUBJ",
                inversionInd: "true"
            },
            content: sharedEntryLevel.instructions,
            dataKey: "instructions"
        }
    ]
};

var medicationDispense = {
    key: "supply",
    attributes: {
        classCode: "SPLY",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.18"),
        fieldLevel.id,
        fieldLevel.statusCodeCompleted,
        fieldLevel.effectiveTime, {
            key: "repeatNumber",
            dataKey: "@notImplemented"
        }, {
            key: "quantity",
            dataKey: "@notImplemented"
        }, {
            key: "product",
            content: medicationInformation,
            dataKey: "product"
        }, {
            key: "performer",
            content: common.assignedEntity,
            dataKey: "performer"
        }
    ]
};

exports.medicationActivity = {
    key: "substanceAdministration",
    attributes: {
        classCode: "SBADM",
        moodCode: function (input) {
            var status = input.status;
            if (status) {
                if (status === 'Prescribed') {
                    return 'INT';
                }
                if (status === 'Completed') {
                    return 'EVN';
                }
            }
            return null;
        }
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.16"),
        fieldLevel.id, {
            key: "text",
            text: leafLevel.input,
            dataKey: "sig"
        },
        fieldLevel.statusCodeCompleted,
        fieldLevel.effectiveTime, {
            key: "effectiveTime",
            attributes: {
                "xsi:type": "PIVL_TS",
                "institutionSpecified": "true",
                "operator": "A"
            },
            content: {
                key: "period",
                attributes: {
                    value: leafLevel.data("value"),
                    unit: leafLevel.data("unit")
                },
            },
            dataKey: "administration.interval.period",
        }, {
            key: "routeCode",
            attributes: leafLevel.code,
            dataKey: "administration.route"
        }, {
            key: "doseQuantity",
            attributes: {
                value: leafLevel.data("value"),
                unit: leafLevel.data("unit")
            },
            dataKey: "administration.dose"
        }, {
            key: "rateQuantity",
            attributes: {
                value: leafLevel.data("value"),
                unit: leafLevel.data("unit")
            },
            dataKey: "administration.rate"
        }, {
            key: "administrationUnitCode",
            attributes: leafLevel.code,
            dataKey: "administration.form"
        }, {
            key: "consumable",
            content: medicationInformation,
            dataKey: "product"
        }, {
            key: "performer",
            content: common.assignedEntity,
            dataKey: "performer"
        }, {
            key: "participant",
            attributes: {
                typeCode: "CSM"
            },
            content: sharedEntryLevel.drugVehicle,
            dataKey: "drug_vehicle"
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "RSON"
            },
            content: sharedEntryLevel.indication,
            dataKey: "indication"
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "REFR"
            },
            content: medicationSupplyOrder,
            dataKey: "supply"
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "REFR"
            },
            content: medicationDispense,
            dataKey: "dispense"
        }, {
            key: "precondition",
            attributes: {
                typeCode: "PRCN"
            },
            content: [
                fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.25"), //this appears to be an error
                sharedEntryLevel.preconditionForSubstanceAdministration
            ],
            dataKey: "precondition"
        }
    ]
};
