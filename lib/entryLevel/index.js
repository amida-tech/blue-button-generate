"use strict";

var fieldLevel = require('../fieldLevel');
var leafLevel = require('../leafLevel');
var common = require("../common");
var condition = require('../condition');
var contentModifier = require("../contentModifier");

var key = contentModifier.key;
var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

var allergyEntryLevel = require("./allergyEntryLevel");

exports.allergyProblemAct = allergyEntryLevel.allergyProblemAct;

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
                leafLevel.code
            ],
            dataKey: "code"
        }, {
            key: "text",
            text: leafLevel.data("free_text")
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
            content: instructions,
            dataKey: "instructions"
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
                leafLevel.code
            ],
            dataKey: "code"
        },
        common.completed,
        fieldLevel.effectiveTime, {
            key: "value",
            attributes: [{
                    "xsi:type": "CD"
                },
                leafLevel.code
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
                attributes: leafLevel.code
            }, {
                key: "name",
                text: leafLevel.data("name")
            }]
        }
    ]
};

var preconditionForSubstanceAdministration = exports.preconditionForSubstanceAdministration = {
    key: "criterion",
    content: [{
        key: "code",
        attributes: {
            code: leafLevel.data("code"),
            codeSystem: "2.16.840.1.113883.5.4"
        },
        dataKey: "code"
    }, {
        key: "value",
        attributes: [{
                "xsi:type": "CE"
            },
            leafLevel.code
        ],
        dataKey: "value",
        existsWhen: condition.eitherKeyExists('code', 'name')
    }]
};

var medicationActivity = exports.medicationActivity = {
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
        common.templateId("2.16.840.1.113883.10.20.22.4.16"),
        fieldLevel.id, {
            key: "text",
            text: leafLevel.input,
            dataKey: "sig"
        },
        common.completed,
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
        }
    ]
};

var immunizationMedicationInformation = exports.immunizationMedicationInformation = {
    key: "manufacturedProduct",
    attributes: {
        classCode: "MANU"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.54"),
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
            }, {
                key: "lotNumberText",
                text: leafLevel.input,
                dataKey: "lot_number"
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
            input.product.lot_number = input.lot_number;
        }
        return input;
    }
};

var immunizationRefusalReason = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.53"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.codeName("2.16.840.1.113883.5.8")
        },
        common.completed
    ]
};

exports.immunizationActivity = {
    key: "substanceAdministration",
    attributes: [{
        classCode: "SBADM"
    }, leafLevel.immunizationActivityAttributes],
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.52"),
        fieldLevel.id,
        common.completed,
        fieldLevel.effectiveTime, {
            key: "repeatNumber",
            attributes: {
                value: leafLevel.data("sequence_number")
            },
            existsWhen: function (input) {
                return input.sequence_number || (input.sequence_number === "");
            }
        }, {
            key: "routeCode",
            attributes: leafLevel.code,
            dataKey: "administration.route"
        }, {
            key: "approachSiteCode",
            attributes: leafLevel.code,
            dataKey: "administration.body_site"
        }, {
            key: "doseQuantity",
            attributes: {
                value: leafLevel.data("value"),
                unit: leafLevel.data("unit")
            },
            dataKey: "administration.dose"
        }, {
            key: "consumable",
            content: immunizationMedicationInformation,
            dataKey: "product"
        }, {
            key: "performer",
            content: common.assignedEntity,
            dataKey: "performer"
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "SUBJ",
                inversionInd: "true"
            },
            content: instructions,
            dataKey: "instructions"
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "RSON"
            },
            content: immunizationRefusalReason,
            dataKey: "refusal_reason"
        }
    ]
};

var problemStatus = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.6"),
        fieldLevel.id,
        common.templateCode("ProblemStatus"),
        common.completed,
        fieldLevel.effectiveTime, {
            key: "value",
            attributes: [{
                    "xsi:type": "CD"
                },
                leafLevel.codeName("2.16.840.1.113883.3.88.12.80.68", {
                    codeSystem: "2.16.840.1.113883.6.96",
                    codeSystemName: "SNOMED CT"
                })
            ],
            dataKey: "name"
        }
    ]
};

var ageObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.31"),
        common.templateCode("AgeObservation"),
        common.completed, {
            key: "value",
            attributes: {
                "xsi:type": "PQ",
                value: leafLevel.data("onset_age"),
                unit: leafLevel.codeCodeOnly("2.16.840.1.113883.11.20.9.21", "onset_age_unit")
            }
        }
    ]
};

var healthStatusObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.5"),
        common.templateCode("HealthStatusObservation"),
        common.completed, {
            key: "value",
            attributes: {
                "xsi:type": "CD",
                code: "81323004", // TODO fix
                codeSystem: "2.16.840.1.113883.6.96",
                codeSystemName: "SNOMED CT",
                displayName: leafLevel.data("patient_status")
            }
        }
    ]
};

var problemObservation = exports.problemObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN",
        negationInd: leafLevel.booleanData("negation_indicator")
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.4"),
        fieldLevel.id,
        common.completed, [fieldLevel.effectiveTime, dataKey("problem.date_time")], {
            key: "value",
            attributes: [{
                    "xsi:type": "CD"
                },
                leafLevel.code
            ],
            content: [{
                key: "translation",
                attributes: leafLevel.code,
                dataKey: "translations"
            }],
            dataKey: "problem.code",
            existsWhen: condition.eitherKeyExists('code', 'name')
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "REFR"
            },
            content: problemStatus,
            dataTransform: function (input) {
                if (input && input.status) {
                    var result = input.status;
                    result.identifiers = input.identifiers;
                    return result;
                }
                return null;
            }
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "SUBJ",
                inversionInd: "true"
            },
            content: ageObservation,
            existsWhen: condition.keyExists("onset_age")
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "REFR"
            },
            content: healthStatusObservation,
            existsWhen: condition.keyExists("patient_status")
        }
    ]
};

exports.problemConcernAct = {
    key: "act",
    attributes: {
        classCode: "ACT",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.3"),
        common.templateCode("ProblemConcernAct"), {
            key: "id",
            attributes: {
                root: leafLevel.data("identifier"),
                extension: leafLevel.data("extension")
            },
            dataKey: 'source_list_identifiers',
            existsWhen: condition.keyExists('identifier'),
            required: true
        },
        common.completed,
        fieldLevel.effectiveTime, {
            key: "entryRelationship",
            attributes: {
                typeCode: "SUBJ"
            },
            content: problemObservation
        }
    ]
};

var serviceDeliveryLocation = {
    key: "participantRole",
    attributes: {
        classCode: "SDLOC"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.32"), {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "location_type"
        },
        common.usRealmAddress("addr"),
        common.telecom, {
            key: "playingEntity",
            attributes: {
                classCode: "PLC"
            },
            content: {
                key: "name",
                text: leafLevel.data("name"),
            },
            existsWhen: condition.keyExists("name")
        }
    ]
};

exports.encounterActivities = {
    key: "encounter",
    attributes: {
        classCode: "ENC",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.49"),
        fieldLevel.id, {
            key: "code",
            attributes: [
                leafLevel.code
            ],
            content: [{
                key: "originalText",
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
            }],
            dataKey: "encounter"
        },
        fieldLevel.effectiveTime, {
            key: "performer",
            content: common.assignedEntity,
            dataKey: "performers"
        }, {
            key: "participant",
            attributes: {
                typeCode: "LOC"
            },
            content: serviceDeliveryLocation,
            dataKey: "locations"
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "RSON"
            },
            content: [
                indication
            ],
            dataKey: "findings",
            dataTransform: function (input) {
                input = input.map(function (e) {
                    e.code = {
                        code: "404684003",
                        name: "Finding",
                        code_system: "2.16.840.1.113883.6.96",
                        code_system_name: "SNOMED CT"
                    };
                    return e;
                });
                return input;
            }
        }
    ]
};

var procedureActivity = exports.procedureActivity = [{
        key: "templateId",
        attributes: {
            "root": "2.16.840.1.113883.10.20.22.4.12"
        },
        existsWhen: function (input) {
            return input.procedure_type === "act";
        }
    }, {
        key: "templateId",
        attributes: {
            "root": "2.16.840.1.113883.10.20.22.4.13"
        },
        existsWhen: function (input) {
            return input.procedure_type === "observation";
        }
    }, {
        key: "templateId",
        attributes: {
            "root": "2.16.840.1.113883.10.20.22.4.14"
        },
        existsWhen: function (input) {
            return input.procedure_type === "procedure";
        }
    }, fieldLevel.id, {
        key: "code",
        attributes: leafLevel.code,
        dataKey: "procedure"
    }, {
        key: "value",
        attributes: {
            "xsi:type": "CD"
        },
        existsWhen: function (input) {
            return input.procedure_type === "observation";
        }
    }, {
        key: "priorityCode",
        attributes: leafLevel.code,
        dataKey: "priority"
    }, {
        key: "statusCode",
        attributes: leafLevel.codeName("2.16.840.1.113883.11.20.9.22"),
        dataKey: "status"
    }, {
        key: "targetSiteCode",
        attributes: leafLevel.code,
        dataKey: "body_sites"
    }, {
        key: "performer",
        content: common.assignedEntity,
        dataKey: "performer"
    }, {
        key: "participant",
        attributes: {
            typeCode: "LOC"
        },
        content: serviceDeliveryLocation,
        dataKey: "locations"
    },
    fieldLevel.effectiveTime, {
        key: "specimen",
        attributes: {
            typeCode: "SPC"
        },
        content: {
            key: "specimenRole",
            attributes: {
                classCode: "SPEC"
            },
            content: [
                fieldLevel.id, {
                    key: "specimenPlayingEntity",
                    content: {
                        key: "code",
                        attributes: leafLevel.code,
                        dataKey: "code"
                    },
                    existsWhen: condition.keyExists("code")
                }
            ]
        },
        dataKey: "specimen"
    }
];

exports.procedureActivityAct = {
    key: "act",
    attributes: {
        classCode: "ACT",
        moodCode: "INT" // not constant in the specification
    },
    content: procedureActivity,
    existsWhen: function (input) {
        return input.procedure_type === "act";
    }
};

exports.procedureActivityProcedure = {
    key: "procedure",
    attributes: {
        classCode: "PROC",
        moodCode: "EVN" // not constant in the specification
    },
    content: procedureActivity,
    existsWhen: function (input) {
        return input.procedure_type === "procedure";
    }
};

exports.procedureActivityObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN" // not constant in the specification
    },
    content: procedureActivity,
    existsWhen: function (input) {
        return input.procedure_type === "observation";
    }
};

var planOfCareActivity = exports.planOfCareActivity = [
    fieldLevel.id, {
        key: "code",
        attributes: leafLevel.code,
        dataKey: "plan"
    },
    common.statusCodeNew,
    fieldLevel.effectiveTime
];

exports.planOfCareActivityAct = {
    key: "act",
    attributes: {
        classCode: "ACT",
        moodCode: "RQO"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.39"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "plan"
        },
        common.statusCodeNew,
        fieldLevel.effectiveTime
    ],
    existsWhen: function (input) {
        return input.type === "act";
    }
};

exports.planOfCareActivityObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "RQO"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.44"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "plan"
        },
        common.statusCodeNew,
        fieldLevel.effectiveTime
    ],
    existsWhen: function (input) {
        return input.type === "observation";
    }
};

exports.planOfCareActivityProcedure = {
    key: "procedure",
    attributes: {
        classCode: "PROC",
        moodCode: "RQO"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.41"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "plan"
        },
        common.statusCodeNew,
        fieldLevel.effectiveTime
    ],
    existsWhen: function (input) {
        return input.type === "procedure";
    }
};

exports.planOfCareActivityEncounter = {
    key: "encounter",
    attributes: {
        classCode: "ENC",
        moodCode: "INT"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.40"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "plan"
        },
        common.statusCodeNew,
        fieldLevel.effectiveTime
    ],
    existsWhen: function (input) {
        return input.type === "encounter";
    }
};

exports.planOfCareActivitySubstanceAdministration = {
    key: "substanceAdministration",
    attributes: {
        classCode: "SBADM",
        moodCode: "RQO"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.42"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "plan"
        },
        common.statusCodeNew,
        fieldLevel.effectiveTime
    ],
    existsWhen: function (input) {
        return input.type === "substanceAdministration";
    }
};

exports.planOfCareActivitySupply = {
    key: "supply",
    attributes: {
        classCode: "SPLY",
        moodCode: "INT"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.43"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "plan"
        },
        common.statusCodeNew,
        fieldLevel.effectiveTime
    ],
    existsWhen: function (input) {
        return input.type === "supply";
    }
};

exports.planOfCareActivityInstructions = {
    key: "instructions",
    attributes: {
        classCode: "ACT",
        moodCode: "INT"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.20"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "plan"
        },
        common.statusCodeNew,
        fieldLevel.effectiveTime
    ],
    existsWhen: function (input) {
        return input.type === "instructions";
    }
};

var policyActivity = exports.policyActivity = {
    key: "act",
    attributes: {
        classCode: "ACT",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.61"),
        common.completed, {
            key: "id",
            attributes: {
                root: leafLevel.data("identifier"),
                extension: leafLevel.data("extension")
            },
            dataKey: 'policy.identifiers',
            existsWhen: condition.keyExists('identifier'),
            required: true
        }, {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "policy.code"
        }, {
            key: "performer",
            attributes: {
                typeCode: "PRF"
            },
            content: [
                common.templateId("2.16.840.1.113883.10.20.22.4.87"),
                common.assignedEntity
            ],
            dataKey: "policy.insurance.performer"
        }, {
            key: "performer",
            attributes: {
                typeCode: "PRF"
            },
            content: [
                common.templateId("2.16.840.1.113883.10.20.22.4.88"),
                common.assignedEntity
            ],
            dataKey: "guarantor"
        }, {
            key: "participant",
            attributes: {
                typeCode: "COV"
            },
            content: [
                common.templateId("2.16.840.1.113883.10.20.22.4.89"), [fieldLevel.effectiveTime, key("time")], {
                    key: "participantRole",
                    attributes: {
                        classCode: "PAT"
                    },
                    content: [
                        fieldLevel.id,
                        common.usRealmAddress("addr"),
                        common.telecom, {
                            key: "code",
                            attributes: leafLevel.code,
                            dataKey: "code"
                        }, {
                            key: "playingEntity",
                            content: common.usRealmName
                        }
                    ]
                }
            ],
            dataKey: "participant",
            dataTransform: function (input) {
                if (input.performer) {
                    input.identifiers = input.performer.identifiers;
                    input.address = input.performer.address;
                    input.phone = input.performer.phone;
                }
                return input;
            }
        }, {
            key: "participant",
            attributes: {
                typeCode: "HLD"
            },
            content: [
                common.templateId("2.16.840.1.113883.10.20.22.4.90"), {
                    key: "participantRole",
                    content: [
                        fieldLevel.id,
                        common.usRealmAddress("addr")
                    ],
                    dataKey: "performer"
                }
            ],
            dataKey: "policy_holder"
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "REFR"
            },
            content: {
                key: "act",
                attributes: {
                    classCode: "ACT",
                    moodCode: "EVN"
                },
                content: [
                    common.templateId("2.16.840.1.113883.10.20.1.19"),
                    fieldLevel.id, {
                        key: "entryRelationship",
                        attributes: {
                            typeCode: "SUBJ"
                        },
                        content: {
                            key: "procedure",
                            attributes: {
                                classCode: "PROC",
                                moodCode: "PRMS"
                            },
                            content: {
                                key: "code",
                                attributes: leafLevel.code,
                                dataKey: "code"
                            }
                        },
                        dataKey: "procedure"
                    }
                ]
            },
            dataKey: "authorization"
        }
    ]
};

exports.coverageActivity = {
    key: "act",
    attributes: {
        classCode: "ACT",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.60"),
        fieldLevel.id,
        common.templateCode("CoverageActivity"),
        common.completed, {
            key: "entryRelationship",
            attributes: {
                typeCode: "COMP"
            },
            content: policyActivity
        }
    ]
};

var vitalSignObservation = exports.vitalSignObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.27"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            content: {
                key: "translation",
                attributes: leafLevel.code,
                dataKey: "translations"
            },
            dataKey: "vital"
        }, {
            key: "statusCode",
            attributes: {
                code: leafLevel.data("status")
            }
        },
        fieldLevel.effectiveTime, {
            key: "value",
            attributes: {
                "xsi:type": "PQ",
                value: leafLevel.data("value"),
                unit: leafLevel.data("unit")
            },
            existsWhen: condition.keyExists("value")
        }, {
            key: "interpretationCode",
            attributes: leafLevel.codeName("2.16.840.1.113883.5.83"),
            dataKey: "interpretations"
        }
    ]
};

exports.vitalSignsOrganizer = {
    key: "organizer",
    attributes: {
        classCode: "CLUSTER",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.26"),
        fieldLevel.id,
        common.templateCode("VitalSignsOrganizer"), {
            key: "statusCode",
            attributes: {
                code: leafLevel.data("status")
            }
        },
        fieldLevel.effectiveTime, {
            key: "component",
            content: vitalSignObservation
        }
    ]
};

var resultObservation = exports.resultObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.2"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "result"
        },
        common.completed,
        fieldLevel.effectiveTime, {
            key: "value",
            attributes: {
                "xsi:type": "PQ",
                value: leafLevel.data("value"),
                unit: leafLevel.data("unit")
            },
            existsWhen: condition.keyExists("value")
        }, {
            key: "interpretationCode",
            attributes: {
                code: function (input) {
                    return input.substr(0, 1);
                },
                codeSystem: "2.16.840.1.113883.5.83",
                displayName: leafLevel.input,
                codeSystemName: "ObservationInterpretation"
            },
            dataKey: "interpretations"
        }, {
            key: "referenceRange",
            content: {
                key: "observationRange",
                content: [{
                    key: "text",
                    text: leafLevel.input,
                    dataKey: "range"
                }, {
                    key: "value",
                    attributes: {
                        "xsi:type": "IVL_PQ"
                    },
                    content: [{
                        key: "low",
                        attributes: {
                            value: leafLevel.data("low"),
                            unit: leafLevel.data("unit")
                        },
                        existsWhen: condition.keyExists("low")
                    }, {
                        key: "high",
                        attributes: {
                            value: leafLevel.data("high"),
                            unit: leafLevel.data("unit")
                        },
                        existsWhen: condition.keyExists("high")
                    }],
                    existsWhen: condition.eitherKeyExists("low", "high")
                }]
            },
            dataKey: "reference_range"
        }
    ]
};

exports.resultOrganizer = {
    key: "organizer",
    attributes: {
        classCode: "BATTERY",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.1"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            content: {
                key: "translation",
                attributes: leafLevel.code,
                dataKey: "translations"
            },
            dataKey: "result_set"
        },
        common.completed, {
            key: "component",
            content: resultObservation,
            dataKey: "results"
        }
    ]
};

exports.socialHistoryObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.38"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            content: {
                key: "translation",
                attributes: leafLevel.code,
                dataKey: "translations"
            },
            dataKey: "code",
        },
        common.completed,
        fieldLevel.effectiveTime, {
            key: "value",
            attributes: {
                "xsi:type": "ST"
            },
            text: leafLevel.data("value")
        }
    ],
    existsWhen: function (input) {
        return (!input.value) || input.value.indexOf("smoke") < 0;
    }
};

exports.smokingStatusObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        common.templateId("2.16.840.1.113883.10.20.22.4.78"),
        fieldLevel.id,
        common.templateCode("SmokingStatusObservation"),
        common.completed,
        fieldLevel.effectiveTime, {
            key: "value",
            attributes: [{
                    "xsi:type": "CD"
                },
                leafLevel.codeName("2.16.840.1.113883.11.20.9.38", {
                    codeSystem: "2.16.840.1.113883.6.96",
                    codeSystemName: "SNOMED CT"
                })
            ],
            dataKey: "value"
        }
    ],
    existsWhen: function (input) {
        return input.value && input.value.indexOf("smoke") > -1;
    }
};
