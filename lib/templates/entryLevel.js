"use strict";

var fieldLevel = require('./fieldLevel');
var attrLevel = require('./attrLevel');
var common = require("./common");
var condition = require('./condition');

var allergyStatusObservation = {
    key: "observation",
    attributes: {
        "classCode": "OBS",
        "moodCode": "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.28"),
        common.templateCode("AllergyStatusObservation"),
        common.completed, {
            key: "value",
            attributes: [{
                    "xsi:type": "CE"
                },
                attrLevel.code
            ],
            existsWhen: condition.eitherKeyExists('code', 'name')
        }

    ],
    dataKey: "status"
};

var severityObservation = {
    key: "observation",
    attributes: {
        "classCode": "OBS",
        "moodCode": "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.8"),
        common.templateCode("SeverityObservation"),
        common.completed, {
            key: "value",
            attributes: [{
                    "xsi:type": "CD"
                },
                attrLevel.code
            ],
            dataKey: "code",
            existsWhen: condition.eitherKeyExists('code', 'name')
        }, {
            key: "interpretationCode",
            attributes: attrLevel.code,
            dataKey: "interpretation",
            existsWhen: condition.eitherKeyExists('code', 'name')
        }
    ],
    dataKey: "severity",
    existsWhen: condition.keyExists('code')
};

var reactionObservation = exports.reactionObservation = {
    key: "observation",
    attributes: {
        "classCode": "OBS",
        "moodCode": "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.9"),
        fieldLevel.id,
        common.nullFlavor("code"),
        common.completed,
        fieldLevel.effectiveTime(), {
            key: "value",
            attributes: [{
                    "xsi:type": "CD"
                },
                attrLevel.code
            ],
            dataKey: 'reaction',
            existsWhen: condition.eitherKeyExists('code', 'name'),
            required: true
        }, {
            key: "entryRelationship",
            attributes: {
                "typeCode": "SUBJ",
                "inversionInd": "true"
            },
            content: [
                severityObservation
            ],
            existsWhen: condition.keyExists('severity')
        }
    ]
};

var allergyIntoleranceObservation = exports.allergyIntoleranceObservation = {
    key: "observation",
    attributes: {
        "classCode": "OBS",
        "moodCode": "EVN",
        "negationInd": attrLevel.booleanData("negation_indicator") // TODO: Double check.  It does not exist on the template
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.7"),
        fieldLevel.id,
        common.templateCode("AllergyObservation"),
        common.completed,
        fieldLevel.effectiveTime(), {
            key: "value",
            attributes: [{
                    "xsi:type": "CD"
                },
                attrLevel.code
            ],
            dataKey: 'intolerance',
            existsWhen: condition.eitherKeyExists('code', 'name'),
        }, {
            key: "participant",
            attributes: {
                "typeCode": "CSM"
            },
            content: [{
                key: "participantRole",
                attributes: {
                    "classCode": "MANU"
                },
                content: [{
                    key: "playingEntity",
                    attributes: {
                        classCode: "MMAT"
                    },
                    content: [{
                        key: "code",
                        attributes: [
                            attrLevel.code
                        ],
                        content: [{
                            key: "originalText",
                            content: [{
                                key: "reference",
                                attributes: [
                                    attrLevel.code
                                ]
                            }]
                        }, {
                            key: "translation",
                            attributes: [
                                attrLevel.code
                            ],
                            dataKey: "translations"
                        }]
                    }]
                }]
            }],
            dataKey: 'allergen'
        }, {
            key: "entryRelationship",
            attributes: {
                "typeCode": "SUBJ",
                "inversionInd": "true"
            },
            content: [
                allergyStatusObservation
            ],
            existsWhen: condition.keyExists("status")
        }, {
            key: "entryRelationship",
            attributes: {
                "typeCode": "MFST",
                "inversionInd": "true"
            },
            content: reactionObservation,
            dataKey: 'reactions',
            existsWhen: condition.keyExists('reaction')
        }, {
            key: "entryRelationship",
            attributes: {
                "typeCode": "SUBJ",
                "inversionInd": "true"
            },
            content: severityObservation,
            existsWhen: condition.keyExists('severity')
        }
    ],
    dataKey: "observation",
};

var allergyProblemAct = exports.allergyProblemAct = {
    key: "act",
    attributes: {
        classCode: "ACT",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.30"),
        fieldLevel.id,
        common.templateCode("AllergyProblemAct"),
        common.active, // this is not constant in spec
        fieldLevel.effectiveTime(), {
            key: "entryRelationship",
            attributes: {
                typeCode: "SUBJ",
                inversionInd: "true" // is not in spec, need to be checked
            },
            content: allergyIntoleranceObservation,
            existsWhen: condition.keyExists('observation')
        }
    ]
};

var instructions = exports.instructions = {
    key: "act",
    attributes: {
        classCode: "ACT",
        moodCode: "INT"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.20"), {
            key: "code",
            attributes: [
                attrLevel.code
            ],
            dataKey: "code"
        }, {
            key: "text",
            text: attrLevel.data("free_text")
        },
        common.completed
    ]
};

var medicationInformation = exports.medicationInformation = {
    key: "manufacturedProduct",
    attributes: {
        classCode: "MANU"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.23"),
        fieldLevel.id, {
            key: "manufacturedMaterial",
            content: [{
                key: "code",
                attributes: [
                    attrLevel.code
                ],
                content: [{
                    key: "originalText",
                    text: attrLevel.data("unencoded_name"),
                    content: [{
                        key: "reference",
                        attributes: [
                            attrLevel.code
                        ]
                    }]
                }, {
                    key: "translation",
                    attributes: [
                        attrLevel.code
                    ],
                    dataKey: "translations"
                }]
            }],
            dataKey: "product"
        }, {
            key: "manufacturerOrganization",
            content: {
                key: "name",
                text: attrLevel.input,
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

var medicationSupplyOrder = exports.medicationSupplyOrder = {
    key: "supply",
    attributes: {
        classCode: "SPLY",
        moodCode: "INT"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.17"),
        fieldLevel.id,
        common.completed,
        fieldLevel.effectiveTime(), {
            key: "repeatNumber",
            attributes: {
                value: attrLevel.input
            },
            dataKey: "repeatNumber"
        }, {
            key: "quantity",
            attributes: {
                value: attrLevel.input
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
            content: instructions,
            dataKey: instructions
        }
    ]
};

var medicationDispense = exports.medicationDispense = {
    key: "supply",
    attributes: {
        classCode: "SPLY",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.18"),
        fieldLevel.id,
        common.completed,
        fieldLevel.effectiveTime(), {
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
            existsWhen: condition.keyExists("performer")
        }
    ]
};

var indication = exports.indication = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.19"),
        fieldLevel.id, {
            key: "code",
            attributes: [
                attrLevel.code
            ],
            dataKey: "code"
        },
        common.completed,
        fieldLevel.effectiveTime(), {
            key: "value",
            attributes: [{
                    "xsi:type": "CD"
                },
                attrLevel.code
            ],
            dataKey: "value",
            existsWhen: condition.eitherKeyExists('code', 'name')
        }
    ]
};

var drugVehicle = exports.drugVehicle = {
    key: "participantRole",
    attributes: {
        classCode: "MANU"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.24"), {
            key: "code",
            attributes: {
                code: "412307009",
                displayName: "drug vehicle",
                codeSystem: "2.16.840.1.113883.6.96"
            }
        }, {
            key: "playingEntity",
            attributes: {
                classCode: "MMAT"
            },
            content: [{
                key: "code",
                attributes: attrLevel.code
            }, {
                key: "name",
                text: attrLevel.data("name")
            }]
        }
    ]
};

var preconditionForSubstanceAdministration = exports.preconditionForSubstanceAdministration = {
    key: "criterion",
    content: [{
        key: "code",
        attributes: {
            code: attrLevel.data("code"),
            codeSystem: "2.16.840.1.113883.5.4"
        },
        dataKey: "code"
    }, {
        key: "value",
        attributes: [{
                "xsi:type": "CE"
            },
            attrLevel.code
        ],
        dataKey: "value",
        existsWhen: condition.eitherKeyExists('code', 'name')
    }]
};

var medicationActivity = exports.medicationActivity = [{
    key: "consumable",
    content: medicationInformation,
    dataKey: "product"
}, {
    key: "performer",
    content: common.assignedEntity,
    existsWhen: condition.keyExists("performer")
}, {
    key: "participant",
    attributes: {
        typeCode: "CSM"
    },
    content: drugVehicle,
    dataKey: "drug_vehicle"
}, {
    key: "entryRelationship",
    attributes: {
        typeCode: "RSON"
    },
    content: indication,
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
        common.templateId("2.16.840.1.113883.10.20.22.4.25"), //this appears to be an error
        preconditionForSubstanceAdministration
    ],
    dataKey: "precondition"
}];
