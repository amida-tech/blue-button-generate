require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports.newDocument = function () {
	return document.implementation.createDocument("", "", null);
};

exports.newNode = function (xmlDoc, name, text) {
	var doc =  xmlDoc.ownerDocument || xmlDoc;

	var element = doc.createElement(name);
	if ((text !== undefined) && (text !== null)) {
		var textNode = doc.createTextNode(text);
		element.appendChild(textNode);
	}
	if (xmlDoc.ownerDocument) {
		xmlDoc.appendChild(element);
	} else {
		xmlDoc.appendChild(element);
	}
	return element;
};

exports.nodeAttr = function (node, attr) {
	Object.keys(attr).forEach(function(key) {
		var value = attr[key];
		node.setAttribute(key, value);
	});
};

exports.serializeToString = function (xmlDoc) {
	var serializer = new XMLSerializer();
	var result = serializer.serializeToString(xmlDoc);
	return result;
};

},{}],2:[function(require,module,exports){
"use strict";

exports.keyExists = function (key) {
    return function (input) {
        return input.hasOwnProperty(key);
    };
};

exports.eitherKeyExists = function (key0, key1, key2, key3) {
    return function (input) {
        return input[key0] || input[key1] || input[key2] || input[key3];
    };
};

exports.codeOrDisplayname = function (input) {
    return input.code || input.name;
};

exports.propertyEquals = function (property, value) {
    return function (input) {
        return input && (input[property] === value);
    };
};

},{}],3:[function(require,module,exports){
"use strict";

exports.key = function (overrideKeyValue) {
    return function (template) {
        template.key = overrideKeyValue;
    };
};

exports.required = function (template) {
    template.required = true;
};

exports.dataKey = function (overrideKeyValue) {
    return function (template) {
        template.dataKey = overrideKeyValue;
    };
};

},{}],4:[function(require,module,exports){
"use strict";

var headerLevel = require('./headerLevel');
var fieldLevel = require('./fieldLevel');
var sectionLevel = require('./sectionLevel');
var contentModifier = require("./contentModifier");

var required = contentModifier.required;

exports.ccd = {
    key: "ClinicalDocument",
    attributes: {
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "xmlns": "urn:hl7-org:v3",
        "xmlns:cda": "urn:hl7-org:v3",
        "xmlns:sdtc": "urn:hl7-org:sdtc"
    },
    content: [{
            key: "realmCode",
            attributes: {
                code: "US"
            }
        }, {
            key: "typeId",
            attributes: {
                root: "2.16.840.1.113883.1.3",
                extension: "POCD_HD000040"
            }
        },
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.1.1"),
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.1.2"),
        fieldLevel.id, {
            key: "code",
            attributes: {
                codeSystem: "2.16.840.1.113883.6.1",
                codeSystemName: "LOINC",
                code: "34133-9",
                displayName: "Summarization of Episode Note"
            }
        }, {
            key: "title",
            text: "Community Health and Hospitals: Health Summary"
        },
        [fieldLevel.effectiveTime, required], {
            key: "confidentialityCode",
            attributes: {
                code: "N",
                codeSystem: "2.16.840.1.113883.5.25"
            }
        }, {
            key: "languageCode",
            attributes: {
                code: "en-US"
            }
        }, {
            key: "setId",
            attributes: {
                extension: "sTT988",
                root: "2.16.840.1.113883.19.5.99999.19"
            }
        }, {
            key: "versionNumber",
            attributes: {
                value: "1"
            }
        },
        headerLevel.recordTarget, {
            key: "component",
            content: {
                key: "structuredBody",
                content: [
                    [sectionLevel.allergiesSectionEntriesRequired, required],
                    [sectionLevel.medicationsSectionEntriesRequired, required],
                    [sectionLevel.problemsSectionEntriesRequired, required],
                    [sectionLevel.proceduresSectionEntriesRequired, required],
                    [sectionLevel.resultsSectionEntriesRequired, required],
                    sectionLevel.encountersSectionEntriesOptional,
                    sectionLevel.immunizationsSectionEntriesOptional,
                    sectionLevel.payersSection,
                    sectionLevel.planOfCareSection,
                    sectionLevel.socialHistorySection,
                    sectionLevel.vitalSignsSectionEntriesOptional
                ],
                notImplemented: [
                    "advanceDirectivesSectionEntriesOptional",
                    "familyHistorySection",
                    "functionalStatusSection",
                    "medicalEquipmentSection",
                ]
            }
        }
    ]
};

},{"./contentModifier":3,"./fieldLevel":19,"./headerLevel":20,"./sectionLevel":22}],5:[function(require,module,exports){
"use strict";

var xmlutil = require('./xmlutil');

var expandText = function (input, template) {
    var text = template.text;
    if (text) {
        if (typeof text === 'function') {
            text = text(input);
        }
        if (text) {
            return text;
        }
    }
    return null;
};

var expandAttributes = function expandAttributes(input, context, attrObj, attrs) {
    if (Array.isArray(attrObj)) {
        attrObj.forEach(function (attrObjElem) {
            expandAttributes(input, context, attrObjElem, attrs);
        });
    } else if (typeof attrObj === 'function') {
        expandAttributes(input, context, attrObj(input, context), attrs);
    } else {
        Object.keys(attrObj).forEach(function (attrKey) {
            var attrVal = attrObj[attrKey];
            if (typeof attrVal === 'function') {
                attrVal = attrVal(input, context);
            }
            if ((attrVal !== null) && (attrVal !== undefined)) {
                attrs[attrKey] = attrVal;
            }
        });
    }
};

var fillAttributes = function (node, input, context, template) {
    var attrObj = template.attributes;
    if (attrObj) {
        var inputAttrKey = template.attributeKey;
        if (inputAttrKey) {
            input = input[inputAttrKey];
        }
        if (input) {
            var attrs = {};
            expandAttributes(input, context, attrObj, attrs);
            xmlutil.nodeAttr(node, attrs);
        }
    }
};

var update;

var fillContent = function (node, input, context, template) {
    var content = template.content;
    if (content) {
        if (!Array.isArray(content)) {
            content = [content];
        }
        content.forEach(function (element) {
            if (Array.isArray(element)) {
                var actualElement = Object.create(element[0]);
                for (var i = 1; i < element.length; ++i) {
                    element[i](actualElement);
                }
                update(node, input, context, actualElement);
            } else {
                update(node, input, context, element);
            }
        });
    }
};

var updateUsingTemplate = function updateUsingTemplate(xmlDoc, input, context, template) {
    var condition = template.existsWhen;
    if ((!condition) || condition(input)) {
        var name = template.key;
        var text = expandText(input, template);
        if (text || template.content || template.attributes) {
            var node = xmlutil.newNode(xmlDoc, name, text);

            fillAttributes(node, input, context, template);
            fillContent(node, input, context, template);
            return true;
        }
    }
    return false;
};

var transformInput = function (input, template) {
    var inputKey = template.dataKey;
    if (inputKey) {
        var pieces = inputKey.split('.');
        pieces.forEach(function (piece) {
            input = input && input[piece];
        });
    }
    if (input) {
        var transform = template.dataTransform;
        if (transform) {
            input = transform(input);
        }
    }
    return input;
};

update = exports.update = function (xmlDoc, input, context, template) {
    var filled = false;
    if (input) {
        input = transformInput(input, template);
        if (input) {
            if (Array.isArray(input)) {
                input.forEach(function (element) {
                    filled = updateUsingTemplate(xmlDoc, element, context, template) || filled;
                });
            } else {
                filled = updateUsingTemplate(xmlDoc, input, context, template);
            }
        }
    }
    if ((!filled) && template.required) {
        var node = xmlutil.newNode(xmlDoc, template.key);
        xmlutil.nodeAttr(node, {
            nullFlavor: 'UNK'
        });
    }
};

exports.create = function (template, input, context) {
    var doc = new xmlutil.newDocument();
    update(doc, input, context, template);
    var result = xmlutil.serializeToString(doc);
    return result;
};

},{"./xmlutil":1}],6:[function(require,module,exports){
"use strict";

var fieldLevel = require('../fieldLevel');
var leafLevel = require('../leafLevel');
var condition = require('../condition');
var contentModifier = require("../contentModifier");

var sel = require("./sharedEntryLevel");

var key = contentModifier.key;
var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

var allergyStatusObservation = {
    key: "observation",
    attributes: {
        "classCode": "OBS",
        "moodCode": "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.28"),
        fieldLevel.templateCode("AllergyStatusObservation"),
        fieldLevel.statusCodeCompleted, {
            key: "value",
            attributes: [
                leafLevel.typeCE,
                leafLevel.code
            ],
            existsWhen: condition.codeOrDisplayname,
            required: true
        }
    ],
    dataKey: "status"
};

var allergyIntoleranceObservation = exports.allergyIntoleranceObservation = {
    key: "observation",
    attributes: {
        "classCode": "OBS",
        "moodCode": "EVN",
        "negationInd": leafLevel.boolInputProperty("negation_indicator")
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.7"),
        fieldLevel.id,
        fieldLevel.templateCode("AllergyObservation"),
        fieldLevel.statusCodeCompleted, [fieldLevel.effectiveTime, required], {
            key: "value",
            attributes: [
                leafLevel.typeCD,
                leafLevel.code
            ],
            content: {
                key: "originalText",
                content: {
                    key: "reference",
                    attributes: {
                        "value": leafLevel.nextReference("reaction")
                    }
                }
            },
            dataKey: 'intolerance',
            existsWhen: condition.codeOrDisplayname,
            required: true
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
                        attributes: leafLevel.code,
                        content: [{
                            key: "originalText",
                            content: [{
                                key: "reference",
                                attributes: {
                                    "value": leafLevel.sameReference("reaction")
                                }
                            }]
                        }, {
                            key: "translation",
                            attributes: leafLevel.code,
                            dataKey: "translations"
                        }],
                        require: true
                    }]
                }],
                required: true
            }],
            dataKey: 'allergen'
        }, {
            key: "entryRelationship",
            attributes: {
                "typeCode": "SUBJ",
                "inversionInd": "true"
            },
            content: [
                [allergyStatusObservation, required]
            ],
            existsWhen: condition.keyExists("status")
        }, {
            key: "entryRelationship",
            attributes: {
                "typeCode": "MFST",
                "inversionInd": "true"
            },
            content: [
                [sel.reactionObservation, required]
            ],
            dataKey: 'reactions',
            existsWhen: condition.keyExists('reaction')
        }, {
            key: "entryRelationship",
            attributes: {
                "typeCode": "SUBJ",
                "inversionInd": "true"
            },
            content: [
                [sel.severityObservation, required]
            ],
            existsWhen: condition.keyExists('severity')
        }
    ],
    dataKey: "observation",
    warning: [
        "negationInd attribute is not specified in specification"
    ]
};

var allergyProblemAct = exports.allergyProblemAct = {
    key: "act",
    attributes: {
        classCode: "ACT",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.30"),
        fieldLevel.id,
        fieldLevel.templateCode("AllergyProblemAct"),
        fieldLevel.statusCodeActive, [fieldLevel.effectiveTime, required], {
            key: "entryRelationship",
            attributes: {
                typeCode: "SUBJ",
                inversionInd: "true"
            },
            content: [allergyIntoleranceObservation, required],
            existsWhen: condition.keyExists('observation'),
            required: true,
            warning: "inversionInd is not in spec"
        }
    ],
    warning: "statusCode is not constant in spec"
};

},{"../condition":2,"../contentModifier":3,"../fieldLevel":19,"../leafLevel":21,"./sharedEntryLevel":16}],7:[function(require,module,exports){
"use strict";

var fieldLevel = require('../fieldLevel');
var leafLevel = require('../leafLevel');
var contentModifier = require("../contentModifier");

var sharedEntryLevel = require("./sharedEntryLevel");

var key = contentModifier.key;
var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

exports.encounterActivities = {
    key: "encounter",
    attributes: {
        classCode: "ENC",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.49"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            content: [{
                key: "originalText",
                content: [{
                    key: "reference",
                    attributes: {
                        "value": leafLevel.nextReference("Encounter")
                    }
                }]
            }, {
                key: "translation",
                attributes: leafLevel.code,
                dataKey: "translations"
            }],
            dataKey: "encounter"
        },
        [fieldLevel.effectiveTime, required],
        [fieldLevel.performer, dataKey("performers")], {
            key: "participant",
            attributes: {
                typeCode: "LOC"
            },
            content: [
                [sharedEntryLevel.serviceDeliveryLocation, required]
            ],
            dataKey: "locations"
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "RSON"
            },
            content: [
                [sharedEntryLevel.indication, required]
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
            },
            toDo: "move dataTransform to blue-button-meta"
        }
    ],
    notImplemented: [
        "entryRelationship:encounterDiagnosis",
        "dishargeDispositionCode"
    ]
};

},{"../contentModifier":3,"../fieldLevel":19,"../leafLevel":21,"./sharedEntryLevel":16}],8:[function(require,module,exports){
"use strict";

var fieldLevel = require('../fieldLevel');
var leafLevel = require('../leafLevel');
var condition = require("../condition");
var contentModifier = require("../contentModifier");

var sharedEntryLevel = require("./sharedEntryLevel");

var key = contentModifier.key;
var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

var immunizationMedicationInformation = {
    key: "manufacturedProduct",
    attributes: {
        classCode: "MANU"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.54"),
        fieldLevel.id, {
            key: "manufacturedMaterial",
            content: [{
                key: "code",
                attributes: leafLevel.code,
                content: [{
                    key: "originalText",
                    text: leafLevel.inputProperty("unencoded_name"),
                    content: {
                        key: "reference",
                        attributes: {
                            "value": leafLevel.nextReference("imminfo")
                        }
                    }
                }, {
                    key: "translation",
                    attributes: leafLevel.code,
                    dataKey: "translations"
                }]
            }, {
                key: "lotNumberText",
                text: leafLevel.input,
                dataKey: "lot_number"
            }],
            dataKey: "product",
            required: true
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
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.53"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.codeFromName("2.16.840.1.113883.5.8"),
            required: true
        },
        fieldLevel.statusCodeCompleted
    ]
};

var immunizationActivityAttributes = function (input) {
    if (input.status) {
        if (input.status === "refused") {
            return {
                moodCode: "EVN",
                negationInd: "true"
            };
        }
        if (input.status === "pending") {
            return {
                moodCode: "INT",
                negationInd: "false"
            };
        }
        if (input.status === "complete") {
            return {
                moodCode: "EVN",
                negationInd: "false"
            };
        }
    }
    return null;
};

exports.immunizationActivity = {
    key: "substanceAdministration",
    attributes: [{
        classCode: "SBADM"
    }, immunizationActivityAttributes],
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.52"),
        fieldLevel.id,
        fieldLevel.text(leafLevel.nextReference("immunization")),
        fieldLevel.statusCodeCompleted, [fieldLevel.effectiveTime, required], {
            key: "repeatNumber",
            attributes: {
                value: leafLevel.inputProperty("sequence_number")
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
                value: leafLevel.inputProperty("value"),
                unit: leafLevel.inputProperty("unit")
            },
            dataKey: "administration.dose"
        }, {
            key: "consumable",
            content: [
                [immunizationMedicationInformation, required]
            ],
            dataKey: "product",
            required: true
        },
        fieldLevel.performer, {
            key: "entryRelationship",
            attributes: {
                typeCode: "SUBJ",
                inversionInd: "true"
            },
            content: [sharedEntryLevel.instructions, required],
            dataKey: "instructions"
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "RSON"
            },
            content: [immunizationRefusalReason, required],
            dataKey: "refusal_reason"
        }
    ],
    notImplemented: [
        "code",
        "administrationUnitCode",
        "participant:drugVehicle",
        "entryRelationship:indication",
        "entryRelationship:medicationSupplyOrder",
        "entryRelationship:medicationDispense",
        "entryRelationship:reactionObservation",
        "entryRelationship:preconditionForSubstanceAdministration"
    ]
};

},{"../condition":2,"../contentModifier":3,"../fieldLevel":19,"../leafLevel":21,"./sharedEntryLevel":16}],9:[function(require,module,exports){
"use strict";

var allergyEntryLevel = require("./allergyEntryLevel");
var resultEntryLevel = require("./resultEntryLevel");
var socialHistoryEntryLevel = require('./socialHistoryEntryLevel');
var payerEntryLevel = require('./payerEntryLevel');
var vitalSignEntryLevel = require('./vitalSignEntryLevel');
var planOfCareEntryLevel = require('./planOfCareEntryLevel');
var procedureEntryLevel = require("./procedureEntryLevel");
var problemEntryLevel = require("./problemEntryLevel");
var encounterEntryLevel = require("./encounterEntryLevel");
var immunizationEntryLevel = require("./immunizationEntryLevel");
var medicationEntryLevel = require("./medicationEntryLevel");

exports.allergyProblemAct = allergyEntryLevel.allergyProblemAct;

exports.medicationActivity = medicationEntryLevel.medicationActivity;

exports.immunizationActivity = immunizationEntryLevel.immunizationActivity;

exports.problemConcernAct = problemEntryLevel.problemConcernAct;

exports.encounterActivities = encounterEntryLevel.encounterActivities;

exports.procedureActivityAct = procedureEntryLevel.procedureActivityAct;
exports.procedureActivityProcedure = procedureEntryLevel.procedureActivityProcedure;
exports.procedureActivityObservation = procedureEntryLevel.procedureActivityObservation;

exports.planOfCareActivityAct = planOfCareEntryLevel.planOfCareActivityAct;
exports.planOfCareActivityObservation = planOfCareEntryLevel.planOfCareActivityObservation;
exports.planOfCareActivityProcedure = planOfCareEntryLevel.planOfCareActivityProcedure;
exports.planOfCareActivityEncounter = planOfCareEntryLevel.planOfCareActivityEncounter;
exports.planOfCareActivitySubstanceAdministration = planOfCareEntryLevel.planOfCareActivitySubstanceAdministration;
exports.planOfCareActivitySupply = planOfCareEntryLevel.planOfCareActivitySupply;
exports.planOfCareActivityInstructions = planOfCareEntryLevel.planOfCareActivityInstructions;

exports.coverageActivity = payerEntryLevel.coverageActivity;

exports.vitalSignsOrganizer = vitalSignEntryLevel.vitalSignsOrganizer;

exports.resultOrganizer = resultEntryLevel.resultOrganizer;

exports.socialHistoryObservation = socialHistoryEntryLevel.socialHistoryObservation;
exports.smokingStatusObservation = socialHistoryEntryLevel.smokingStatusObservation;

},{"./allergyEntryLevel":6,"./encounterEntryLevel":7,"./immunizationEntryLevel":8,"./medicationEntryLevel":10,"./payerEntryLevel":11,"./planOfCareEntryLevel":12,"./problemEntryLevel":13,"./procedureEntryLevel":14,"./resultEntryLevel":15,"./socialHistoryEntryLevel":17,"./vitalSignEntryLevel":18}],10:[function(require,module,exports){
"use strict";

var fieldLevel = require('../fieldLevel');
var leafLevel = require('../leafLevel');
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
                attributes: leafLevel.code,
                content: [{
                    key: "originalText",
                    text: leafLevel.inputProperty("unencoded_name"),
                    content: [{
                        key: "reference",
                        attributes: {
                            "value": leafLevel.nextReference("medinfo")
                        }
                    }]
                }, {
                    key: "translation",
                    attributes: leafLevel.code,
                    dataKey: "translations"
                }]
            }],
            dataKey: "product",
            required: true
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
        fieldLevel.author, {
            key: "entryRelationship",
            attributes: {
                typeCode: "SUBJ",
                inversionInd: "true"
            },
            content: [
                [sharedEntryLevel.instructions, required]
            ],
            dataKey: "instructions"
        }
    ],
    toDo: "statusCode needs to allow values other than completed",
    notImplemented: [
        "product:immunizationMedicationInformation"
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
            key: "product",
            content: medicationInformation,
            dataKey: "product"
        },
        fieldLevel.performer
    ],
    toDo: "statusCode needs to allow different values than completed",
    notImplemented: [
        "repeatNumber",
        "quantity",
        "product:ImmunizationMedicationInformation",
        "entryRelationship:medicationSupplyOrder",
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
        fieldLevel.statusCodeCompleted, [fieldLevel.effectiveTime, required], {
            key: "effectiveTime",
            attributes: {
                "xsi:type": "PIVL_TS",
                "institutionSpecified": "true",
                "operator": "A"
            },
            content: {
                key: "period",
                attributes: {
                    value: leafLevel.inputProperty("value"),
                    unit: leafLevel.inputProperty("unit")
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
                value: leafLevel.inputProperty("value"),
                unit: leafLevel.inputProperty("unit")
            },
            dataKey: "administration.dose"
        }, {
            key: "rateQuantity",
            attributes: {
                value: leafLevel.inputProperty("value"),
                unit: leafLevel.inputProperty("unit")
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
        },
        fieldLevel.performer, {
            key: "participant",
            attributes: {
                typeCode: "CSM"
            },
            content: [
                [sharedEntryLevel.drugVehicle, required]
            ],
            dataKey: "drug_vehicle"
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "RSON"
            },
            content: [
                [sharedEntryLevel.indication, required]
            ],
            dataKey: "indication"
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "REFR"
            },
            content: [
                [medicationSupplyOrder, required]
            ],
            dataKey: "supply"
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "REFR"
            },
            content: [
                [medicationDispense, required]
            ],
            dataKey: "dispense"
        }, {
            key: "precondition",
            attributes: {
                typeCode: "PRCN"
            },
            content: [
                fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.25"), [sharedEntryLevel.preconditionForSubstanceAdministration, required]
            ],
            dataKey: "precondition",
            warning: "templateId needs to be in preconditionForSubstanceAdministration but CCD_1.xml contradicts"
        }
    ],
    notImplemented: [
        "code",
        "text:reference",
        "repeatNumber",
        "approachSiteCode",
        "maxDoseQuantity",
        "entryRelationship:instructions",
        "reactionObservation"
    ]
};

},{"../condition":2,"../contentModifier":3,"../fieldLevel":19,"../leafLevel":21,"./sharedEntryLevel":16}],11:[function(require,module,exports){
"use strict";

var fieldLevel = require('../fieldLevel');
var leafLevel = require('../leafLevel');
var condition = require("../condition");
var contentModifier = require("../contentModifier");

var key = contentModifier.key;
var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

var policyActivity = {
    key: "act",
    attributes: {
        classCode: "ACT",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.61"),
        fieldLevel.statusCodeCompleted, {
            key: "id",
            attributes: {
                root: leafLevel.inputProperty("identifier"),
                extension: leafLevel.inputProperty("extension")
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
                fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.87"),
                fieldLevel.assignedEntity
            ],
            dataKey: "policy.insurance.performer"
        }, {
            key: "performer",
            attributes: {
                typeCode: "PRF"
            },
            content: [
                fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.88"),
                fieldLevel.assignedEntity
            ],
            dataKey: "guarantor"
        }, {
            key: "participant",
            attributes: {
                typeCode: "COV"
            },
            content: [
                fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.89"), [fieldLevel.effectiveTime, key("time")], {
                    key: "participantRole",
                    attributes: {
                        classCode: "PAT"
                    },
                    content: [
                        fieldLevel.id,
                        fieldLevel.usRealmAddress,
                        fieldLevel.telecom, {
                            key: "code",
                            attributes: leafLevel.code,
                            dataKey: "code"
                        }, {
                            key: "playingEntity",
                            content: fieldLevel.usRealmName
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
                fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.90"), {
                    key: "participantRole",
                    content: [
                        fieldLevel.id,
                        fieldLevel.usRealmAddress
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
                    fieldLevel.templateId("2.16.840.1.113883.10.20.1.19"),
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
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.60"),
        fieldLevel.id,
        fieldLevel.templateCode("CoverageActivity"),
        fieldLevel.statusCodeCompleted, {
            key: "entryRelationship",
            attributes: {
                typeCode: "COMP"
            },
            content: [
                [policyActivity, required]
            ],
            required: true
        }
    ]
};

},{"../condition":2,"../contentModifier":3,"../fieldLevel":19,"../leafLevel":21}],12:[function(require,module,exports){
"use strict";

var fieldLevel = require('../fieldLevel');
var leafLevel = require('../leafLevel');
var condition = require("../condition");
var contentModifier = require("../contentModifier");

var key = contentModifier.key;
var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

exports.planOfCareActivityAct = {
    key: "act",
    attributes: {
        classCode: "ACT",
        moodCode: "RQO"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.39"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "plan"
        },
        fieldLevel.statusCodeNew,
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
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.44"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "plan"
        },
        fieldLevel.statusCodeNew,
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
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.41"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "plan"
        },
        fieldLevel.statusCodeNew,
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
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.40"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "plan"
        },
        fieldLevel.statusCodeNew,
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
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.42"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "plan"
        },
        fieldLevel.statusCodeNew,
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
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.43"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "plan"
        },
        fieldLevel.statusCodeNew,
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
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.20"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "plan"
        },
        fieldLevel.statusCodeNew,
        fieldLevel.effectiveTime
    ],
    existsWhen: function (input) {
        return input.type === "instructions";
    }
};

},{"../condition":2,"../contentModifier":3,"../fieldLevel":19,"../leafLevel":21}],13:[function(require,module,exports){
"use strict";

var fieldLevel = require('../fieldLevel');
var leafLevel = require('../leafLevel');
var condition = require("../condition");
var contentModifier = require("../contentModifier");

var sharedEntryLevel = require("./sharedEntryLevel");

var key = contentModifier.key;
var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

var problemStatus = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.6"),
        fieldLevel.id,
        fieldLevel.templateCode("ProblemStatus"),
        fieldLevel.statusCodeCompleted,
        fieldLevel.effectiveTime, {
            key: "value",
            attributes: [{
                    "xsi:type": "CD"
                },
                leafLevel.codeFromName("2.16.840.1.113883.3.88.12.80.68")
            ],
            dataKey: "name",
            required: true
        }
    ],
    warning: "effectiveTime does not exist in the specification"
};

var healthStatusObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.5"),
        fieldLevel.templateCode("HealthStatusObservation"),
        fieldLevel.text(leafLevel.nextReference("healthStatus")),
        fieldLevel.statusCodeCompleted, {
            key: "value",
            attributes: {
                "xsi:type": "CD",
                code: "81323004",
                codeSystem: "2.16.840.1.113883.6.96",
                codeSystemName: "SNOMED CT",
                displayName: leafLevel.inputProperty("patient_status")
            },
            required: true,
            toDo: "The attribute should not be constant"
        }
    ]
};

var problemObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN",
        negationInd: leafLevel.boolInputProperty("negation_indicator")
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.4"),
        fieldLevel.id,
        fieldLevel.text(leafLevel.nextReference("problem")),
        fieldLevel.statusCodeCompleted, [fieldLevel.effectiveTime, dataKey("problem.date_time")], {
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
            existsWhen: condition.codeOrDisplayname,
            required: true
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "REFR"
            },
            content: [
                [problemStatus, required]
            ],
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
            content: [
                [sharedEntryLevel.ageObservation, required]
            ],
            existsWhen: condition.keyExists("onset_age")
        }, {
            key: "entryRelationship",
            attributes: {
                typeCode: "REFR"
            },
            content: [
                [healthStatusObservation, required]
            ],
            existsWhen: condition.keyExists("patient_status")
        }
    ],
    notImplemented: [
        "code"
    ]
};

exports.problemConcernAct = {
    key: "act",
    attributes: {
        classCode: "ACT",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.3"),
        fieldLevel.templateCode("ProblemConcernAct"), {
            key: "id",
            attributes: {
                root: leafLevel.inputProperty("identifier"),
                extension: leafLevel.inputProperty("extension")
            },
            dataKey: 'source_list_identifiers',
            existsWhen: condition.keyExists('identifier'),
            required: true
        },
        fieldLevel.statusCodeCompleted, [fieldLevel.effectiveTime, required], {
            key: "entryRelationship",
            attributes: {
                typeCode: "SUBJ"
            },
            content: [
                [problemObservation, required]
            ],
            required: true
        }
    ]
};

},{"../condition":2,"../contentModifier":3,"../fieldLevel":19,"../leafLevel":21,"./sharedEntryLevel":16}],14:[function(require,module,exports){
"use strict";

var fieldLevel = require('../fieldLevel');
var leafLevel = require('../leafLevel');
var condition = require("../condition");
var contentModifier = require("../contentModifier");

var sharedEntryLevel = require("./sharedEntryLevel");

var key = contentModifier.key;
var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

exports.procedureActivityAct = {
    key: "act",
    attributes: {
        classCode: "ACT",
        moodCode: "INT" // not constant in the specification
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.12"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            content: [{
                key: "originalText",
                content: [{
                    key: "reference",
                    attributes: {
                        "value": leafLevel.nextReference("procedure")
                    }
                }]
            }],
            dataKey: "procedure",
            required: true
        }, {
            key: "statusCode",
            attributes: leafLevel.codeFromName("2.16.840.1.113883.11.20.9.22"),
            dataKey: "status",
            required: true
        },
        fieldLevel.effectiveTime, {
            key: "priorityCode",
            attributes: leafLevel.code,
            dataKey: "priority"
        }, {
            key: "targetSiteCode",
            attributes: leafLevel.code,
            dataKey: "body_sites"
        },
        fieldLevel.performer, {
            key: "participant",
            attributes: {
                typeCode: "LOC"
            },
            content: [
                [sharedEntryLevel.serviceDeliveryLocation, required]
            ],
            dataKey: "locations"
        }
    ],
    existsWhen: condition.propertyEquals("procedure_type", "act"),
    toDo: ["moodCode should be variable"],
    notImplemented: [
        "entryRelationship:encounter",
        "entryRelationship:indication",
        "entryRelationship:medicationActivity"
    ]
};

exports.procedureActivityProcedure = {
    key: "procedure",
    attributes: {
        classCode: "PROC",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.14"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            content: [{
                key: "originalText",
                content: [{
                    key: "reference",
                    attributes: {
                        "value": leafLevel.nextReference("procedure")
                    }
                }]
            }],
            dataKey: "procedure",
            required: true
        }, {
            key: "statusCode",
            attributes: leafLevel.codeFromName("2.16.840.1.113883.11.20.9.22"),
            dataKey: "status",
            required: true
        },
        fieldLevel.effectiveTime, {
            key: "priorityCode",
            attributes: leafLevel.code,
            dataKey: "priority"
        }, {
            key: "targetSiteCode",
            attributes: leafLevel.code,
            dataKey: "body_sites"
        }, {
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
                ],
                required: true
            },
            dataKey: "specimen"
        },
        fieldLevel.performer, {
            key: "participant",
            attributes: {
                typeCode: "LOC"
            },
            content: [
                [sharedEntryLevel.serviceDeliveryLocation, required]
            ],
            dataKey: "locations"
        }
    ],
    existsWhen: condition.propertyEquals("procedure_type", "procedure"),
    toDo: ["moodCode should be variable"],
    notImplemented: [
        "methodCode",
        "participant:productInstance",
        "entryRelationship:encounter",
        "entryRelationship:instructions",
        "entryRelationship:indication",
        "entryRelationship:medicationActivity"
    ]
};

exports.procedureActivityObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN" // not constant in the specification
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.13"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            content: [{
                key: "originalText",
                content: [{
                    key: "reference",
                    attributes: {
                        "value": leafLevel.nextReference("procedure")
                    }
                }]
            }],
            dataKey: "procedure",
            required: true
        }, {
            key: "statusCode",
            attributes: leafLevel.codeFromName("2.16.840.1.113883.11.20.9.22"),
            dataKey: "status",
            required: true
        },
        fieldLevel.effectiveTime, {
            key: "priorityCode",
            attributes: leafLevel.code,
            dataKey: "priority"
        }, {
            key: "value",
            attributes: {
                "xsi:type": "CD"
            }
        }, {
            key: "targetSiteCode",
            attributes: leafLevel.code,
            dataKey: "body_sites"
        },
        fieldLevel.performer, {
            key: "participant",
            attributes: {
                typeCode: "LOC"
            },
            content: [
                [sharedEntryLevel.serviceDeliveryLocation, required]
            ],
            dataKey: "locations"
        }
    ],
    existsWhen: condition.propertyEquals("procedure_type", "observation"),
    toDo: ["moodCode should be variable"],
    notImplemented: [
        "entryRelationship:encounter",
        "entryRelationship:instructions",
        "entryRelationship:indication",
        "entryRelationship:medicationActivity"
    ]
};

},{"../condition":2,"../contentModifier":3,"../fieldLevel":19,"../leafLevel":21,"./sharedEntryLevel":16}],15:[function(require,module,exports){
"use strict";

var fieldLevel = require('../fieldLevel');
var leafLevel = require('../leafLevel');
var condition = require("../condition");

var contentModifier = require("../contentModifier");

var required = contentModifier.required;

var resultObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.2"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "result",
            required: true
        },
        fieldLevel.text(leafLevel.nextReference("result")),
        fieldLevel.statusCodeCompleted, [fieldLevel.effectiveTime, required], {
            key: "value",
            attributes: {
                "xsi:type": "PQ",
                value: leafLevel.inputProperty("value"),
                unit: leafLevel.inputProperty("unit")
            },
            existsWhen: condition.keyExists("value"),
            required: true
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
                            value: leafLevel.inputProperty("low"),
                            unit: leafLevel.inputProperty("unit")
                        },
                        existsWhen: condition.keyExists("low")
                    }, {
                        key: "high",
                        attributes: {
                            value: leafLevel.inputProperty("high"),
                            unit: leafLevel.inputProperty("unit")
                        },
                        existsWhen: condition.keyExists("high")
                    }],
                    existsWhen: condition.eitherKeyExists("low", "high")
                }],
                required: true
            },
            dataKey: "reference_range"
        }
    ],
    notIplemented: [
        "variable statusCode",
        "methodCode",
        "targetSiteCode",
        "author"
    ]
};

exports.resultOrganizer = {
    key: "organizer",
    attributes: {
        classCode: "BATTERY",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.1"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            content: {
                key: "translation",
                attributes: leafLevel.code,
                dataKey: "translations"
            },
            dataKey: "result_set",
            required: true
        },
        fieldLevel.statusCodeCompleted, {
            key: "component",
            content: [
                [resultObservation, required]
            ],
            dataKey: "results",
            required: true
        }
    ],
    notIplemented: [
        "variable @classCode",
        "variable statusCode"
    ]
};

},{"../condition":2,"../contentModifier":3,"../fieldLevel":19,"../leafLevel":21}],16:[function(require,module,exports){
"use strict";

var fieldLevel = require('../fieldLevel');
var leafLevel = require('../leafLevel');
var condition = require('../condition');

var severityObservation = exports.severityObservation = {
    key: "observation",
    attributes: {
        "classCode": "OBS",
        "moodCode": "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.8"),
        fieldLevel.templateCode("SeverityObservation"),
        fieldLevel.text(leafLevel.nextReference("severity")),
        fieldLevel.statusCodeCompleted, {
            key: "value",
            attributes: [
                leafLevel.typeCD,
                leafLevel.code
            ],
            dataKey: "code",
            existsWhen: condition.codeOrDisplayname,
            required: true
        }, {
            key: "interpretationCode",
            attributes: leafLevel.code,
            dataKey: "interpretation",
            existsWhen: condition.codeOrDisplayname
        }
    ],
    dataKey: "severity",
    existsWhen: condition.keyExists("code")
};

var reactionObservation = exports.reactionObservation = {
    key: "observation",
    attributes: {
        "classCode": "OBS",
        "moodCode": "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.9"),
        fieldLevel.id,
        fieldLevel.nullFlavor("code"),
        fieldLevel.text(leafLevel.sameReference("reaction")),
        fieldLevel.statusCodeCompleted,
        fieldLevel.effectiveTime, {
            key: "value",
            attributes: [
                leafLevel.typeCD,
                leafLevel.code
            ],
            dataKey: 'reaction',
            existsWhen: condition.codeOrDisplayname,
            required: true
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
    notImplemented: [
        "Procedure Activity Procedure",
        "Medication Activity"
    ]
};

exports.serviceDeliveryLocation = {
    key: "participantRole",
    attributes: {
        classCode: "SDLOC"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.32"), {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "location_type",
            required: true
        },
        fieldLevel.usRealmAddress,
        fieldLevel.telecom, {
            key: "playingEntity",
            attributes: {
                classCode: "PLC"
            },
            content: {
                key: "name",
                text: leafLevel.inputProperty("name"),
            },
            existsWhen: condition.keyExists("name")
        }
    ]
};

exports.ageObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.31"),
        fieldLevel.templateCode("AgeObservation"),
        fieldLevel.statusCodeCompleted, {
            key: "value",
            attributes: {
                "xsi:type": "PQ",
                value: leafLevel.inputProperty("onset_age"),
                unit: leafLevel.codeOnlyFromName("2.16.840.1.113883.11.20.9.21", "onset_age_unit")
            },
            required: true
        }
    ]
};

exports.indication = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.19"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            dataKey: "code",
            required: true
        },
        fieldLevel.statusCodeCompleted,
        fieldLevel.effectiveTime, {
            key: "value",
            attributes: [
                leafLevel.typeCD,
                leafLevel.code
            ],
            dataKey: "value",
            existsWhen: condition.codeOrDisplayname
        }
    ],
    notImplemented: [
        "value should handle nullFlavor=OTH and translation"
    ]
};

exports.preconditionForSubstanceAdministration = {
    key: "criterion",
    content: [{
        key: "code",
        attributes: {
            code: leafLevel.inputProperty("code"),
            codeSystem: "2.16.840.1.113883.5.4"
        },
        dataKey: "code"
    }, {
        key: "value",
        attributes: [
            leafLevel.typeCE, // TODO: spec has CD, spec example has CE
            leafLevel.code
        ],
        dataKey: "value",
        existsWhen: condition.codeOrDisplayname
    }],
    warning: [
        "value type is CE is example but CD in spec",
        "templateId should be here according to spec but per CCD_1 is put in the parent"
    ]
};

exports.drugVehicle = {
    key: "participantRole",
    attributes: {
        classCode: "MANU"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.24"), {
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
                attributes: leafLevel.code,
                required: true
            }, {
                key: "name",
                text: leafLevel.inputProperty("name")
            }],
            required: true
        }
    ]
};

exports.instructions = {
    key: "act",
    attributes: {
        classCode: "ACT",
        moodCode: "INT"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.20"), {
            key: "code",
            attributes: [
                leafLevel.code
            ],
            dataKey: "code",
            required: true
        },
        fieldLevel.text(leafLevel.nextReference("instruction")),
        fieldLevel.statusCodeCompleted
    ]
};

},{"../condition":2,"../fieldLevel":19,"../leafLevel":21}],17:[function(require,module,exports){
"use strict";

var fieldLevel = require('../fieldLevel');
var leafLevel = require('../leafLevel');

var contentModifier = require("../contentModifier");

var required = contentModifier.required;

exports.socialHistoryObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.38"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            content: [{
                key: "originalText",
                text: leafLevel.inputProperty("unencoded_name"),
                content: {
                    key: "reference",
                    attributes: {
                        "value": leafLevel.nextReference("social")
                    }
                }
            }, {
                key: "translation",
                attributes: leafLevel.code,
                dataKey: "translations"
            }],
            dataKey: "code",
        },
        fieldLevel.statusCodeCompleted,
        fieldLevel.effectiveTime, {
            key: "value",
            attributes: {
                "xsi:type": "ST"
            },
            text: leafLevel.inputProperty("value")
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
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.78"),
        fieldLevel.id,
        fieldLevel.templateCode("SmokingStatusObservation"),
        fieldLevel.statusCodeCompleted, [fieldLevel.effectiveTime, required], {
            key: "value",
            attributes: [{
                    "xsi:type": "CD"
                },
                leafLevel.codeFromName("2.16.840.1.113883.11.20.9.38")
            ],
            required: true,
            dataKey: "value"
        }
    ],
    existsWhen: function (input) {
        return input.value && input.value.indexOf("smoke") > -1;
    }
};

},{"../contentModifier":3,"../fieldLevel":19,"../leafLevel":21}],18:[function(require,module,exports){
"use strict";

var fieldLevel = require('../fieldLevel');
var leafLevel = require('../leafLevel');
var condition = require("../condition");

var contentModifier = require("../contentModifier");

var required = contentModifier.required;

var vitalSignObservation = {
    key: "observation",
    attributes: {
        classCode: "OBS",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.27"),
        fieldLevel.id, {
            key: "code",
            attributes: leafLevel.code,
            content: [{
                key: "originalText",
                content: {
                    key: "reference",
                    attributes: {
                        "value": leafLevel.nextReference("vital")
                    }
                }
            }, {
                key: "translation",
                attributes: leafLevel.code,
                dataKey: "translations"
            }],
            dataKey: "vital",
            required: true
        }, {
            key: "statusCode",
            attributes: {
                code: leafLevel.inputProperty("status")
            }
        },
        [fieldLevel.effectiveTime, required], {
            key: "value",
            attributes: {
                "xsi:type": "PQ",
                value: leafLevel.inputProperty("value"),
                unit: leafLevel.inputProperty("unit")
            },
            existsWhen: condition.keyExists("value"),
            required: true
        }, {
            key: "interpretationCode",
            attributes: leafLevel.codeFromName("2.16.840.1.113883.5.83"),
            dataKey: "interpretations"
        }
    ],
    notImplemented: [
        "constant statusCode",
        "methodCode",
        "targetSiteCode",
        "author"
    ]
};

exports.vitalSignsOrganizer = {
    key: "organizer",
    attributes: {
        classCode: "CLUSTER",
        moodCode: "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.26"),
        fieldLevel.id,
        fieldLevel.templateCode("VitalSignsOrganizer"), {
            key: "statusCode",
            attributes: {
                code: leafLevel.inputProperty("status")
            }
        },
        [fieldLevel.effectiveTime, required], {
            key: "component",
            content: vitalSignObservation,
            required: true
        }
    ],
    notImplemented: [
        "constant statusCode"
    ]
};

},{"../condition":2,"../contentModifier":3,"../fieldLevel":19,"../leafLevel":21}],19:[function(require,module,exports){
"use strict";

var bbm = require("blue-button-meta");

var condition = require("./condition");
var leafLevel = require("./leafLevel");
var translate = require("./translate");
var contentModifier = require("./contentModifier");

var templateCodes = bbm.CCDA.sections_entries_codes.codes;

var key = contentModifier.key;
var required = contentModifier.required;

exports.templateId = function (id) {
    return {
        key: "templateId",
        attributes: {
            "root": id
        }
    };
};

exports.templateCode = function (name) {
    var raw = templateCodes[name];
    var result = {
        key: "code",
        attributes: {
            code: raw.code,
            displayName: raw.name,
            codeSystem: raw.code_system,
            codeSystemName: raw.code_system_name
        }
    };
    return result;
};

exports.templateTitle = function (name) {
    var raw = templateCodes[name];
    var result = {
        key: "title",
        text: raw.name,
    };
    return result;
};

var id = exports.id = {
    key: "id",
    attributes: {
        root: leafLevel.inputProperty("identifier"),
        extension: leafLevel.inputProperty("extension")
    },
    dataKey: 'identifiers',
    existsWhen: condition.keyExists('identifier'),
    required: true
};

exports.statusCodeCompleted = {
    key: "statusCode",
    attributes: {
        code: 'completed'
    }
};

exports.statusCodeActive = {
    key: "statusCode",
    attributes: {
        code: 'active'
    }
};

exports.statusCodeNew = {
    key: "statusCode",
    attributes: {
        code: 'new'
    }
};

var effectiveTime = exports.effectiveTime = {
    key: "effectiveTime",
    attributes: {
        "value": leafLevel.time,
    },
    attributeKey: 'point',
    content: [{
        key: "low",
        attributes: {
            "value": leafLevel.time
        },
        dataKey: 'low',
    }, {
        key: "high",
        attributes: {
            "value": leafLevel.time
        },
        dataKey: 'high',
    }, {
        key: "center",
        attributes: {
            "value": leafLevel.time
        },
        dataKey: 'center',
    }],
    dataKey: 'date_time',
    existsWhen: condition.eitherKeyExists('point', 'low', 'high', 'center')
};

exports.text = function (referenceMethod) {
    return {
        key: "text",
        text: leafLevel.inputProperty("free_text"),
        content: {
            key: "reference",
            attributes: {
                "value": referenceMethod
            },
        }
    };
};

exports.nullFlavor = function (name) {
    return {
        key: name,
        attributes: {
            nullFlavor: "UNK"
        }
    };
};

var usRealmAddress = exports.usRealmAddress = {
    key: "addr",
    attributes: {
        use: leafLevel.use("use")
    },
    content: [{
        key: "country",
        text: leafLevel.inputProperty("country")
    }, {
        key: "state",
        text: leafLevel.inputProperty("state")
    }, {
        key: "city",
        text: leafLevel.inputProperty("city")
    }, {
        key: "postalCode",
        text: leafLevel.inputProperty("zip")
    }, {
        key: "streetAddressLine",
        text: leafLevel.input,
        dataKey: "street_lines"
    }],
    dataKey: "address"
};

var usRealmName = exports.usRealmName = {
    key: "name",
    content: [{
        key: "family",
        text: leafLevel.inputProperty("family")
    }, {
        key: "given",
        text: leafLevel.input,
        dataKey: "given"
    }, {
        key: "prefix",
        text: leafLevel.inputProperty("prefix")
    }, {
        key: "suffix",
        text: leafLevel.inputProperty("suffix")
    }],
    dataKey: "name",
    dataTransform: translate.name
};

var telecom = exports.telecom = {
    key: "telecom",
    attributes: {
        value: leafLevel.inputProperty("value"),
        use: leafLevel.inputProperty("use")
    },
    dataTransform: translate.telecom
};

var representedOrganization = {
    key: "representedOrganization",
    content: [
        id, {
            key: "name",
            text: leafLevel.input,
            dataKey: "name"
        },
        usRealmAddress,
        telecom
    ],
    dataKey: "organization"
};

var assignedEntity = exports.assignedEntity = {
    key: "assignedEntity",
    content: [{
            key: "code",
            attributes: leafLevel.code,
            dataKey: "code"
        },
        id,
        usRealmAddress,
        telecom, {
            key: "assignedPerson",
            content: usRealmName,
            existsWhen: condition.keyExists("name")
        },
        representedOrganization
    ],
    existsWhen: condition.eitherKeyExists("address", "identifiers", "organization", "name")
};

exports.author = {
    key: "author",
    content: [
        [effectiveTime, required, key("time")], {
            key: "assignedAuthor",
            content: [
                id, {
                    key: "assignedPerson",
                    content: usRealmName
                }
            ]
        }
    ],
    dataKey: "author"
};

exports.performer = {
    key: "performer",
    content: [
        [assignedEntity, required]
    ],
    dataKey: "performer"
};

},{"./condition":2,"./contentModifier":3,"./leafLevel":21,"./translate":23,"blue-button-meta":24}],20:[function(require,module,exports){
"use strict";

var fieldLevel = require('./fieldLevel');
var leafLevel = require('./leafLevel');
var condition = require('./condition');
var contentModifier = require("./contentModifier");

var key = contentModifier.key;
var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

var patientName = Object.create(fieldLevel.usRealmName);
patientName.attributes = {
    use: "L"
};

var patient = exports.patient = {
    key: "patient",
    content: [
        patientName, {
            key: "administrativeGenderCode",
            attributes: {
                code: function (input) {
                    return input.substring(0, 1);
                },
                codeSystem: "2.16.840.1.113883.5.1",
                codeSystemName: "HL7 AdministrativeGender",
                displayName: leafLevel.input
            },
            dataKey: "gender"
        },
        [fieldLevel.effectiveTime, key("birthTime"), dataKey("dob")], {
            key: "maritalStatusCode",
            attributes: {
                code: function (input) {
                    return input.substring(0, 1);
                },
                displayName: leafLevel.input,
                codeSystem: "2.16.840.1.113883.5.2",
                codeSystemName: "HL7 Marital Status"
            },
            dataKey: "marital_status"
        }, {
            key: "religiousAffiliationCode",
            attributes: leafLevel.codeFromName("2.16.840.1.113883.5.1076"),
            dataKey: "religion"
        }, {
            key: "ethnicGroupCode",
            attributes: leafLevel.codeFromName("2.16.840.1.113883.6.238"),
            dataKey: "race_ethnicity",
            existsWhen: function (input) {
                return input === "Hispanic or Latino";
            }
        }, {
            key: "raceCode",
            attributes: leafLevel.codeFromName("2.16.840.1.113883.6.238"),
            dataKey: "race_ethnicity",
            existsWhen: function (input) {
                return input !== "Hispanic or Latino";
            }
        }, {
            key: "guardian",
            content: [{
                    key: "code",
                    attributes: leafLevel.codeFromName("2.16.840.1.113883.5.111"),
                    dataKey: "relation"
                },
                [fieldLevel.usRealmAddress, dataKey("addresses")],
                fieldLevel.telecom, {
                    key: "guardianPerson",
                    content: {
                        key: "name",
                        content: [{
                            key: "given",
                            text: leafLevel.inputProperty("first")
                        }, {
                            key: "family",
                            text: leafLevel.inputProperty("last")
                        }],
                        dataKey: "names"
                    }
                }
            ],
            dataKey: "guardians"
        }, {
            key: "birthplace",
            content: {
                key: "place",
                content: [
                    [fieldLevel.usRealmAddress, dataKey("birthplace")]
                ]
            },
            existsWhen: condition.keyExists("birthplace")
        }, {
            key: "languageCommunication",
            content: [{
                key: "languageCode",
                attributes: {
                    code: leafLevel.input
                },
                dataKey: "language"
            }, {
                key: "modeCode",
                attributes: leafLevel.codeFromName("2.16.840.1.113883.5.60"),
                dataKey: "mode"
            }, {
                key: "proficiencyLevelCode",
                attributes: {
                    code: function (input) {
                        return input.substring(0, 1);
                    },
                    displayName: leafLevel.input,
                    codeSystem: "2.16.840.1.113883.5.61",
                    codeSystemName: "LanguageAbilityProficiency"
                },
                dataKey: "proficiency"
            }, {
                key: "preferenceInd",
                attributes: {
                    value: function (input) {
                        return input.toString();
                    }
                },
                dataKey: "preferred"
            }],
            dataKey: "languages"
        }
    ]
};

var recordTarget = exports.recordTarget = {
    key: "recordTarget",
    content: {
        key: "patientRole",
        content: [
            fieldLevel.id, [fieldLevel.usRealmAddress, dataKey("addresses")],
            fieldLevel.telecom,
            patient
        ]
    },
    dataKey: "demographics"
};

},{"./condition":2,"./contentModifier":3,"./fieldLevel":19,"./leafLevel":21}],21:[function(require,module,exports){
"use strict";

var translate = require('./translate');

exports.input = function (input) {
    return input;
};

exports.inputProperty = function (key) {
    return function (input) {
        return input && input[key];
    };
};

exports.boolInputProperty = function (key) {
    return function (input) {
        if (input && input.hasOwnProperty(key)) {
            return input[key].toString();
        } else {
            return null;
        }
    };
};

exports.code = translate.code;

exports.codeFromName = translate.codeFromName;

exports.codeOnlyFromName = function (OID, key) {
    var f = translate.codeFromName(OID);
    return function (input) {
        if (input && input[key]) {
            return f(input[key]).code;
        } else {
            return null;
        }
    };
};

exports.time = translate.time;

exports.use = function (key) {
    return function (input) {
        var value = input && input[key];
        if (value) {
            return translate.acronymize(value);
        } else {
            return null;
        }
    };
};

exports.typeCD = {
    "xsi:type": "CD"
};

exports.typeCE = {
    "xsi:type": "CE"
};

exports.nextReference = function (referenceKey) {
    return function (input, context) {
        return context.nextReference(referenceKey);
    };
};

exports.sameReference = function (referenceKey) {
    return function (input, context) {
        return context.sameReference(referenceKey);
    };
};

},{"./translate":23}],22:[function(require,module,exports){
"use strict";

var fieldLevel = require("./fieldLevel");
var entryLevel = require("./entryLevel");
var contentModifier = require("./contentModifier");

var required = contentModifier.required;

exports.allergiesSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.6"),
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.6.1"),
            fieldLevel.templateCode("AllergiesSection"),
            fieldLevel.templateTitle("AllergiesSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    "typeCode": "DRIV"
                },
                content: [
                    [entryLevel.allergyProblemAct, required]
                ],
                dataKey: "allergies",
                required: true
            }
        ]
    }]
};

exports.medicationsSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.1"),
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.1.1"),
            fieldLevel.templateCode("MedicationsSection"),
            fieldLevel.templateTitle("MedicationsSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    "typeCode": "DRIV"
                },
                content: [
                    [entryLevel.medicationActivity, required]
                ],
                dataKey: "medications",
                required: true
            }
        ]
    }]
};

exports.problemsSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.5"),
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.5.1"),
            fieldLevel.templateCode("ProblemSection"),
            fieldLevel.templateTitle("ProblemSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    "typeCode": "DRIV"
                },
                content: [
                    [entryLevel.problemConcernAct, required]
                ],
                dataKey: "problems",
                required: true
            }
        ]
    }]
};

exports.proceduresSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.7"),
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.7.1"),
            fieldLevel.templateCode("ProceduresSection"),
            fieldLevel.templateTitle("ProceduresSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    "typeCode": function (input) {
                        return input.procedure_type === "procedure" ? "DRIV" : null;
                    }
                },
                content: [
                    entryLevel.procedureActivityAct,
                    entryLevel.procedureActivityProcedure,
                    entryLevel.procedureActivityObservation
                ],
                dataKey: "procedures"
            }
        ]
    }],
    notImplemented: [
        "entry required"
    ]
};

exports.resultsSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.3"),
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.3.1"),
            fieldLevel.templateCode("ResultsSection"),
            fieldLevel.templateTitle("ResultsSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    typeCode: "DRIV"
                },
                content: [
                    [entryLevel.resultOrganizer, required]
                ],
                dataKey: "results",
                required: true
            }
        ]
    }]
};

exports.encountersSectionEntriesOptional = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.22"),
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.22.1"),
            fieldLevel.templateCode("EncountersSection"),
            fieldLevel.templateTitle("EncountersSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    "typeCode": "DRIV"
                },
                content: [
                    [entryLevel.encounterActivities, required]
                ],
                dataKey: "encounters"
            }
        ]
    }]
};

exports.immunizationsSectionEntriesOptional = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.2"),
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.2.1"),
            fieldLevel.templateCode("ImmunizationsSection"),
            fieldLevel.templateTitle("ImmunizationsSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    "typeCode": "DRIV"
                },
                content: [
                    [entryLevel.immunizationActivity, required]
                ],
                dataKey: "immunizations"
            }
        ]
    }]
};

exports.payersSection = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.18"),
            fieldLevel.templateCode("PayersSection"),
            fieldLevel.templateTitle("PayersSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    typeCode: "DRIV"
                },
                content: [
                    [entryLevel.coverageActivity, required]
                ],
                dataKey: "payers"
            }
        ]
    }]
};

exports.planOfCareSection = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.10"),
            fieldLevel.templateCode("PlanOfCareSection"),
            fieldLevel.templateTitle("PlanOfCareSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    "typeCode": function (input) {
                        return input.type === "observation" ? "DRIV" : null;
                    }
                },
                content: [
                    entryLevel.planOfCareActivityAct,
                    entryLevel.planOfCareActivityObservation,
                    entryLevel.planOfCareActivityProcedure,
                    entryLevel.planOfCareActivityEncounter,
                    entryLevel.planOfCareActivitySubstanceAdministration,
                    entryLevel.planOfCareActivitySupply,
                    entryLevel.planOfCareActivityInstructions
                ],
                dataKey: "plan_of_care"
            }
        ]
    }]
};

exports.socialHistorySection = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.17"),
            fieldLevel.templateCode("SocialHistorySection"),
            fieldLevel.templateTitle("SocialHistorySection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    typeCode: "DRIV"
                },
                content: [
                    entryLevel.smokingStatusObservation,
                    entryLevel.socialHistoryObservation
                ],
                dataKey: "social_history"
            }
        ]
    }],
    notImplemented: [
        "pregnancyObservation",
        "tobaccoUse"
    ]
};

exports.vitalSignsSectionEntriesOptional = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.4"),
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.4.1"),
            fieldLevel.templateCode("VitalSignsSection"),
            fieldLevel.templateTitle("VitalSignsSection"), {
                key: "text",
                text: ""
            }, {
                key: "entry",
                attributes: {
                    typeCode: "DRIV"
                },
                content: [
                    [entryLevel.vitalSignsOrganizer, required]
                ],
                dataKey: "vitals"
            }
        ]
    }]
};

},{"./contentModifier":3,"./entryLevel":9,"./fieldLevel":19}],23:[function(require,module,exports){
"use strict";

var bbm = require("blue-button-meta");

var css = bbm.code_systems;

exports.codeFromName = function (OID) {
    return function (input) {
        var cs = css.find(OID);
        var code = cs ? cs.displayNameCode(input) : undefined;
        var systemInfo = cs.systemId(OID);
        return {
            "displayName": input,
            "code": code,
            "codeSystem": systemInfo.codeSystem,
            "codeSystemName": systemInfo.codeSystemName
        };
    };
};

exports.code = function (input) {
    var result = {};
    if (input.code) {
        result.code = input.code;
    }

    if (input.name) {
        result.displayName = input.name;
    }

    var code_system = input.code_system || (input.code_system_name && css.findFromName(input.code_system_name));
    if (code_system) {
        result.codeSystem = code_system;
    }

    if (input.code_system_name) {
        result.codeSystemName = input.code_system_name;
    }

    return result;
};

exports.time = function (input) {
    var timePieces = input.date.split("-");

    // write back the effective time the way it came in
    if (input.precision === "year") {
        timePieces[1] = "";
        timePieces[2] = "";
    } else if (input.precision === "month") {
        timePieces[2] = "";
    } else if (input.precision === "day") { // day precision
        timePieces[2] = timePieces[2].slice(0, 2); // slice off the T00:00:00Z portion of UTC time format
    } else if (input.precision === "hour") { // hour precision
        timePieces[2] = timePieces[2].replace("T", "").split(":").join("").replace("Z", "").slice(0, -4); //YYYYMMDDHH    
    } else if (input.precision === "minute") { // minute precision
        timePieces[2] = timePieces[2].replace("T", "").split(":").join("").replace("Z", "").slice(0, -2); //YYYYMMDDHHMM   
    } else { // second precision
        timePieces[2] = timePieces[2].replace("T", "").split(":").join("").replace("Z", "");
    }
    var result = timePieces[0] + timePieces[1] + timePieces[2];
    return result;
};

var acronymize = exports.acronymize = function (string) {
    var ret = string.split(" ");
    var fL = ret[0].slice(0, 1);
    var lL = ret[1].slice(0, 1);
    fL = fL.toUpperCase();
    lL = lL.toUpperCase();
    ret = fL + lL;
    if (ret === "PH") {
        ret = "HP";
    }
    if (ret === "HA") {
        ret = "H";
    }
    return ret;
};

exports.telecom = function (input) {
    var transformPhones = function (input) {
        var phones = input.phone;
        if (phones) {
            return phones.reduce(function (r, phone) {
                if (phone && phone.number) {
                    var attrs = {
                        value: "tel:" + phone.number
                    };
                    if (phone.type) {
                        attrs.use = acronymize(phone.type);
                    }
                    r.push(attrs);
                }
                return r;
            }, []);
        } else {
            return [];
        }
    };

    var transformEmails = function (input) {
        var emails = input.email;
        if (emails) {
            return emails.reduce(function (r, email) {
                if (email && email.address) {
                    var attrs = {
                        value: "mailto:" + email.address
                    };
                    if (email.type) {
                        attrs.use = acronymize(email.type);
                    }
                    r.push(attrs);
                }
                return r;
            }, []);
        } else {
            return [];
        }
    };

    var result = [].concat(transformPhones(input), transformEmails(input));
    return result.length === 0 ? null : result;
};

var nameSingle = function (input) {
    var given = null;
    if (input.first) {
        given = [input.first];
        if (input.middle && input.middle[0]) {
            given.push(input.middle[0]);
        }
    }
    return {
        prefix: input.prefix,
        given: given,
        family: input.last,
        suffix: input.suffix
    };
};

exports.name = function (input) {
    if (Array.isArray(input)) {
        return input.map(function (e) {
            return nameSingle(e);
        });
    } else {
        return nameSingle(input);
    }
};

},{"blue-button-meta":24}],24:[function(require,module,exports){
var CCDA = require("./lib/CCDA/index.js");

//CCDA metadata stuff
var meta = {};
meta.CCDA = CCDA;

meta.supported_sections = [
    'allergies',
    'procedures',
    'immunizations',
    'medications',
    'encounters',
    'vitals',
    'results',
    'social_history',
    'demographics',
    'problems',
    'insurance',
    'claims',
    'plan_of_care',
    'payers',
    'providers'
];

meta.code_systems = require("./lib/code-systems");

module.exports = exports = meta;

},{"./lib/CCDA/index.js":27,"./lib/code-systems":32}],25:[function(require,module,exports){
var clinicalstatements = {
    "AdmissionMedication": "2.16.840.1.113883.10.20.22.4.36",
    "AdvanceDirectiveObservation": "2.16.840.1.113883.10.20.22.4.48",
    "AgeObservation": "2.16.840.1.113883.10.20.22.4.31",
    "AllergyObservation": "2.16.840.1.113883.10.20.22.4.7",
    "AllergyProblemAct": "2.16.840.1.113883.10.20.22.4.30",
    "AllergyStatusObservation": "2.16.840.1.113883.10.20.22.4.28",
    "AssessmentScaleObservation": "2.16.840.1.113883.10.20.22.4.69",
    "AssessmentScaleSupportingObservation": "2.16.840.1.113883.10.20.22.4.86",
    "AuthorizationActivity": "2.16.840.1.113883.10.20.1.19",
    "BoundaryObservation": "2.16.840.1.113883.10.20.6.2.11",
    "CaregiverCharacteristics": "2.16.840.1.113883.10.20.22.4.72",
    "CodeObservations": "2.16.840.1.113883.10.20.6.2.13",
    "CognitiveStatusProblemObservation": "2.16.840.1.113883.10.20.22.4.73",
    "CognitiveStatusResultObservation": "2.16.840.1.113883.10.20.22.4.74",
    "CognitiveStatusResultOrganizer": "2.16.840.1.113883.10.20.22.4.75",
    "CommentActivity": "2.16.840.1.113883.10.20.22.4.64",
    "CoverageActivity": "2.16.840.1.113883.10.20.22.4.60",
    "DeceasedObservation": "2.16.840.1.113883.10.20.22.4.79",
    "DischargeMedication": "2.16.840.1.113883.10.20.22.4.35",
    "EncounterActivities": "2.16.840.1.113883.10.20.22.4.49",
    "EncounterDiagnosis": "2.16.840.1.113883.10.20.22.4.80",
    "EstimatedDateOfDelivery": "2.16.840.1.113883.10.20.15.3.1",
    "FamilyHistoryDeathObservation": "2.16.840.1.113883.10.20.22.4.47",
    "FamilyHistoryObservation": "2.16.840.1.113883.10.20.22.4.46",
    "FamilyHistoryOrganizer": "2.16.840.1.113883.10.20.22.4.45",
    "FunctionalStatusProblemObservation": "2.16.840.1.113883.10.20.22.4.68",
    "FunctionalStatusResultObservation": "2.16.840.1.113883.10.20.22.4.67",
    "FunctionalStatusResultOrganizer": "2.16.840.1.113883.10.20.22.4.66",
    "HealthStatusObservation": "2.16.840.1.113883.10.20.22.4.5",
    "HighestPressureUlcerStage": "2.16.840.1.113883.10.20.22.4.77",
    "HospitalAdmissionDiagnosis": "2.16.840.1.113883.10.20.22.4.34",
    "HospitalDischargeDiagnosis": "2.16.840.1.113883.10.20.22.4.33",
    "ImmunizationActivity": "2.16.840.1.113883.10.20.22.4.52",
    "ImmunizationRefusalReason": "2.16.840.1.113883.10.20.22.4.53",
    "Indication": "2.16.840.1.113883.10.20.22.4.19",
    "Instructions": "2.16.840.1.113883.10.20.22.4.20",
    "MedicationActivity": "2.16.840.1.113883.10.20.22.4.16",
    "MedicationDispense": "2.16.840.1.113883.10.20.22.4.18",
    "MedicationSupplyOrder": "2.16.840.1.113883.10.20.22.4.17",
    "MedicationUseNoneKnown": "2.16.840.1.113883.10.20.22.4.29",
    "NonMedicinalSupplyActivity": "2.16.840.1.113883.10.20.22.4.50",
    "NumberOfPressureUlcersObservation": "2.16.840.1.113883.10.20.22.4.76",
    "PlanOfCareActivityAct": "2.16.840.1.113883.10.20.22.4.39",
    "PlanOfCareActivityEncounter": "2.16.840.1.113883.10.20.22.4.40",
    "PlanOfCareActivityObservation": "2.16.840.1.113883.10.20.22.4.44",
    "PlanOfCareActivityProcedure": "2.16.840.1.113883.10.20.22.4.41",
    "PlanOfCareActivitySubstanceAdministration": "2.16.840.1.113883.10.20.22.4.42",
    "PlanOfCareActivitySupply": "2.16.840.1.113883.10.20.22.4.43",
    "PolicyActivity": "2.16.840.1.113883.10.20.22.4.61",
    "PostprocedureDiagnosis": "2.16.840.1.113883.10.20.22.4.51",
    "PregnancyObservation": "2.16.840.1.113883.10.20.15.3.8",
    "PreoperativeDiagnosis": "2.16.840.1.113883.10.20.22.4.65",
    "PressureUlcerObservation": "2.16.840.1.113883.10.20.22.4.70",
    "ProblemConcernAct": "2.16.840.1.113883.10.20.22.4.3",
    "ProblemObservation": "2.16.840.1.113883.10.20.22.4.4",
    "ProblemStatus": "2.16.840.1.113883.10.20.22.4.6",
    "ProcedureActivityAct": "2.16.840.1.113883.10.20.22.4.12",
    "ProcedureActivityObservation": "2.16.840.1.113883.10.20.22.4.13",
    "ProcedureActivityProcedure": "2.16.840.1.113883.10.20.22.4.14",
    "ProcedureContext": "2.16.840.1.113883.10.20.6.2.5",
    "PurposeofReferenceObservation": "2.16.840.1.113883.10.20.6.2.9",
    "QuantityMeasurementObservation": "2.16.840.1.113883.10.20.6.2.14",
    "ReactionObservation": "2.16.840.1.113883.10.20.22.4.9",
    "ReferencedFramesObservation": "2.16.840.1.113883.10.20.6.2.10",
    "ResultObservation": "2.16.840.1.113883.10.20.22.4.2",
    "ResultOrganizer": "2.16.840.1.113883.10.20.22.4.1",
    "SeriesAct": "2.16.840.1.113883.10.20.22.4.63",
    "SeverityObservation": "2.16.840.1.113883.10.20.22.4.8",
    "SmokingStatusObservation": "2.16.840.1.113883.10.20.22.4.78",
    "SocialHistoryObservation": "2.16.840.1.113883.10.20.22.4.38",
    "SOPInstanceObservation": "2.16.840.1.113883.10.20.6.2.8",
    "StudyAct": "2.16.840.1.113883.10.20.6.2.6",
    "TextObservation": "2.16.840.1.113883.10.20.6.2.12",
    "TobaccoUse": "2.16.840.1.113883.10.20.22.4.85",
    "VitalSignObservation": "2.16.840.1.113883.10.20.22.4.27",
    "VitalSignsOrganizer": "2.16.840.1.113883.10.20.22.4.26"
};

var clinicalstatements_r1 = {
    "AdvanceDirectiveObservation": "2.16.840.1.113883.10.20.1.17",
    "AlertObservation": "2.16.840.1.113883.10.20.1.18",
    "AuthorizationActivity": "2.16.840.1.113883.10.20.1.19",
    "CoverageActivity": "2.16.840.1.113883.10.20.1.20",
    "EncounterActivity": "2.16.840.1.113883.10.20.1.21",
    "FamilyHistoryObservation": "2.16.840.1.113883.10.20.1.22",
    "FamilyHistoryOrganizer": "2.16.840.1.113883.10.20.1.23",
    "MedicationActivity": "2.16.840.1.113883.10.20.1.24",
    "PlanOfCareActivity": "2.16.840.1.113883.10.20.1.25",
    "PolicyActivity": "2.16.840.1.113883.10.20.1.26",
    "ProblemAct": "2.16.840.1.113883.10.20.1.27",
    "ProblemObservation": "2.16.840.1.113883.10.20.1.28",
    "ProcedureActivity": "2.16.840.1.113883.10.20.1.29",
    "PurposeActivity": "2.16.840.1.113883.10.20.1.30",
    "ResultObservation": "2.16.840.1.113883.10.20.1.31",
    "ResultOrganizer": "2.16.840.1.113883.10.20.1.32",
    "SocialHistoryObservation": "2.16.840.1.113883.10.20.1.33",
    "SupplyActivity": "2.16.840.1.113883.10.20.1.34",
    "VitalSignObservation": "2.16.840.1.113883.10.20.1.31",
    "Indication": "2.16.840.1.113883.10.20.22.4.19",
    "VitalSignsOrganizer": "2.16.840.1.113883.10.20.1.35",
    "AdvanceDirectiveReference": "2.16.840.1.113883.10.20.1.36",
    "AdvanceDirectiveStatusObservation": "2.16.840.1.113883.10.20.1.37",
    "AgeObservation": "2.16.840.1.113883.10.20.1.38",
    "AlertStatusObservation": "2.16.840.1.113883.10.20.1.39",
    "Comment": "2.16.840.1.113883.10.20.1.40",
    "EpisodeObservation": "2.16.840.1.113883.10.20.1.41",
    "FamilyHistoryCauseOfDeathObservation": "2.16.840.1.113883.10.20.1.42",
    "FulfillmentInstruction": "2.16.840.1.113883.10.20.1.43",
    "LocationParticipation": "2.16.840.1.113883.10.20.1.45",
    "MedicationSeriesNumberObservation": "2.16.840.1.113883.10.20.1.46",
    "MedicationStatusObservation": "2.16.840.1.113883.10.20.1.47",
    "PatientAwareness": "2.16.840.1.113883.10.20.1.48",
    "PatientInstruction": "2.16.840.1.113883.10.20.1.49",
    "ProblemHealthstatusObservation": "2.16.840.1.113883.10.20.1.51",
    "ProblemStatusObservation": "2.16.840.1.113883.10.20.1.50",
    "Product": "2.16.840.1.113883.10.20.1.53",
    "ProductInstance": "2.16.840.1.113883.10.20.1.52",
    "ReactionObservation": "2.16.840.1.113883.10.20.1.54",
    "SeverityObservation": "2.16.840.1.113883.10.20.1.55",
    "SocialHistoryStatusObservation": "2.16.840.1.113883.10.20.1.56",
    "StatusObservation": "2.16.840.1.113883.10.20.1.57",
    "StatusOfFunctionalStatusObservation": "2.16.840.1.113883.10.20.1.44",
    "VerificationOfAnAdvanceDirectiveObservation": "2.16.840.1.113883.10.20.1.58"
};

module.exports.clinicalstatements = clinicalstatements;
module.exports.clinicalstatements_r1 = clinicalstatements_r1;

},{}],26:[function(require,module,exports){
var codeSystems = {
    "LOINC": ["2.16.840.1.113883.6.1", "8716-3"],
    "SNOMED CT": ["2.16.840.1.113883.6.96", "46680005"],
    "RXNORM": ["2.16.840.1.113883.6.88"],
    "ActCode": ["2.16.840.1.113883.5.4"],
    "CPT-4": ["2.16.840.1.113883.6.12"],
    "CVX": ["2.16.840.1.113883.12.292"],
    "HL7ActCode": ["2.16.840.1.113883.5.4"],
    "HL7 Role" : ["2.16.840.1.113883.5.111"],
    "HL7 RoleCode" : ["2.16.840.1.113883.5.110"],
    "UNII": ["2.16.840.1.113883.4.9"],
    "Observation Interpretation": ["2.16.840.1.113883.1.11.78"],
    "CPT": ["2.16.840.1.113883.6.12"],
    "HealthcareServiceLocation": ["2.16.840.1.113883.6.259"],
    "HL7 Result Interpretation": ["2.16.840.1.113883.5.83"],
    "Act Reason": ["2.16.840.1.113883.5.8"],
    "Medication Route FDA": ["2.16.840.1.113883.3.26.1.1"],
    "Body Site Value Set": ["2.16.840.1.113883.3.88.12.3221.8.9"],
    "MediSpan DDID": ["2.16.840.1.113883.6.253"],
    "ActPriority": ["2.16.840.1.113883.5.7"],
    "InsuranceType Code": ["2.16.840.1.113883.6.255.1336"],
    "ICD-9-CM": ["2.16.840.1.113883.6.103"]
};

var sections_entries_codes = {
    "codes": {
        "AdvanceDirectivesSectionEntriesOptional": {
            "code": "42348-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Advance Directives"
        },
        "AdvanceDirectivesSection": {
            "code": "42348-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Advance Directives"
        },
        "AllergiesSectionEntriesOptional": {
            "code": "48765-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Allergies, adverse reactions, alerts"
        },
        "AllergiesSection": {
            "code": "48765-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Allergies, adverse reactions, alerts"
        },
        "AnesthesiaSection": {
            "code": "59774-0",
            "code_system": "",
            "code_system_name": "",
            "name": "Anesthesia"
        },
        "AssessmentAndPlanSection": {
            "code": "51847-2",
            "code_system": "",
            "code_system_name": "",
            "name": "Assessment and Plan"
        },
        "AssessmentSection": {
            "code": "51848-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Assessments"
        },
        "ChiefComplaintAndReasonForVisitSection": {
            "code": "46239-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Chief Complaint and Reason for Visit"
        },
        "ChiefComplaintSection": {
            "code": "10154-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Chief Complaint"
        },
        "undefined": "",
        "ComplicationsSection": {
            "code": "55109-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Complications"
        },
        "DICOMObjectCatalogSection": {
            "code": "121181",
            "code_system": "1.2.840.10008.2.16.4",
            "code_system_name": "DCM",
            "name": "Dicom Object Catalog"
        },
        "DischargeDietSection": {
            "code": "42344-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Discharge Diet"
        },
        "EncountersSectionEntriesOptional": {
            "code": "46240-8",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Encounters"
        },
        "EncountersSection": {
            "code": "46240-8",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Encounters"
        },
        "FamilyHistorySection": {
            "code": "10157-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Family History"
        },
        "FindingsSection": "",
        "FunctionalStatusSection": {
            "code": "47420-5",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Functional Status"
        },
        "GeneralStatusSection": {
            "code": "10210-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "General Status"
        },
        "HistoryOfPastIllnessSection": {
            "code": "11348-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "History of Past Illness"
        },
        "HistoryOfPresentIllnessSection": {
            "code": "10164-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "History Of Present Illness Section"
        },
        "HospitalAdmissionDiagnosisSection": {
            "code": "46241-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Hospital Admission Diagnosis"
        },
        "HospitalAdmissionMedicationsSectionEntriesOptional": {
            "code": "42346-7",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Medications on Admission"
        },
        "HospitalConsultationsSection": {
            "code": "18841-7",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Hospital Consultations Section"
        },
        "HospitalCourseSection": {
            "code": "8648-8",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Hospital Course"
        },
        "HospitalDischargeDiagnosisSection": {
            "code": "11535-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Hospital Discharge Diagnosis"
        },
        "HospitalDischargeInstructionsSection": {
            "code": "8653-8",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Hospital Discharge Instructions"
        },
        "HospitalDischargeMedicationsSectionEntriesOptional": {
            "code": "10183-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Hospital Discharge Medications"
        },
        "HospitalDischargePhysicalSection": {
            "code": "10184-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Hospital Discharge Physical"
        },
        "HospitalDischargeStudiesSummarySection": {
            "code": "11493-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Hospital Discharge Studies Summary"
        },
        "ImmunizationsSectionEntriesOptional": {
            "code": "11369-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Immunizations"
        },
        "ImmunizationsSection": {
            "code": "11369-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Immunizations"
        },
        "InstructionsSection": {
            "code": "69730-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Instructions"
        },
        "InterventionsSection": {
            "code": "62387-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Interventions Provided"
        },
        "MedicalHistorySection": {
            "code": "11329-0",
            "code_system": "",
            "code_system_name": "",
            "name": "Medical"
        },
        "MedicalEquipmentSection": {
            "code": "46264-8",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Medical Equipment"
        },
        "MedicationsAdministeredSection": {
            "code": "29549-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Medications Administered"
        },
        "MedicationsSectionEntriesOptional": {
            "code": "10160-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "History of medication use"
        },
        "MedicationsSection": {
            "code": "10160-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "History of medication use"
        },
        "ObjectiveSection": {
            "code": "61149-1",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Objective"
        },
        "OperativeNoteFluidSection": {
            "code": "10216-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Operative Note Fluids"
        },
        "OperativeNoteSurgicalProcedureSection": {
            "code": "10223-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Operative Note Surgical Procedure"
        },
        "PayersSection": {
            "code": "48768-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Payers"
        },
        "PhysicalExamSection": {
            "code": "29545-1",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Physical Findings"
        },
        "PlanOfCareSection": {
            "code": "18776-5",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Plan of Care"
        },
        "PlannedProcedureSection": {
            "code": "59772-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Planned Procedure"
        },
        "PostoperativeDiagnosisSection": {
            "code": "10218-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Postoperative Diagnosis"
        },
        "PostprocedureDiagnosisSection": {
            "code": "59769-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Postprocedure Diagnosis"
        },
        "PreoperativeDiagnosisSection": {
            "code": "10219-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Preoperative Diagnosis"
        },
        "ProblemSectionEntriesOptional": {
            "code": "11450-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Problem List"
        },
        "ProblemSection": {
            "code": "11450-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Problem List"
        },
        "ProcedureDescriptionSection": {
            "code": "29554-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Procedure Description"
        },
        "ProcedureDispositionSection": {
            "code": "59775-7",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Procedure Disposition"
        },
        "ProcedureEstimatedBloodLossSection": {
            "code": "59770-8",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Procedure Estimated Blood Loss"
        },
        "ProcedureFindingsSection": {
            "code": "59776-5",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Procedure Findings"
        },
        "ProcedureImplantsSection": {
            "code": "59771-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Procedure Implants"
        },
        "ProcedureIndicationsSection": {
            "code": "59768-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Procedure Indications"
        },
        "ProcedureSpecimensTakenSection": {
            "code": "59773-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Procedure Specimens Taken"
        },
        "ProceduresSectionEntriesOptional": {
            "code": "47519-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "History of Procedures"
        },
        "ProceduresSection": {
            "code": "47519-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "History of Procedures"
        },
        "ReasonForReferralSection": {
            "code": "42349-1",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Reason for Referral"
        },
        "ReasonForVisitSection": {
            "code": "29299-5",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Reason for Visit"
        },
        "ResultsSectionEntriesOptional": {
            "code": "30954-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Relevant diagnostic tests and/or laboratory data"
        },
        "ResultsSection": {
            "code": "30954-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Relevant diagnostic tests and/or laboratory data"
        },
        "ReviewOfSystemsSection": {
            "code": "10187-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Review of Systems"
        },
        "SocialHistorySection": {
            "code": "29762-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Social History"
        },
        "SubjectiveSection": {
            "code": "61150-9",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Subjective"
        },
        "SurgicalDrainsSection": {
            "code": "11537-8",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Surgical Drains"
        },
        "VitalSignsSectionEntriesOptional": {
            "code": "8716-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Vital Signs"
        },
        "VitalSignsSection": {
            "code": "8716-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Vital Signs"
        },
        "AdmissionMedication": {
            "code": "42346-7",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Medications on Admission"
        },
        "AdvanceDirectiveObservation": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "AgeObservation": {
            "code": "445518008",
            "code_system": "2.16.840.1.113883.6.96",
            "code_system_name": "SNOMED-CT",
            "name": "Age At Onset"
        },
        "AllergyObservation": {
            "code": "ASSERTION",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Assertion"
        },
        "AllergyProblemAct": {
            "code": "48765-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Allergies, adverse reactions, alerts"
        },
        "AllergyStatusObservation": {
            "code": "33999-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Status"
        },
        "AssessmentScaleObservation": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "AssessmentScaleSupportingObservation": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "AuthorizationActivity": "",
        "BoundaryObservation": {
            "code": "113036",
            "code_system": "1.2.840.10008.2.16.4",
            "code_system_name": "DCM",
            "name": "Frames for Display"
        },
        "CaregiverCharacteristics": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "CodeObservations": "",
        "CognitiveStatusProblemObservation": {
            "code": "373930000",
            "code_system": "2.16.840.1.113883.6.96",
            "code_system_name": "SNOMED-CT",
            "name": "Cognitive function finding"
        },
        "CognitiveStatusResultObservation": {
            "code": "373930000",
            "code_system": "2.16.840.1.113883.6.96",
            "code_system_name": "SNOMED-CT",
            "name": "Cognitive function finding"
        },
        "CognitiveStatusResultOrganizer": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "CommentActivity": {
            "code": "48767-8",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Annotation Comment"
        },
        "CoverageActivity": {
            "code": "48768-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Payment sources"
        },
        "DeceasedObservation": {
            "code": "ASSERTION",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Assertion"
        },
        "DischargeMedication": {
            "code": "10183-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Discharge medication"
        },
        "EncounterActivities": "",
        "EncounterDiagnosis": {
            "code": "29308-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Diagnosis"
        },
        "EstimatedDateOfDelivery": {
            "code": "11778-8",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Estimated date of delivery"
        },
        "FamilyHistoryDeathObservation": {
            "code": "ASSERTION",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Assertion"
        },
        "FamilyHistoryObservation": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "FamilyHistoryOrganizer": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "FunctionalStatusProblemObservation": {
            "code": "248536006",
            "code_system": "2.16.840.1.113883.6.96",
            "code_system_name": "SNOMED-CT",
            "name": "finding of functional performance and activity"
        },
        "FunctionalStatusResultObservation": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "FunctionalStatusResultOrganizer": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "HealthStatusObservation": {
            "code": "11323-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Health status"
        },
        "HighestPressureUlcerStage": {
            "code": "420905001",
            "code_system": "2.16.840.1.113883.6.96",
            "code_system_name": "SNOMED-CT",
            "name": "Highest Pressure Ulcer Stage"
        },
        "HospitalAdmissionDiagnosis": {
            "code": "46241-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Admission diagnosis"
        },
        "HospitalDischargeDiagnosis": {
            "code": "11535-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Hospital discharge diagnosis"
        },
        "ImmunizationActivity": "",
        "ImmunizationRefusalReason": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "Indication": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "Instructions": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "MedicationActivity": "",
        "MedicationDispense": "",
        "MedicationSupplyOrder": "",
        "MedicationUseNoneKnown": {
            "code": "ASSERTION",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Assertion"
        },
        "NonMedicinalSupplyActivity": "",
        "NumberOfPressureUlcersObservation": {
            "code": "2264892003",
            "code_system": "",
            "code_system_name": "",
            "name": "number of pressure ulcers"
        },
        "PlanOfCareActivityAct": "",
        "PlanOfCareActivityEncounter": "",
        "PlanOfCareActivityObservation": "",
        "PlanOfCareActivityProcedure": "",
        "PlanOfCareActivitySubstanceAdministration": "",
        "PlanOfCareActivitySupply": "",
        "PolicyActivity": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "PostprocedureDiagnosis": {
            "code": "59769-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Postprocedure diagnosis"
        },
        "PregnancyObservation": {
            "code": "ASSERTION",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Assertion"
        },
        "PreoperativeDiagnosis": {
            "code": "10219-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Preoperative Diagnosis"
        },
        "PressureUlcerObservation": {
            "code": "ASSERTION",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Assertion"
        },
        "ProblemConcernAct": {
            "code": "CONC",
            "code_system": "2.16.840.1.113883.5.6",
            "code_system_name": "HL7ActClass",
            "name": "Concern"
        },
        "ProblemObservation": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "ProblemStatus": {
            "code": "33999-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Status"
        },
        "ProcedureActivityAct": "",
        "ProcedureActivityObservation": "",
        "ProcedureActivityProcedure": "",
        "ProcedureContext": "",
        "PurposeofReferenceObservation": {
            "code": "ASSERTION",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Assertion"
        },
        "QuantityMeasurementObservation": "",
        "ReactionObservation": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "ReferencedFramesObservation": {
            "code": "121190",
            "code_system": "1.2.840.10008.2.16.4",
            "code_system_name": "DCM",
            "name": "Referenced Frames"
        },
        "ResultObservation": "",
        "ResultOrganizer": "",
        "SeriesAct": {
            "code": "113015",
            "code_system": "1.2.840.10008.2.16.4",
            "code_system_name": "DCM",
            "name": "Series Act"
        },
        "SeverityObservation": {
            "code": "SEV",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Severity Observation"
        },
        "SmokingStatusObservation": {
            "code": "ASSERTION",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Assertion"
        },
        "SocialHistoryObservation": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "SOPInstanceObservation": "",
        "StudyAct": {
            "code": "113014",
            "code_system": "1.2.840.10008.2.16.4",
            "code_system_name": "DCM",
            "name": "Study Act"
        },
        "TextObservation": "",
        "TobaccoUse": {
            "code": "ASSERTION",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Assertion"
        },
        "VitalSignObservation": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "VitalSignsOrganizer": {
            "code": "46680005",
            "code_system": "2.16.840.1.113883.6.96",
            "code_system_name": "SNOMED-CT",
            "name": "Vital signs"
        }
    }
};
module.exports.codeSystems = codeSystems;
module.exports.sections_entries_codes = sections_entries_codes;

},{}],27:[function(require,module,exports){
var templates = require("./templates.js");
var sections = require("./sections.js");
var statements = require("./clinicalstatements.js");

var templatesconstraints = require("./templates-constraints.js");
var sectionsconstraints = require("./sections-constraints.js");
var codeSystems = require("./code-systems.js");

//General Header Constraints
var CCDA = {
	"document" : {
		"name": "CCDA",
		"templateId":"2.16.840.1.113883.10.20.22.1.1"
		},
	"templates":templates,
	"sections":sections.sections,
	"sections_r1": sections.sections_r1,
	"statements":statements.clinicalstatements,
	"statements_r1":statements.clinicalstatements_r1,
	"constraints": {
		"sections": sectionsconstraints,
		"templates": templatesconstraints
	},
	"codeSystems": codeSystems.codeSystems,
	"sections_entries_codes": codeSystems.sections_entries_codes

/*
	,
//DOCUMENT-LEVEL TEMPLATES
"templates":[
	{
		"name":"Consultation Note",
		"templateId":"2.16.840.1.113883.10.20.22.1.4"
	},
	{
		"name":"Continuity Of Care Document",
		"templateId":"2.16.840.1.113883.10.20.22.1.2"
	},
	{
		"name":"Diagnostic Imaging Report",
		"templateId":"2.16.840.1.113883.10.20.22.1.5"
	},
	{
		"name":"Discharge Summary",
		"templateId":"2.16.840.1.113883.10.20.22.1.8"
	},
	{
		"name":"History And Physical Note",
		"templateId":"2.16.840.1.113883.10.20.22.1.3"
	},
	{
		"name":"Operative Note",
		"templateId":"2.16.840.1.113883.10.20.22.1.7"
	},
	{
		"name":"Procedure Note",
		"templateId":"2.16.840.1.113883.10.20.22.1.6"
	},
	{
		"name":"Progress Note",
		"templateId":"2.16.840.1.113883.10.20.22.1.9"
	},
	{
		"name":"Unstructured Document",
		"templateId":"2.16.840.1.113883.10.20.21.1.10"
	},
],
//Sections
"sections":[
	{"name": "Allergies",
		"templateIds": ['2.16.840.1.113883.10.20.22.2.6', '2.16.840.1.113883.10.20.22.2.6.1']
	},
	{"name": "Encounters",
		"templateIds": ['2.16.840.1.113883.10.20.22.2.22', '2.16.840.1.113883.10.20.22.2.22.1']
	},
	{"name": "Immunizations",
		"templateIds": ["2.16.840.1.113883.10.20.22.2.2", "2.16.840.1.113883.10.20.22.2.2.1"]
	},
	{"name": "Medications",
		"templateIds": ["2.16.840.1.113883.10.20.22.2.1", "2.16.840.1.113883.10.20.22.2.1.1"]
	},
	{"name": "Problems",
		"templateIds": ["2.16.840.1.113883.10.20.22.2.5.1"]
	},
	{"name": "Procedures",
		"templateIds": ['2.16.840.1.113883.10.20.22.2.7', '2.16.840.1.113883.10.20.22.2.7.1']
	},
	{"name": "Results",
		"templateIds": ['2.16.840.1.113883.10.20.22.2.3', '2.16.840.1.113883.10.20.22.2.3.1']
	},
	{"name": "Vital Signs",
		"templateIds": ["2.16.840.1.113883.10.20.22.2.4","2.16.840.1.113883.10.20.22.2.4.1"]
	},
	{"name": "Social History",
		"templateIds": ["2.16.840.1.113883.10.20.22.2.17"]
	}		
]
*/
};

//Good source http://cdatools.org/SectionMatrix.html
//and http://cdatools.org/ClinicalStatementMatrix.html

module.exports = exports = CCDA;
},{"./clinicalstatements.js":25,"./code-systems.js":26,"./sections-constraints.js":28,"./sections.js":29,"./templates-constraints.js":30,"./templates.js":31}],28:[function(require,module,exports){
var sectionsconstraints = {
    "VitalSignsSection": {
        "full": {
            "VitalSignsOrganizer": {
                "id": [
                    "7276",
                    "7277"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "VitalSignsOrganizer": [
                "7276",
                "7277"
            ]
        }
    },
    "DICOMObjectCatalogSection": {
        "full": {
            "StudyAct": {
                "id": [
                    "8530",
                    "15458"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "StudyAct": [
                "8530",
                "15458"
            ]
        }
    },
    "PayersSection": {
        "full": {
            "CoverageActivity": {
                "id": [
                    "7959",
                    "8905"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "CoverageActivity": [
                "7959",
                "8905"
            ]
        }
    },
    "HospitalDischargeDiagnosisSection": {
        "full": {
            "HospitalDischargeDiagnosis": {
                "id": [
                    "7984"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "HospitalDischargeDiagnosis": [
                "7984"
            ]
        }
    },
    "SocialHistorySection": {
        "may": {
            "TobaccoUse": [
                "16816",
                "16817"
            ],
            "PregnancyObservation": [
                "9133",
                "9132"
            ],
            "SocialHistoryObservation": [
                "7954",
                "7953"
            ]
        },
        "full": {
            "SmokingStatusObservation": {
                "id": [
                    "14824",
                    "14823"
                ],
                "constraint": "should"
            },
            "TobaccoUse": {
                "id": [
                    "16816",
                    "16817"
                ],
                "constraint": "may"
            },
            "PregnancyObservation": {
                "id": [
                    "9133",
                    "9132"
                ],
                "constraint": "may"
            },
            "SocialHistoryObservation": {
                "id": [
                    "7954",
                    "7953"
                ],
                "constraint": "may"
            }
        },
        "should": {
            "SmokingStatusObservation": [
                "14824",
                "14823"
            ]
        }
    },
    "AssessmentAndPlanSection": {
        "may": {
            "PlanOfCareActivityAct": [
                "8798"
            ]
        },
        "full": {
            "PlanOfCareActivityAct": {
                "id": [
                    "8798"
                ],
                "constraint": "may"
            }
        }
    },
    "ResultsSection": {
        "full": {
            "ResultOrganizer": {
                "id": [
                    "7113",
                    "7112"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "ResultOrganizer": [
                "7113",
                "7112"
            ]
        }
    },
    "HospitalAdmissionMedicationsSectionEntriesOptional": {
        "full": {
            "AdmissionMedication": {
                "id": [
                    "10110",
                    "10102"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "AdmissionMedication": [
                "10110",
                "10102"
            ]
        }
    },
    "AllergiesSection": {
        "full": {
            "AllergyProblemAct": {
                "id": [
                    "7531",
                    "7532"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "AllergyProblemAct": [
                "7531",
                "7532"
            ]
        }
    },
    "ComplicationsSection": {
        "may": {
            "ProblemObservation": [
                "8796",
                "8795"
            ]
        },
        "full": {
            "ProblemObservation": {
                "id": [
                    "8796",
                    "8795"
                ],
                "constraint": "may"
            }
        }
    },
    "AdvanceDirectivesSection": {
        "full": {
            "AdvanceDirectiveObservation": {
                "id": [
                    "8801",
                    "8647"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "AdvanceDirectiveObservation": [
                "8801",
                "8647"
            ]
        }
    },
    "MedicationsSectionEntriesOptional": {
        "full": {
            "MedicationActivity": {
                "id": [
                    "7795",
                    "7573"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "MedicationActivity": [
                "7795",
                "7573"
            ]
        }
    },
    "MedicationsAdministeredSection": {
        "may": {
            "MedicationActivity": [
                "8156"
            ]
        },
        "full": {
            "MedicationActivity": {
                "id": [
                    "8156"
                ],
                "constraint": "may"
            }
        }
    },
    "MedicalEquipmentSection": {
        "full": {
            "NonMedicinalSupplyActivity": {
                "id": [
                    "7948.",
                    "8755"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "NonMedicinalSupplyActivity": [
                "7948.",
                "8755"
            ]
        }
    },
    "MedicationsSection": {
        "full": {
            "MedicationActivity": {
                "id": [
                    "7573",
                    "7572"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "MedicationActivity": [
                "7573",
                "7572"
            ]
        }
    },
    "ImmunizationsSection": {
        "full": {
            "ImmunizationActivity": {
                "id": [
                    "9019",
                    "9020"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "ImmunizationActivity": [
                "9019",
                "9020"
            ]
        }
    },
    "AdvanceDirectivesSectionEntriesOptional": {
        "may": {
            "AdvanceDirectiveObservation": [
                "8800",
                "7957"
            ]
        },
        "full": {
            "AdvanceDirectiveObservation": {
                "id": [
                    "8800",
                    "7957"
                ],
                "constraint": "may"
            }
        }
    },
    "ResultsSectionEntriesOptional": {
        "full": {
            "ResultOrganizer": {
                "id": [
                    "7119",
                    "7120"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "ResultOrganizer": [
                "7119",
                "7120"
            ]
        }
    },
    "AnesthesiaSection": {
        "may": {
            "ProcedureActivityProcedure": [
                "8092"
            ],
            "MedicationActivity": [
                "8094"
            ]
        },
        "full": {
            "ProcedureActivityProcedure": {
                "id": [
                    "8092"
                ],
                "constraint": "may"
            },
            "MedicationActivity": {
                "id": [
                    "8094"
                ],
                "constraint": "may"
            }
        }
    },
    "VitalSignsSectionEntriesOptional": {
        "full": {
            "VitalSignsOrganizer": {
                "id": [
                    "7271",
                    "7272"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "VitalSignsOrganizer": [
                "7271",
                "7272"
            ]
        }
    },
    "ImmunizationsSectionEntriesOptional": {
        "full": {
            "ImmunizationActivity": {
                "id": [
                    "7969",
                    "7970"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "ImmunizationActivity": [
                "7969",
                "7970"
            ]
        }
    },
    "FunctionalStatusSection": {
        "may": {
            "PressureUlcerObservation": [
                "16778",
                "16777"
            ],
            "FunctionalStatusProblemObservation": [
                "14422",
                "14423"
            ],
            "CognitiveStatusResultObservation": [
                "14421",
                "14420"
            ],
            "NumberOfPressureUlcersObservation": [
                "16779",
                "16780"
            ],
            "HighestPressureUlcerStage": [
                "16781",
                "16782"
            ],
            "AssessmentScaleObservation": [
                "14581",
                "14580"
            ],
            "FunctionalStatusResultObservation": [
                "14418",
                "14419"
            ],
            "CognitiveStatusProblemObservation": [
                "14425",
                "14424"
            ],
            "FunctionalStatusResultOrganizer": [
                "14414",
                "14415"
            ],
            "CaregiverCharacteristics": [
                "14426",
                "14427"
            ],
            "CognitiveStatusResultOrganizer": [
                "14416",
                "14417"
            ],
            "NonMedicinalSupplyActivity": [
                "14583",
                "14582"
            ]
        },
        "full": {
            "PressureUlcerObservation": {
                "id": [
                    "16778",
                    "16777"
                ],
                "constraint": "may"
            },
            "FunctionalStatusProblemObservation": {
                "id": [
                    "14422",
                    "14423"
                ],
                "constraint": "may"
            },
            "CognitiveStatusResultObservation": {
                "id": [
                    "14421",
                    "14420"
                ],
                "constraint": "may"
            },
            "NumberOfPressureUlcersObservation": {
                "id": [
                    "16779",
                    "16780"
                ],
                "constraint": "may"
            },
            "HighestPressureUlcerStage": {
                "id": [
                    "16781",
                    "16782"
                ],
                "constraint": "may"
            },
            "AssessmentScaleObservation": {
                "id": [
                    "14581",
                    "14580"
                ],
                "constraint": "may"
            },
            "FunctionalStatusResultObservation": {
                "id": [
                    "14418",
                    "14419"
                ],
                "constraint": "may"
            },
            "CognitiveStatusProblemObservation": {
                "id": [
                    "14425",
                    "14424"
                ],
                "constraint": "may"
            },
            "FunctionalStatusResultOrganizer": {
                "id": [
                    "14414",
                    "14415"
                ],
                "constraint": "may"
            },
            "CaregiverCharacteristics": {
                "id": [
                    "14426",
                    "14427"
                ],
                "constraint": "may"
            },
            "CognitiveStatusResultOrganizer": {
                "id": [
                    "14416",
                    "14417"
                ],
                "constraint": "may"
            },
            "NonMedicinalSupplyActivity": {
                "id": [
                    "14583",
                    "14582"
                ],
                "constraint": "may"
            }
        }
    },
    "PreoperativeDiagnosisSection": {
        "full": {
            "PreoperativeDiagnosis": {
                "id": [
                    "10097",
                    "10096"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "PreoperativeDiagnosis": [
                "10097",
                "10096"
            ]
        }
    },
    "HospitalAdmissionDiagnosisSection": {
        "full": {
            "HospitalAdmissionDiagnosis": {
                "id": [
                    "9935",
                    "9934"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "HospitalAdmissionDiagnosis": [
                "9935",
                "9934"
            ]
        }
    },
    "AllergiesSectionEntriesOptional": {
        "full": {
            "AllergyProblemAct": {
                "id": [
                    "7805",
                    "7804"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "AllergyProblemAct": [
                "7805",
                "7804"
            ]
        }
    },
    "PlannedProcedureSection": {
        "may": {
            "PlanOfCareActivityProcedure": [
                "8766",
                "8744"
            ]
        },
        "full": {
            "PlanOfCareActivityProcedure": {
                "id": [
                    "8766",
                    "8744"
                ],
                "constraint": "may"
            }
        }
    },
    "ProblemSection": {
        "full": {
            "ProblemConcernAct": {
                "id": [
                    "9183"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "ProblemConcernAct": [
                "9183"
            ]
        }
    },
    "EncountersSectionEntriesOptional": {
        "full": {
            "EncounterActivities": {
                "id": [
                    "7951",
                    "8802"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "EncounterActivities": [
                "7951",
                "8802"
            ]
        }
    },
    "HospitalDischargeMedicationsSectionEntriesOptional": {
        "full": {
            "DischargeMedication": {
                "id": [
                    "7883"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "DischargeMedication": [
                "7883"
            ]
        }
    },
    "ProcedureFindingsSection": {
        "may": {
            "ProblemObservation": [
                "8090",
                "8091"
            ]
        },
        "full": {
            "ProblemObservation": {
                "id": [
                    "8090",
                    "8091"
                ],
                "constraint": "may"
            }
        }
    },
    "PlanOfCareSection": {
        "may": {
            "PlanOfCareActivityAct": [
                "7726.",
                "8804"
            ],
            "PlanOfCareActivityProcedure": [
                "8810",
                "8809"
            ],
            "PlanOfCareActivitySubstanceAdministration": [
                "8811",
                "8812"
            ],
            "PlanOfCareActivitySupply": [
                "14756",
                "8813"
            ],
            "PlanOfCareActivityEncounter": [
                "8806",
                "8805"
            ],
            "PlanOfCareActivityObservation": [
                "8808",
                "8807"
            ],
            "Instructions": [
                "14695",
                "16751"
            ]
        },
        "full": {
            "PlanOfCareActivityAct": {
                "id": [
                    "7726.",
                    "8804"
                ],
                "constraint": "may"
            },
            "PlanOfCareActivityProcedure": {
                "id": [
                    "8810",
                    "8809"
                ],
                "constraint": "may"
            },
            "PlanOfCareActivitySubstanceAdministration": {
                "id": [
                    "8811",
                    "8812"
                ],
                "constraint": "may"
            },
            "PlanOfCareActivitySupply": {
                "id": [
                    "14756",
                    "8813"
                ],
                "constraint": "may"
            },
            "PlanOfCareActivityEncounter": {
                "id": [
                    "8806",
                    "8805"
                ],
                "constraint": "may"
            },
            "PlanOfCareActivityObservation": {
                "id": [
                    "8808",
                    "8807"
                ],
                "constraint": "may"
            },
            "Instructions": {
                "id": [
                    "14695",
                    "16751"
                ],
                "constraint": "may"
            }
        }
    },
    "InstructionsSection": {
        "full": {
            "Instructions": {
                "id": [
                    "10116",
                    "10117"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "Instructions": [
                "10116",
                "10117"
            ]
        }
    },
    "ProceduresSection": {
        "may": {
            "ProcedureActivityProcedure": [
                "7896",
                "7895"
            ],
            "ProcedureActivityAct": [
                "8020",
                "8019"
            ],
            "ProcedureActivityObservation": [
                "8018",
                "8017"
            ]
        },
        "full": {
            "ProcedureActivityProcedure": {
                "id": [
                    "7896",
                    "7895"
                ],
                "constraint": "may"
            },
            "ProcedureActivityAct": {
                "id": [
                    "8020",
                    "8019"
                ],
                "constraint": "may"
            },
            "ProcedureActivityObservation": {
                "id": [
                    "8018",
                    "8017"
                ],
                "constraint": "may"
            }
        }
    },
    "HospitalDischargeMedicationsSection": {
        "full": {
            "DischargeMedication": {
                "id": [
                    "7827"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "DischargeMedication": [
                "7827"
            ]
        }
    },
    "PostprocedureDiagnosisSection": {
        "full": {
            "PostprocedureDiagnosis": {
                "id": [
                    "8762",
                    "8764"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "PostprocedureDiagnosis": [
                "8762",
                "8764"
            ]
        }
    },
    "HistoryOfPastIllnessSection": {
        "may": {
            "ProblemObservation": [
                "8792"
            ]
        },
        "full": {
            "ProblemObservation": {
                "id": [
                    "8792"
                ],
                "constraint": "may"
            }
        }
    },
    "ProblemSectionEntriesOptional": {
        "full": {
            "ProblemConcernAct": {
                "id": [
                    "7882"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "ProblemConcernAct": [
                "7882"
            ]
        }
    },
    "FamilyHistorySection": {
        "may": {
            "FamilyHistoryOrganizer": [
                "7955"
            ]
        },
        "full": {
            "FamilyHistoryOrganizer": {
                "id": [
                    "7955"
                ],
                "constraint": "may"
            }
        }
    },
    "ProcedureIndicationsSection": {
        "may": {
            "Indication": [
                "8765",
                "8743"
            ]
        },
        "full": {
            "Indication": {
                "id": [
                    "8765",
                    "8743"
                ],
                "constraint": "may"
            }
        }
    },
    "ProceduresSectionEntriesOptional": {
        "may": {
            "ProcedureActivityProcedure": [
                "15509",
                "6274"
            ],
            "ProcedureActivityAct": [
                "8533",
                "15511"
            ],
            "ProcedureActivityObservation": [
                "6278",
                "15510"
            ]
        },
        "full": {
            "ProcedureActivityProcedure": {
                "id": [
                    "15509",
                    "6274"
                ],
                "constraint": "may"
            },
            "ProcedureActivityAct": {
                "id": [
                    "8533",
                    "15511"
                ],
                "constraint": "may"
            },
            "ProcedureActivityObservation": {
                "id": [
                    "6278",
                    "15510"
                ],
                "constraint": "may"
            }
        }
    },
    "PhysicalExamSection": {
        "may": {
            "PressureUlcerObservation": [
                "17094",
                "17095"
            ],
            "NumberOfPressureUlcersObservation": [
                "17096",
                "17097"
            ],
            "HighestPressureUlcerStage": [
                "17098",
                "17099"
            ]
        },
        "full": {
            "PressureUlcerObservation": {
                "id": [
                    "17094",
                    "17095"
                ],
                "constraint": "may"
            },
            "NumberOfPressureUlcersObservation": {
                "id": [
                    "17096",
                    "17097"
                ],
                "constraint": "may"
            },
            "HighestPressureUlcerStage": {
                "id": [
                    "17098",
                    "17099"
                ],
                "constraint": "may"
            }
        }
    },
    "EncountersSection": {
        "full": {
            "EncounterActivities": {
                "id": [
                    "8709",
                    "8803"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "EncounterActivities": [
                "8709",
                "8803"
            ]
        }
    }
};

module.exports = exports = sectionsconstraints;


},{}],29:[function(require,module,exports){
var sections = {
    "AdvanceDirectivesSection": "2.16.840.1.113883.10.20.22.2.21.1",
    "AdvanceDirectivesSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.21",
    "AllergiesSection": "2.16.840.1.113883.10.20.22.2.6.1",
    "AllergiesSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.6",
    "AnesthesiaSection": "2.16.840.1.113883.10.20.22.2.25",
    "AssessmentAndPlanSection": "2.16.840.1.113883.10.20.22.2.9",
    "AssessmentSection": "2.16.840.1.113883.10.20.22.2.8",
    "ChiefComplaintAndReasonForVisitSection": "2.16.840.1.113883.10.20.22.2.13",
    "ChiefComplaintSection": "1.3.6.1.4.1.19376.1.5.3.1.1.13.2.1",
    "ComplicationsSection": "2.16.840.1.113883.10.20.22.2.37",
    "DICOMObjectCatalogSection": "2.16.840.1.113883.10.20.6.1.1",
    "DischargeDietSection": "1.3.6.1.4.1.19376.1.5.3.1.3.33",
    "EncountersSection": "2.16.840.1.113883.10.20.22.2.22.1",
    "EncountersSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.22",
    "FamilyHistorySection": "2.16.840.1.113883.10.20.22.2.15",
    "FindingsSection": "2.16.840.1.113883.10.20.6.1.2",
    "FunctionalStatusSection": "2.16.840.1.113883.10.20.22.2.14",
    "GeneralStatusSection": "2.16.840.1.113883.10.20.2.5",
    "HistoryOfPastIllnessSection": "2.16.840.1.113883.10.20.22.2.20",
    "HistoryOfPresentIllnessSection": "1.3.6.1.4.1.19376.1.5.3.1.3.4",
    "HospitalAdmissionDiagnosisSection": "2.16.840.1.113883.10.20.22.2.43",
    "HospitalAdmissionMedicationsSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.44",
    "HospitalConsultationsSection": "2.16.840.1.113883.10.20.22.2.42",
    "HospitalCourseSection": "1.3.6.1.4.1.19376.1.5.3.1.3.5",
    "HospitalDischargeDiagnosisSection": "2.16.840.1.113883.10.20.22.2.24",
    "HospitalDischargeInstructionsSection": "2.16.840.1.113883.10.20.22.2.41",
    "HospitalDischargeMedicationsSection": "2.16.840.1.113883.10.20.22.2.11.1",
    "HospitalDischargeMedicationsSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.11",
    "HospitalDischargePhysicalSection": "1.3.6.1.4.1.19376.1.5.3.1.3.26",
    "HospitalDischargeStudiesSummarySection": "2.16.840.1.113883.10.20.22.2.16",
    "ImmunizationsSection": "2.16.840.1.113883.10.20.22.2.2.1",
    "ImmunizationsSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.2",
    "InstructionsSection": "2.16.840.1.113883.10.20.22.2.45",
    "InterventionsSection": "2.16.840.1.113883.10.20.21.2.3",
    "MedicalEquipmentSection": "2.16.840.1.113883.10.20.22.2.23",
    "MedicalHistorySection": "2.16.840.1.113883.10.20.22.2.39",
    "MedicationsAdministeredSection": "2.16.840.1.113883.10.20.22.2.38",
    "MedicationsSection": "2.16.840.1.113883.10.20.22.2.1.1",
    "MedicationsSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.1",
    "ObjectiveSection": "2.16.840.1.113883.10.20.21.2.1",
    "OperativeNoteFluidSection": "2.16.840.1.113883.10.20.7.12",
    "OperativeNoteSurgicalProcedureSection": "2.16.840.1.113883.10.20.7.14",
    "PayersSection": "2.16.840.1.113883.10.20.22.2.18",
    "PhysicalExamSection": "2.16.840.1.113883.10.20.2.10",
    "PlannedProcedureSection": "2.16.840.1.113883.10.20.22.2.30",
    "PlanOfCareSection": "2.16.840.1.113883.10.20.22.2.10",
    "PostoperativeDiagnosisSection": "2.16.840.1.113883.10.20.22.2.35",
    "PostprocedureDiagnosisSection": "2.16.840.1.113883.10.20.22.2.36",
    "PreoperativeDiagnosisSection": "2.16.840.1.113883.10.20.22.2.34",
    "ProblemSection": "2.16.840.1.113883.10.20.22.2.5.1",
    "ProblemSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.5",
    "ProcedureDescriptionSection": "2.16.840.1.113883.10.20.22.2.27",
    "ProcedureDispositionSection": "2.16.840.1.113883.10.20.18.2.12",
    "ProcedureEstimatedBloodLossSection": "2.16.840.1.113883.10.20.18.2.9",
    "ProcedureFindingsSection": "2.16.840.1.113883.10.20.22.2.28",
    "ProcedureImplantsSection": "2.16.840.1.113883.10.20.22.2.40",
    "ProcedureIndicationsSection": "2.16.840.1.113883.10.20.22.2.29",
    "ProcedureSpecimensTakenSection": "2.16.840.1.113883.10.20.22.2.31",
    "ProceduresSection": "2.16.840.1.113883.10.20.22.2.7.1",
    "ProceduresSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.7",
    "ReasonForReferralSection": "1.3.6.1.4.1.19376.1.5.3.1.3.1",
    "ReasonForVisitSection": "2.16.840.1.113883.10.20.22.2.12",
    "ResultsSection": "2.16.840.1.113883.10.20.22.2.3.1",
    "ResultsSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.3",
    "ReviewOfSystemsSection": "1.3.6.1.4.1.19376.1.5.3.1.3.18",
    "SocialHistorySection": "2.16.840.1.113883.10.20.22.2.17",
    "SubjectiveSection": "2.16.840.1.113883.10.20.21.2.2",
    "SurgicalDrainsSection": "2.16.840.1.113883.10.20.7.13",
    "VitalSignsSection": "2.16.840.1.113883.10.20.22.2.4.1",
    "VitalSignsSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.4"
};

var sections_r1 = {
    "AdvanceDirectivesSection":"2.16.840.1.113883.10.20.1.1",
    "AlertsSection":"2.16.840.1.113883.10.20.1.2",
    "EncountersSection":"2.16.840.1.113883.10.20.1.3",
    "FamilyHistorySection":"2.16.840.1.113883.10.20.1.4",
    "FunctionalStatusSection":"2.16.840.1.113883.10.20.1.5",
    "ImmunizationsSection":"2.16.840.1.113883.10.20.1.6",
    "MedicalEquipmentSection":"2.16.840.1.113883.10.20.1.7",
    "MedicationsSection":"2.16.840.1.113883.10.20.1.8",
    "PayersSection":"2.16.840.1.113883.10.20.1.9",
    "PlanOfCareSection":"2.16.840.1.113883.10.20.1.10",
    "ProblemSection":"2.16.840.1.113883.10.20.1.11",
    "ProceduresSection":"2.16.840.1.113883.10.20.1.12",
    "PurposeSection":"2.16.840.1.113883.10.20.1.13",
    "ResultsSection":"2.16.840.1.113883.10.20.1.14",
    "SocialHistorySection":"2.16.840.1.113883.10.20.1.15",
    "VitalSignsSection":"2.16.840.1.113883.10.20.1.16"
};

module.exports.sections = sections;
module.exports.sections_r1 = sections_r1;

},{}],30:[function(require,module,exports){
var templatesconstraints = {
    "ContinuityOfCareDocument": {
        "may": {
            "AdvanceDirectivesSection": "9455",
            "PayersSection": "9468",
            "SocialHistorySection": "9472",
            "ImmunizationsSectionEntriesOptional": "9463",
            "MedicalEquipmentSection": "9466",
            "FamilyHistorySection": "9459",
            "PlanOfCareSection": "9470",
            "FunctionalStatusSection": "9461",
            "VitalSignsSectionEntriesOptional": "9474",
            "EncountersSection": "9457"
        },
        "full": {
            "AdvanceDirectivesSection": {
                "id": "9455",
                "constraint": "may"
            },
            "PayersSection": {
                "id": "9468",
                "constraint": "may"
            },
            "MedicationsSection": {
                "id": "9447",
                "constraint": "shall"
            },
            "ProblemSection": {
                "id": "9449",
                "constraint": "shall"
            },
            "ImmunizationsSectionEntriesOptional": {
                "id": "9463",
                "constraint": "may"
            },
            "SocialHistorySection": {
                "id": "9472",
                "constraint": "may"
            },
            "MedicalEquipmentSection": {
                "id": "9466",
                "constraint": "may"
            },
            "FamilyHistorySection": {
                "id": "9459",
                "constraint": "may"
            },
            "ProceduresSection": {
                "id": "9451",
                "constraint": "shall"
            },
            "PlanOfCareSection": {
                "id": "9470",
                "constraint": "may"
            },
            "FunctionalStatusSection": {
                "id": "9461",
                "constraint": "may"
            },
            "VitalSignsSectionEntriesOptional": {
                "id": "9474",
                "constraint": "may"
            },
            "AllergiesSection": {
                "id": "9445",
                "constraint": "shall"
            },
            "EncountersSection": {
                "id": "9457",
                "constraint": "may"
            },
            "ResultsSection": {
                "id": "9453",
                "constraint": "shall"
            }
        },
        "shall": {
            "ProblemSection": "9449",
            "ResultsSection": "9453",
            "AllergiesSection": "9445",
            "ProceduresSection": "9451",
            "MedicationsSection": "9447"
        }
    },
    "HistoryAndPhysicalNote": {
        "may": {
            "ChiefComplaintSection": "9611",
            "ImmunizationsSectionEntriesOptional": "9637",
            "ProblemSectionEntriesOptional": "9639",
            "ReasonForVisitSection": "9627",
            "ProceduresSectionEntriesOptional": "9641",
            "AssessmentAndPlanSection": "9987",
            "ChiefComplaintAndReasonForVisitSection": "9613",
            "PlanOfCareSection": "9607",
            "InstructionsSection": "16807",
            "AssessmentSection": "9605"
        },
        "should": {
            "HistoryOfPresentIllnessSection": "9621"
        },
        "full": {
            "ChiefComplaintSection": {
                "id": "9611",
                "constraint": "may"
            },
            "ProblemSectionEntriesOptional": {
                "id": "9639",
                "constraint": "may"
            },
            "AllergiesSectionEntriesOptional": {
                "id": "9602",
                "constraint": "shall"
            },
            "FamilyHistorySection": {
                "id": "9615",
                "constraint": "shall"
            },
            "ResultsSectionEntriesOptional": {
                "id": "9629",
                "constraint": "shall"
            },
            "HistoryOfPastIllnessSection": {
                "id": "9619",
                "constraint": "shall"
            },
            "SocialHistorySection": {
                "id": "9633",
                "constraint": "shall"
            },
            "PlanOfCareSection": {
                "id": "9607",
                "constraint": "may"
            },
            "MedicationsSectionEntriesOptional": {
                "id": "9623",
                "constraint": "shall"
            },
            "ReasonForVisitSection": {
                "id": "9627",
                "constraint": "may"
            },
            "ProceduresSectionEntriesOptional": {
                "id": "9641",
                "constraint": "may"
            },
            "AssessmentAndPlanSection": {
                "id": "9987",
                "constraint": "may"
            },
            "GeneralStatusSection": {
                "id": "9617",
                "constraint": "shall"
            },
            "ChiefComplaintAndReasonForVisitSection": {
                "id": "9613",
                "constraint": "may"
            },
            "ImmunizationsSectionEntriesOptional": {
                "id": "9637",
                "constraint": "may"
            },
            "ReviewOfSystemsSection": {
                "id": "9631",
                "constraint": "shall"
            },
            "InstructionsSection": {
                "id": "16807",
                "constraint": "may"
            },
            "PhysicalExamSection": {
                "id": "9625",
                "constraint": "shall"
            },
            "VitalSignsSectionEntriesOptional": {
                "id": "9635",
                "constraint": "shall"
            },
            "AssessmentSection": {
                "id": "9605",
                "constraint": "may"
            },
            "HistoryOfPresentIllnessSection": {
                "id": "9621",
                "constraint": "should"
            }
        },
        "shall": {
            "MedicationsSectionEntriesOptional": "9623",
            "AllergiesSectionEntriesOptional": "9602",
            "ResultsSectionEntriesOptional": "9629",
            "HistoryOfPastIllnessSection": "9619",
            "VitalSignsSectionEntriesOptional": "9635",
            "FamilyHistorySection": "9615",
            "GeneralStatusSection": "9617",
            "ReviewOfSystemsSection": "9631",
            "PhysicalExamSection": "9625",
            "SocialHistorySection": "9633"
        }
    },
    "DischargeSummary": {
        "may": {
            "VitalSignsSectionEntriesOptional": "9584",
            "ChiefComplaintSection": "9554",
            "HospitalDischargePhysicalSection": "9568",
            "HospitalConsultationsSection": "9924",
            "SocialHistorySection": "9582",
            "HistoryOfPastIllnessSection": "9564",
            "HospitalDischargeInstructionsSection": "9926",
            "ProblemSectionEntriesOptional": "9574",
            "HospitalDischargeStudiesSummarySection": "9570",
            "ProceduresSectionEntriesOptional": "9576",
            "FamilyHistorySection": "9560",
            "ReasonForVisitSection": "9578",
            "ChiefComplaintAndReasonForVisitSection": "9556",
            "ImmunizationsSectionEntriesOptional": "9572",
            "FunctionalStatusSection": "9562",
            "HospitalAdmissionMedicationsSectionEntriesOptional": "10111",
            "HistoryOfPresentIllnessSection": "9566",
            "ReviewOfSystemsSection": "9580",
            "DischargeDietSection": "9558"
        },
        "full": {
            "HospitalDischargeDiagnosisSection": {
                "id": "9546",
                "constraint": "shall"
            },
            "SocialHistorySection": {
                "id": "9582",
                "constraint": "may"
            },
            "HospitalDischargeStudiesSummarySection": {
                "id": "9570",
                "constraint": "may"
            },
            "ChiefComplaintAndReasonForVisitSection": {
                "id": "9556",
                "constraint": "may"
            },
            "HospitalAdmissionMedicationsSectionEntriesOptional": {
                "id": "10111",
                "constraint": "may"
            },
            "HistoryOfPresentIllnessSection": {
                "id": "9566",
                "constraint": "may"
            },
            "HospitalConsultationsSection": {
                "id": "9924",
                "constraint": "may"
            },
            "FunctionalStatusSection": {
                "id": "9562",
                "constraint": "may"
            },
            "DischargeDietSection": {
                "id": "9558",
                "constraint": "may"
            },
            "HospitalAdmissionDiagnosisSection": {
                "id": "9928",
                "constraint": "shall"
            },
            "AllergiesSectionEntriesOptional": {
                "id": "9542",
                "constraint": "shall"
            },
            "HospitalDischargePhysicalSection": {
                "id": "9568",
                "constraint": "may"
            },
            "ImmunizationsSectionEntriesOptional": {
                "id": "9572",
                "constraint": "may"
            },
            "ReasonForVisitSection": {
                "id": "9578",
                "constraint": "may"
            },
            "HospitalDischargeMedicationsSectionEntriesOptional": {
                "id": "9548",
                "constraint": "shall"
            },
            "PlanOfCareSection": {
                "id": "9550",
                "constraint": "shall"
            },
            "VitalSignsSectionEntriesOptional": {
                "id": "9584",
                "constraint": "may"
            },
            "HospitalCourseSection": {
                "id": "9544",
                "constraint": "shall"
            },
            "ChiefComplaintSection": {
                "id": "9554",
                "constraint": "may"
            },
            "ProceduresSectionEntriesOptional": {
                "id": "9576",
                "constraint": "may"
            },
            "HospitalDischargeInstructionsSection": {
                "id": "9926",
                "constraint": "may"
            },
            "ProblemSectionEntriesOptional": {
                "id": "9574",
                "constraint": "may"
            },
            "FamilyHistorySection": {
                "id": "9560",
                "constraint": "may"
            },
            "HistoryOfPastIllnessSection": {
                "id": "9564",
                "constraint": "may"
            },
            "ReviewOfSystemsSection": {
                "id": "9580",
                "constraint": "may"
            }
        },
        "shall": {
            "HospitalAdmissionDiagnosisSection": "9928",
            "AllergiesSectionEntriesOptional": "9542",
            "HospitalDischargeDiagnosisSection": "9546",
            "HospitalDischargeMedicationsSectionEntriesOptional": "9548",
            "PlanOfCareSection": "9550",
            "HospitalCourseSection": "9544"
        }
    },
    "OperativeNote": {
        "may": {
            "PlannedProcedureSection": "9906",
            "OperativeNoteFluidSection": "9900",
            "OperativeNoteSurgicalProcedureSection": "9902",
            "SurgicalDrainsSection": "9912",
            "ProcedureDispositionSection": "9908",
            "ProcedureImplantsSection": "9898",
            "ProcedureIndicationsSection": "9910",
            "PlanOfCareSection": "9904"
        },
        "full": {
            "ProcedureSpecimensTakenSection": {
                "id": "9894",
                "constraint": "shall"
            },
            "PlannedProcedureSection": {
                "id": "9906",
                "constraint": "may"
            },
            "OperativeNoteFluidSection": {
                "id": "9900",
                "constraint": "may"
            },
            "OperativeNoteSurgicalProcedureSection": {
                "id": "9902",
                "constraint": "may"
            },
            "ProcedureIndicationsSection": {
                "id": "9910",
                "constraint": "may"
            },
            "SurgicalDrainsSection": {
                "id": "9912",
                "constraint": "may"
            },
            "PostoperativeDiagnosisSection": {
                "id": "9913",
                "constraint": "shall"
            },
            "ProcedureDispositionSection": {
                "id": "9908",
                "constraint": "may"
            },
            "ProcedureEstimatedBloodLossSection": {
                "id": "9890",
                "constraint": "shall"
            },
            "ProcedureImplantsSection": {
                "id": "9898",
                "constraint": "may"
            },
            "ProcedureDescriptionSection": {
                "id": "9896",
                "constraint": "shall"
            },
            "AnesthesiaSection": {
                "id": "9883",
                "constraint": "shall"
            },
            "ProcedureFindingsSection": {
                "id": "9892",
                "constraint": "shall"
            },
            "PlanOfCareSection": {
                "id": "9904",
                "constraint": "may"
            },
            "PreoperativeDiagnosisSection": {
                "id": "9888",
                "constraint": "shall"
            },
            "ComplicationsSection": {
                "id": "9885",
                "constraint": "shall"
            }
        },
        "shall": {
            "ProcedureSpecimensTakenSection": "9894",
            "ProcedureEstimatedBloodLossSection": "9890",
            "PostoperativeDiagnosisSection": "9913",
            "ProcedureDescriptionSection": "9896",
            "AnesthesiaSection": "9883",
            "ProcedureFindingsSection": "9892",
            "PreoperativeDiagnosisSection": "9888",
            "ComplicationsSection": "9885"
        }
    },
    "ProcedureNote": {
        "may": {
            "SocialHistorySection": "9849",
            "ProcedureDispositionSection": "9833",
            "AssessmentAndPlanSection": "9649",
            "ChiefComplaintAndReasonForVisitSection": "9815",
            "HistoryOfPresentIllnessSection": "9821",
            "ProcedureSpecimensTakenSection": "9841",
            "PlannedProcedureSection": "9831",
            "MedicationsSectionEntriesOptional": "9825",
            "MedicationsAdministeredSection": "9827",
            "ProcedureImplantsSection": "9839",
            "AnesthesiaSection": "9811",
            "MedicalHistorySection": "9823",
            "AllergiesSectionEntriesOptional": "9809",
            "ReasonForVisitSection": "9845",
            "ProcedureFindingsSection": "9837",
            "PlanOfCareSection": "9647",
            "ChiefComplaintSection": "9813",
            "ProcedureEstimatedBloodLossSection": "9835",
            "HistoryOfPastIllnessSection": "9819",
            "FamilyHistorySection": "9817",
            "ProceduresSectionEntriesOptional": "9843",
            "ReviewOfSystemsSection": "9847",
            "PhysicalExamSection": "9829",
            "AssessmentSection": "9645"
        },
        "full": {
            "SocialHistorySection": {
                "id": "9849",
                "constraint": "may"
            },
            "ProcedureDispositionSection": {
                "id": "9833",
                "constraint": "may"
            },
            "AssessmentAndPlanSection": {
                "id": "9649",
                "constraint": "may"
            },
            "ChiefComplaintAndReasonForVisitSection": {
                "id": "9815",
                "constraint": "may"
            },
            "ComplicationsSection": {
                "id": "9802",
                "constraint": "shall"
            },
            "HistoryOfPresentIllnessSection": {
                "id": "9821",
                "constraint": "may"
            },
            "ProcedureSpecimensTakenSection": {
                "id": "9841",
                "constraint": "may"
            },
            "PlannedProcedureSection": {
                "id": "9831",
                "constraint": "may"
            },
            "MedicationsSectionEntriesOptional": {
                "id": "9825",
                "constraint": "may"
            },
            "MedicationsAdministeredSection": {
                "id": "9827",
                "constraint": "may"
            },
            "ProcedureImplantsSection": {
                "id": "9839",
                "constraint": "may"
            },
            "ProcedureDescriptionSection": {
                "id": "9805",
                "constraint": "shall"
            },
            "AnesthesiaSection": {
                "id": "9811",
                "constraint": "may"
            },
            "MedicalHistorySection": {
                "id": "9823",
                "constraint": "may"
            },
            "AllergiesSectionEntriesOptional": {
                "id": "9809",
                "constraint": "may"
            },
            "ReasonForVisitSection": {
                "id": "9845",
                "constraint": "may"
            },
            "ProcedureFindingsSection": {
                "id": "9837",
                "constraint": "may"
            },
            "PlanOfCareSection": {
                "id": "9647",
                "constraint": "may"
            },
            "ChiefComplaintSection": {
                "id": "9813",
                "constraint": "may"
            },
            "ProcedureEstimatedBloodLossSection": {
                "id": "9835",
                "constraint": "may"
            },
            "PostprocedureDiagnosisSection": {
                "id": "9850",
                "constraint": "shall"
            },
            "HistoryOfPastIllnessSection": {
                "id": "9819",
                "constraint": "may"
            },
            "FamilyHistorySection": {
                "id": "9817",
                "constraint": "may"
            },
            "ProcedureIndicationsSection": {
                "id": "9807",
                "constraint": "shall"
            },
            "ProceduresSectionEntriesOptional": {
                "id": "9843",
                "constraint": "may"
            },
            "ReviewOfSystemsSection": {
                "id": "9847",
                "constraint": "may"
            },
            "PhysicalExamSection": {
                "id": "9829",
                "constraint": "may"
            },
            "AssessmentSection": {
                "id": "9645",
                "constraint": "may"
            }
        },
        "shall": {
            "ProcedureDescriptionSection": "9805",
            "PostprocedureDiagnosisSection": "9850",
            "ProcedureIndicationsSection": "9807",
            "ComplicationsSection": "9802"
        }
    },
    "DiagnosticImagingReport": {
        "full": {
            "FindingsSection": {
                "id": "8776",
                "constraint": "shall"
            },
            "DICOMObjectCatalogSection": {
                "id": "15141",
                "constraint": "should"
            }
        },
        "shall": {
            "FindingsSection": "8776"
        },
        "should": {
            "DICOMObjectCatalogSection": "15141"
        }
    },
    "ConsultationNote": {
        "may": {
            "ChiefComplaintSection": "9509",
            "AllergiesSectionEntriesOptional": "9507",
            "FamilyHistorySection": "9513",
            "ResultsSectionEntriesOptional": "9527",
            "HistoryOfPastIllnessSection": "9517",
            "SocialHistorySection": "9531",
            "ProblemSectionEntriesOptional": "9523",
            "MedicationsSectionEntriesOptional": "9521)",
            "ImmunizationsSection": "9519",
            "ProceduresSectionEntriesOptional": "9525",
            "AssessmentAndPlanSection": "9491",
            "GeneralStatusSection": "9515",
            "ReasonForVisitSection": "9500",
            "ChiefComplaintAndReasonForVisitSection": "10029",
            "PlanOfCareSection": "9489",
            "ReviewOfSystemsSection": "9529",
            "ReasonForReferralSection": "9498",
            "VitalSignsSectionEntriesOptional": "9533",
            "AssessmentSection": "9487"
        },
        "should": {
            "PhysicalExamSection": "9495"
        },
        "full": {
            "ChiefComplaintSection": {
                "id": "9509",
                "constraint": "may"
            },
            "AllergiesSectionEntriesOptional": {
                "id": "9507",
                "constraint": "may"
            },
            "FamilyHistorySection": {
                "id": "9513",
                "constraint": "may"
            },
            "ResultsSectionEntriesOptional": {
                "id": "9527",
                "constraint": "may"
            },
            "HistoryOfPastIllnessSection": {
                "id": "9517",
                "constraint": "may"
            },
            "SocialHistorySection": {
                "id": "9531",
                "constraint": "may"
            },
            "ProblemSectionEntriesOptional": {
                "id": "9523",
                "constraint": "may"
            },
            "MedicationsSectionEntriesOptional": {
                "id": "9521)",
                "constraint": "may"
            },
            "ImmunizationsSection": {
                "id": "9519",
                "constraint": "may"
            },
            "ProceduresSectionEntriesOptional": {
                "id": "9525",
                "constraint": "may"
            },
            "AssessmentAndPlanSection": {
                "id": "9491",
                "constraint": "may"
            },
            "GeneralStatusSection": {
                "id": "9515",
                "constraint": "may"
            },
            "ReasonForVisitSection": {
                "id": "9500",
                "constraint": "may"
            },
            "ChiefComplaintAndReasonForVisitSection": {
                "id": "10029",
                "constraint": "may"
            },
            "PlanOfCareSection": {
                "id": "9489",
                "constraint": "may"
            },
            "ReviewOfSystemsSection": {
                "id": "9529",
                "constraint": "may"
            },
            "ReasonForReferralSection": {
                "id": "9498",
                "constraint": "may"
            },
            "PhysicalExamSection": {
                "id": "9495",
                "constraint": "should"
            },
            "VitalSignsSectionEntriesOptional": {
                "id": "9533",
                "constraint": "may"
            },
            "AssessmentSection": {
                "id": "9487",
                "constraint": "may"
            },
            "HistoryOfPresentIllnessSection": {
                "id": "9493",
                "constraint": "shall"
            }
        },
        "shall": {
            "HistoryOfPresentIllnessSection": "9493"
        }
    },
    "ProgressNote": {
        "may": {
            "ChiefComplaintSection": "8772",
            "AllergiesSectionEntriesOptional": "8773",
            "ResultsSectionEntriesOptional": "8782",
            "ProblemSectionEntriesOptional": "8786",
            "MedicationsSectionEntriesOptional": "8771",
            "InterventionsSection": "8778",
            "AssessmentAndPlanSection": "8774",
            "ObjectiveSection": "8770",
            "VitalSignsSectionEntriesOptional": "8784",
            "PlanOfCareSection": "8775",
            "ReviewOfSystemsSection": "8788",
            "InstructionsSection": "16806",
            "PhysicalExamSection": "8780",
            "SubjectiveSection": "8790",
            "AssessmentSection": "8776"
        },
        "full": {
            "ChiefComplaintSection": {
                "id": "8772",
                "constraint": "may"
            },
            "AllergiesSectionEntriesOptional": {
                "id": "8773",
                "constraint": "may"
            },
            "ResultsSectionEntriesOptional": {
                "id": "8782",
                "constraint": "may"
            },
            "ProblemSectionEntriesOptional": {
                "id": "8786",
                "constraint": "may"
            },
            "MedicationsSectionEntriesOptional": {
                "id": "8771",
                "constraint": "may"
            },
            "InterventionsSection": {
                "id": "8778",
                "constraint": "may"
            },
            "AssessmentAndPlanSection": {
                "id": "8774",
                "constraint": "may"
            },
            "ObjectiveSection": {
                "id": "8770",
                "constraint": "may"
            },
            "VitalSignsSectionEntriesOptional": {
                "id": "8784",
                "constraint": "may"
            },
            "PlanOfCareSection": {
                "id": "8775",
                "constraint": "may"
            },
            "ReviewOfSystemsSection": {
                "id": "8788",
                "constraint": "may"
            },
            "InstructionsSection": {
                "id": "16806",
                "constraint": "may"
            },
            "PhysicalExamSection": {
                "id": "8780",
                "constraint": "may"
            },
            "SubjectiveSection": {
                "id": "8790",
                "constraint": "may"
            },
            "AssessmentSection": {
                "id": "8776",
                "constraint": "may"
            }
        }
    }
};

module.exports = exports = templatesconstraints;


},{}],31:[function(require,module,exports){
var templates = {
    "ConsultationNote": "2.16.840.1.113883.10.20.22.1.4",
    "ContinuityOfCareDocument": "2.16.840.1.113883.10.20.22.1.2",
    "DiagnosticImagingReport": "2.16.840.1.113883.10.20.22.1.5",
    "DischargeSummary": "2.16.840.1.113883.10.20.22.1.8",
    "HistoryAndPhysicalNote": "2.16.840.1.113883.10.20.22.1.3",
    "OperativeNote": "2.16.840.1.113883.10.20.22.1.7",
    "ProcedureNote": "2.16.840.1.113883.10.20.22.1.6",
    "ProgressNote": "2.16.840.1.113883.10.20.22.1.9",
    "UnstructuredDocument": "2.16.840.1.113883.10.20.21.1.10"
};

module.exports = exports = templates;


},{}],32:[function(require,module,exports){
"use strict";

var oids = require("./oids");

var codeSystem = {
    codeDisplayName: function (code) {
        return this.cs.table && this.cs.table[code];
    },
    displayNameCode: (function() {
        var reverseTables = {};

        return function(name) {
            var oid = this.oid;
            var reverseTable = reverseTables[oid];
            if (! reverseTable) {
                var table  = this.cs.table || {};
                reverseTable = Object.keys(table).reduce(function(r, code) {
                    var name = table[code];
                    r[name] = code;
                    return r;
                }, {});
                reverseTables[oid] = reverseTable;
            }
            return reverseTable[name];
        };
    })(),
    name: function () {
        return this.cs.name;
    },
    systemId: function() {
        var systemOID = this.cs.code_system;
        if (systemOID) {
            return {
                codeSystem: systemOID,
                codeSystemName: oids[systemOID].name
            };
        } else {
            return {
                codeSystem: this.oid,
                codeSystemName: this.cs.name
            };
        }
    }
};

exports.find = function (oid) {
    var cs = oids[oid];
    if (cs) {
        var result = Object.create(codeSystem);
        result.oid = oid;
        result.cs = cs;
        return result;
    } else {
        return null;
    }
};

exports.findFromName = (function() {
    var nameIndex;

    return function(name) {
        if (! nameIndex) {
            nameIndex = Object.keys(oids).reduce(function(r, oid) {
                var n = oids[oid].name;
                r[n] = oid;
                return r;
            }, {});
        }
        return nameIndex[name];
    };
})();

},{"./oids":33}],33:[function(require,module,exports){
module.exports = OIDs = {
    "2.16.840.1.113883.11.20.9.19": {
        name: "Problem Status",
        table: {
            "active": "active",
            "suspended": "suspended",
            "aborted": "aborted",
            "completed": "completed"
        }
    },
    "2.16.840.1.113883.5.8": {
        name: "Act Reason",
        table: {
            "IMMUNE": "Immunity",
            "MEDPREC": "Medical precaution",
            "OSTOCK": "Out of stock",
            "PATOBJ": "Patient objection",
            "PHILISOP": "Philosophical objection",
            "RELIG": "Religious objection",
            "VACEFF": "Vaccine efficacy concerns",
            "VACSAF": "Vaccine safety concerns"
        }
    },
    "2.16.840.1.113883.6.14": {
        name: "HCFA Procedure Codes (HCPCS)",
        uri: "http://www.cms.gov/Medicare/Coding/MedHCPCSGenInfo/index.html?redirect=/medhcpcsgeninfo/"
    },
    "2.16.840.1.113883.6.103": {
        name: "ICD-9-CM",
        uri: "http://www.cms.gov/medicare-coverage-database/staticpages/icd-9-code-lookup.aspx"
    },
    "2.16.840.1.113883.6.233": {
        name: "US Department of Veterans Affairs",
        uri: "http://www.hl7.org/documentcenter/public_temp_36CB0CDC-1C23-BA17-0C356EB233D41682/standards/vocabulary/vocabulary_tables/infrastructure/vocabulary/voc_ExternalSystems.html"
    },
    "2.16.840.1.113883.6.69": {
        name: "NDC-FDA Drug Registration",
        uri: "http://phinvads.cdc.gov/vads/ViewCodeSystem.action?id=2.16.840.1.113883.6.69"
    },
    "2.16.840.1.113883.6.253": {
        name: "MediSpan DDID"
    },
    "2.16.840.1.113883.6.27": {
        name: "Multum",
        uri: "http://multum-look-me-up#"
    },
    "2.16.840.1.113883.6.312": {
        name: "multum-drug-synonym-id",
        uri: "http://multum-drug-synonym-id-look-me-up#"
    },
    "2.16.840.1.113883.6.314": {
        name: "multum-drug-id",
        uri: "http://multum-drug-id-look-me-up#"
    },
    "2.16.840.1.113883.3.26.1.1": {
        name: "NCI Thesaurus",
        uri: "http://nci-thesaurus-look-me-up#"
    },
    "2.16.840.1.113883.6.59": {
        name: "CVX Vaccine",
        uri: "http://www2a.cdc.gov/vaccines/iis/iisstandards/vaccines.asp?rpt=cvx&code="
    },
    "2.16.840.1.113883.5.112": {
        name: "Route Code",
        uri: "http://hl7.org/codes/RouteCode#"
    },
    "2.16.840.1.113883.6.238": {
        name: "Race and Ethnicity - CDC",
        uri: "http://phinvads.cdc.gov/vads/ViewCodeSystemConcept.action?oid=2.16.840.1.113883.6.238&code="
    },
    "2.16.840.1.113883.6.255.1336": {
        name: "InsuranceType Code"
    },
    "2.16.840.1.113883.6.1": {
        name: "LOINC",
        uri: "http://purl.bioontology.org/ontology/LNC/"
    },
    "2.16.840.1.113883.6.88": {
        name: "RXNORM",
        uri: "http://purl.bioontology.org/ontology/RXNORM/"
    },
    "2.16.840.1.113883.6.96": {
        name: "SNOMED CT",
        uri: "http://purl.bioontology.org/ontology/SNOMEDCT/",
        table: {
            "55561003": "Active",
            "421139008": "On Hold",
            "392521001": "Prior History",
            "73425007": "No Longer Active"
        }
    },
    "2.16.840.1.113883.6.12": {
        name: "CPT",
        uri: "http://purl.bioontology.org/ontology/CPT/"
    },
    "2.16.840.1.113883.5.4": {
        name: "HL7ActCode",
        uri: "http://hl7.org/actcode/"
    },
    "2.16.840.1.113883.4.9": {
        name: "UNII",
    },
    "2.16.840.1.113883.1.11.78": {
        name: "Observation Interpretation"
    },
    "2.16.840.1.113883.19": {
        name: "Good Health Clinic",
        uri: "http://hl7.org/goodhealth/"
    },
    "2.16.840.1.113883.6.259": {
        name: "HealthcareServiceLocation",
        uri: "http://hl7.org/healthcareservice/"
    },
    "2.16.840.1.113883.1.11.19185": {
        name: "HL7 Religion",
        uri: "http://hl7.org/codes/ReligiousAffiliation#"
    },
    "2.16.840.1.113883.5.60": {
        name: "LanguageAbilityMode",
        uri: "http://hl7.org/codes/LanguageAbility#",
        table: {
            ESGN: "Expressed signed",
            ESP: "Expressed spoken",
            EWR: "Expressed written",
            RSGN: "Received signed",
            RSP: "Received spoken",
            RWR: "Received written"
        }
    },
    "2.16.840.1.113883.5.2": {
        name: "HL7 Marital Status",
        uri: "http://hl7.org/codes/MaritalStatus#"
    },
    "2.16.840.1.113883.5.83": {
        name: "HL7 Result Interpretation",
        uri: "http://hl7.org/codes/ResultInterpretation#",
        table: {
            "B": "better",
            "D": "decreased",
            "U": "increased",
            "W": "worse",
            "<": "low off scale",
            ">": "high off scale",
            "A": "Abnormal",
            "AA": "abnormal alert",
            "H": "High",
            "HH": "high alert",
            "L": "Low",
            "LL": "low alert",
            "N": "Normal",
            "I": "intermediate",
            "MS": "moderately susceptible",
            "R": "resistent",
            "S": "susceptible",
            "VS": "very susceptible",
            "EX": "outside threshold",
            "HX": "above high threshold",
            "LX": "below low threshold",

        }
    },
    "2.16.840.1.113883.5.111": {
        name: "HL7 Role",
        uri: "http://hl7.org/codes/PersonalRelationship#",
        table: {
            "PRN": "Parent"
        }
    },
    "2.16.840.1.113883.5.110": {
        name: "HL7 RoleCode"
    },
    "2.16.840.1.113883.5.1119": {
        name: "HL7 Address",
        uri: "http://hl7.org/codes/Address#",
        table: {
            "BAD": "bad address",
            "CONF": "confidential",
            "DIR": "direct",
            "H": "home address",
            "HP": "primary home",
            "HV": "vacation home",
            "PHYS": "physical visit address",
            "PST": "postal address",
            "PUB": "public",
            "TMP": "temporary",
            "WP": "work place",
            "MC": "mobile contact",
            "PG": "pager",
            "EC": "emergency contact",
            "AS": "answering service"
        }
    },
    "2.16.840.1.113883.5.45": {
        name: "HL7 EntityName",
        uri: "http://hl7.org/codes/EntityName#",
        table: {
            "A": "Artist/Stage",
            "ABC": "Alphabetic",
            "ASGN": "Assigned",
            "C": "License",
            "I": "Indigenous/Tribal",
            "IDE": "Ideographic",
            "L": "Legal",
            "P": "Pseudonym",
            "PHON": "Phonetic",
            "R": "Religious",
            "SNDX": "Soundex",
            "SRCH": "Search",
            "SYL": "Syllabic"
        }
    },
    "2.16.840.1.113883.5.1": {
        name: "HL7 AdministrativeGender",
        uri: "http://hl7.org/codes/AdministrativeGender#",
        table: {
            "F": "Female",
            "M": "Male",
            "UN": "Undifferentiated"
        }
    },
    "2.16.840.1.113883.3.88.12.3221.6.8": {
        name: "Problem Severity",
        uri: "http://purl.bioontology.org/ontology/SNOMEDCT/",
        code_system: "2.16.840.1.113883.6.96",
        table: {
            "255604002": "Mild",
            "371923003": "Mild to moderate",
            "6736007": "Moderate",
            "371924009": "Moderate to severe",
            "24484000": "Severe",
            "399166001": "Fatal"
        }
    },
    "2.16.840.1.113883.3.88.12.80.68": {
        name: "HITSP Problem Status",
        uri: "http://purl.bioontology.org/ontology/SNOMEDCT/",
        code_system: "2.16.840.1.113883.6.96",
        table: {
            "55561003": "Active",
            "73425007": "Inactive",
            "413322009": "Resolved"
        }
    },
    "2.16.840.1.113883.11.20.9.38": {
        name: "Smoking Status/Social History Observation",
        uri: "http://purl.bioontology.org/ontology/SNOMEDCT/",
        code_system: "2.16.840.1.113883.6.96",
        table: {
            "449868002": "Current every day smoker",
            "428041000124106": "Current some day smoker",
            "8517006": "Former smoker",
            "266919005": "Never smoker",
            "77176002": "Smoker, current status unknown",
            "266927001": "Unknown if ever smoked",
            "230056004": "Smoker, current status unknown",
            "229819007": "Tobacco use and exposure",
            "256235009": "Exercise",
            "160573003": "Alcohol intake",
            "364393001": "Nutritional observable",
            "364703007": "Employment detail",
            "425400000": "Toxic exposure status",
            "363908000": "Details of drug misuse behavior",
            "228272008": "Health-related behavior",
            "105421008": "Educational Achievement"
        }
    },
    "2.16.840.1.113883.11.20.9.21": {
        name: "Age Unified Code for Units of Measure",
        uri: "http://phinvads.cdc.gov/vads/ViewValueSet.action?oid=2.16.840.1.114222.4.11.878",
        table: {
            "min": "Minute",
            "h": "Hour",
            "d": "Day",
            "wk": "Week",
            "mo": "Month",
            "a": "Year"
        }
    },
    "2.16.840.1.113883.12.292": {
        name: "CVX",
        uri: "http://phinvads.cdc.gov/vads/ViewCodeSystem.action?id=2.16.840.1.113883.12.292"
    },
    "2.16.840.1.113883.5.1076": {
        name: "HL7 Religious Affiliation",
        uri: "http://ushik.ahrq.gov/ViewItemDetails?system=mdr&itemKey=83154000",
        table: {
            "1008": "Babi & Baha´I faiths",
            "1009": "Baptist",
            "1010": "Bon",
            "1011": "Cao Dai",
            "1012": "Celticism",
            "1013": "Christian (non-Catholic, non-specific)",
            "1014": "Confucianism",
            "1015": "Cyberculture Religions",
            "1016": "Divination",
            "1017": "Fourth Way",
            "1018": "Free Daism",
            "1019": "Gnosis",
            "1020": "Hinduism",
            "1021": "Humanism",
            "1022": "Independent",
            "1023": "Islam",
            "1024": "Jainism",
            "1025": "Jehovah´s Witnesses",
            "1026": "Judaism",
            "1027": "Latter Day Saints",
            "1028": "Lutheran",
            "1029": "Mahayana",
            "1030": "Meditation",
            "1031": "Messianic Judaism",
            "1032": "Mitraism",
            "1033": "New Age",
            "1034": "non-Roman Catholic",
            "1035": "Occult",
            "1036": "Orthodox",
            "1037": "Paganism",
            "1038": "Pentecostal",
            "1039": "Process, The",
            "1040": "Reformed/Presbyterian",
            "1041": "Roman Catholic Church",
            "1042": "Satanism",
            "1043": "Scientology",
            "1044": "Shamanism",
            "1045": "Shiite (Islam)",
            "1046": "Shinto",
            "1047": "Sikism",
            "1048": "Spiritualism",
            "1049": "Sunni (Islam)",
            "1050": "Taoism",
            "1051": "Theravada",
            "1052": "Unitarian-Universalism",
            "1053": "Universal Life Church",
            "1054": "Vajrayana (Tibetan)",
            "1055": "Veda",
            "1056": "Voodoo",
            "1057": "Wicca",
            "1058": "Yaohushua",
            "1059": "Zen Buddhism",
            "1060": "Zoroastrianism",
            "1062": "Brethren",
            "1063": "Christian Scientist",
            "1064": "Church of Christ",
            "1065": "Church of God",
            "1066": "Congregational",
            "1067": "Disciples of Christ",
            "1068": "Eastern Orthodox",
            "1069": "Episcopalian",
            "1070": "Evangelical Covenant",
            "1071": "Friends",
            "1072": "Full Gospel",
            "1073": "Methodist",
            "1074": "Native American",
            "1075": "Nazarene",
            "1076": "Presbyterian",
            "1077": "Protestant",
            "1078": "Protestant, No Denomination",
            "1079": "Reformed",
            "1080": "Salvation Army",
            "1081": "Unitarian Universalist",
            "1082": "United Church of Christ"
        }
    },
    "2.16.840.1.113883.1.11.11526": {
        "name": "Internet Society Language",
        "uri": "http://www.loc.gov/standards/iso639-2/php/English_list.php"
    },
    "2.16.840.1.113883.11.20.9.22": {
        name: "ActStatus",
        table: {
            "completed": "Completed",
            "active": "Active",
            "aborted": "Aborted",
            "cancelled": "Cancelled"
        }
    },
    "2.16.840.1.113883.6.238": {
        name: "Race and Ethnicity - CDC",
        table: {
            "1002-5": "American Indian or Alaska Native",
            "2028-9": "Asian",
            "2054-5": "Black or African American",
            "2076-8": "Native Hawaiian or Other Pacific Islander",
            "2106-3": "White",
            "2131-1": "Other Race",
            "1004-1": "American Indian",
            "1735-0": "Alaska Native",
            "2029-7": "Asian Indian",
            "2030-5": "Bangladeshi",
            "2031-3": "Bhutanese",
            "2032-1": "Burmese",
            "2033-9": "Cambodian",
            "2034-7": "Chinese",
            "2035-4": "Taiwanese",
            "2036-2": "Filipino",
            "2037-0": "Hmong",
            "2038-8": "Indonesian",
            "2039-6": "Japanese",
            "2040-4": "Korean",
            "2041-2": "Laotian",
            "2042-0": "Malaysian",
            "2043-8": "Okinawan",
            "2044-6": "Pakistani",
            "2045-3": "Sri Lankan",
            "2046-1": "Thai",
            "2047-9": "Vietnamese",
            "2048-7": "Iwo Jiman",
            "2049-5": "Maldivian",
            "2050-3": "Nepalese",
            "2051-1": "Singaporean",
            "2052-9": "Madagascar",
            "2056-0": "Black",
            "2058-6": "African American",
            "2060-2": "African",
            "2067-7": "Bahamian",
            "2068-5": "Barbadian",
            "2069-3": "Dominican",
            "2070-1": "Dominica Islander",
            "2071-9": "Haitian",
            "2072-7": "Jamaican",
            "2073-5": "Tobagoan",
            "2074-3": "Trinidadian",
            "2075-0": "West Indian",
            "2078-4": "Polynesian",
            "2085-9": "Micronesian",
            "2100-6": "Melanesian",
            "2500-7": "Other Pacific Islander",
            "2108-9": "European",
            "2118-8": "Middle Eastern or North African",
            "2129-5": "Arab",
            "1006-6": "Abenaki",
            "1008-2": "Algonquian",
            "1010-8": "Apache",
            "1021-5": "Arapaho",
            "1026-4": "Arikara",
            "1028-0": "Assiniboine",
            "1030-6": "Assiniboine Sioux",
            "1033-0": "Bannock",
            "1035-5": "Blackfeet",
            "1037-1": "Brotherton",
            "1039-7": "Burt Lake Band",
            "1041-3": "Caddo",
            "1044-7": "Cahuilla",
            "1053-8": "California Tribes",
            "1068-6": "Canadian and Latin American Indian",
            "1076-9": "Catawba",
            "1078-5": "Cayuse",
            "1080-1": "Chehalis",
            "1082-7": "Chemakuan",
            "1086-8": "Chemehuevi",
            "1088-4": "Cherokee",
            "1100-7": "Cherokee Shawnee",
            "1102-3": "Cheyenne",
            "1106-4": "Cheyenne-Arapaho",
            "1108-0": "Chickahominy",
            "1112-2": "Chickasaw",
            "1114-8": "Chinook",
            "1123-9": "Chippewa",
            "1150-2": "Chippewa Cree",
            "1153-6": "Chitimacha",
            "1155-1": "Choctaw",
            "1162-7": "Chumash",
            "1165-0": "Clear Lake",
            "1167-6": "Coeur D'Alene",
            "1169-2": "Coharie",
            "1171-8": "Colorado River",
            "1173-4": "Colville",
            "1175-9": "Comanche",
            "1178-3": "Coos, Lower Umpqua, Siuslaw",
            "1180-9": "Coos",
            "1182-5": "Coquilles",
            "1184-1": "Costanoan",
            "1186-6": "Coushatta",
            "1189-0": "Cowlitz",
            "1191-6": "Cree",
            "1193-2": "Creek",
            "1207-0": "Croatan",
            "1209-6": "Crow",
            "1211-2": "Cupeno",
            "1214-6": "Delaware",
            "1222-9": "Diegueno",
            "1233-6": "Eastern Tribes",
            "1250-0": "Esselen",
            "1252-6": "Fort Belknap",
            "1254-2": "Fort Berthold",
            "1256-7": "Fort Mcdowell",
            "1258-3": "Fort Hall",
            "1260-9": "Gabrieleno",
            "1262-5": "Grand Ronde",
            "1264-1": "Gros Ventres",
            "1267-4": "Haliwa",
            "1269-0": "Hidatsa",
            "1271-6": "Hoopa",
            "1275-7": "Hoopa Extension",
            "1277-3": "Houma",
            "1279-9": "Inaja-Cosmit",
            "1281-5": "Iowa",
            "1285-6": "Iroquois",
            "1297-1": "Juaneno",
            "1299-7": "Kalispel",
            "1301-1": "Karuk",
            "1303-7": "Kaw",
            "1305-2": "Kickapoo",
            "1309-4": "Kiowa",
            "1312-8": "Klallam",
            "1317-7": "Klamath",
            "1319-3": "Konkow",
            "1321-9": "Kootenai",
            "1323-5": "Lassik",
            "1325-0": "Long Island",
            "1331-8": "Luiseno",
            "1340-9": "Lumbee",
            "1342-5": "Lummi",
            "1344-1": "Maidu",
            "1348-2": "Makah",
            "1350-8": "Maliseet",
            "1352-4": "Mandan",
            "1354-0": "Mattaponi",
            "1356-5": "Menominee",
            "1358-1": "Miami",
            "1363-1": "Miccosukee",
            "1365-6": "Micmac",
            "1368-0": "Mission Indians",
            "1370-6": "Miwok",
            "1372-2": "Modoc",
            "1374-8": "Mohegan",
            "1376-3": "Mono",
            "1378-9": "Nanticoke",
            "1380-5": "Narragansett",
            "1382-1": "Navajo",
            "1387-0": "Nez Perce",
            "1389-6": "Nomalaki",
            "1391-2": "Northwest Tribes",
            "1403-5": "Omaha",
            "1405-0": "Oregon Athabaskan",
            "1407-6": "Osage",
            "1409-2": "Otoe-Missouria",
            "1411-8": "Ottawa",
            "1416-7": "Paiute",
            "1439-9": "Pamunkey",
            "1441-5": "Passamaquoddy",
            "1445-6": "Pawnee",
            "1448-0": "Penobscot",
            "1450-6": "Peoria",
            "1453-0": "Pequot",
            "1456-3": "Pima",
            "1460-5": "Piscataway",
            "1462-1": "Pit River",
            "1464-7": "Pomo",
            "1474-6": "Ponca",
            "1478-7": "Potawatomi",
            "1487-8": "Powhatan",
            "1489-4": "Pueblo",
            "1518-0": "Puget Sound Salish",
            "1541-2": "Quapaw",
            "1543-8": "Quinault",
            "1545-3": "Rappahannock",
            "1547-9": "Reno-Sparks",
            "1549-5": "Round Valley",
            "1551-1": "Sac and Fox",
            "1556-0": "Salinan",
            "1558-6": "Salish",
            "1560-2": "Salish and Kootenai",
            "1562-8": "Schaghticoke",
            "1564-4": "Scott Valley",
            "1566-9": "Seminole",
            "1573-5": "Serrano",
            "1576-8": "Shasta",
            "1578-4": "Shawnee",
            "1582-6": "Shinnecock",
            "1584-2": "Shoalwater Bay",
            "1586-7": "Shoshone",
            "1602-2": "Shoshone Paiute",
            "1607-1": "Siletz",
            "1609-7": "Sioux",
            "1643-6": "Siuslaw",
            "1645-1": "Spokane",
            "1647-7": "Stewart",
            "1649-3": "Stockbridge",
            "1651-9": "Susanville",
            "1653-5": "Tohono O'Odham",
            "1659-2": "Tolowa",
            "1661-8": "Tonkawa",
            "1663-4": "Tygh",
            "1665-9": "Umatilla",
            "1667-5": "Umpqua",
            "1670-9": "Ute",
            "1675-8": "Wailaki",
            "1677-4": "Walla-Walla",
            "1679-0": "Wampanoag",
            "1683-2": "Warm Springs",
            "1685-7": "Wascopum",
            "1687-3": "Washoe",
            "1692-3": "Wichita",
            "1694-9": "Wind River",
            "1696-4": "Winnebago",
            "1700-4": "Winnemucca",
            "1702-0": "Wintun",
            "1704-6": "Wiyot",
            "1707-9": "Yakama",
            "1709-5": "Yakama Cowlitz",
            "1711-1": "Yaqui",
            "1715-2": "Yavapai Apache",
            "1717-8": "Yokuts",
            "1722-8": "Yuchi",
            "1724-4": "Yuman",
            "1732-7": "Yurok",
            "1737-6": "Alaska Indian",
            "1840-8": "Eskimo",
            "1966-1": "Aleut",
            "2061-0": "Botswanan",
            "2062-8": "Ethiopian",
            "2063-6": "Liberian",
            "2064-4": "Namibian",
            "2065-1": "Nigerian",
            "2066-9": "Zairean",
            "2079-2": "Native Hawaiian",
            "2080-0": "Samoan",
            "2081-8": "Tahitian",
            "2082-6": "Tongan",
            "2083-4": "Tokelauan",
            "2086-7": "Guamanian or Chamorro",
            "2087-5": "Guamanian",
            "2088-3": "Chamorro",
            "2089-1": "Mariana Islander",
            "2090-9": "Marshallese",
            "2091-7": "Palauan",
            "2092-5": "Carolinian",
            "2093-3": "Kosraean",
            "2094-1": "Pohnpeian",
            "2095-8": "Saipanese",
            "2096-6": "Kiribati",
            "2097-4": "Chuukese",
            "2098-2": "Yapese",
            "2101-4": "Fijian",
            "2102-2": "Papua New Guinean",
            "2103-0": "Solomon Islander",
            "2104-8": "New Hebrides",
            "2109-7": "Armenian",
            "2110-5": "English",
            "2111-3": "French",
            "2112-1": "German",
            "2113-9": "Irish",
            "2114-7": "Italian",
            "2115-4": "Polish",
            "2116-2": "Scottish",
            "2119-6": "Assyrian",
            "2120-4": "Egyptian",
            "2121-2": "Iranian",
            "2122-0": "Iraqi",
            "2123-8": "Lebanese",
            "2124-6": "Palestinian",
            "2125-3": "Syrian",
            "2126-1": "Afghanistani",
            "2127-9": "Israeili",
            "1011-6": "Chiricahua",
            "1012-4": "Fort Sill Apache",
            "1013-2": "Jicarilla Apache",
            "1014-0": "Lipan Apache",
            "1015-7": "Mescalero Apache",
            "1016-5": "Oklahoma Apache",
            "1017-3": "Payson Apache",
            "1018-1": "San Carlos Apache",
            "1019-9": "White Mountain Apache",
            "1022-3": "Northern Arapaho",
            "1023-1": "Southern Arapaho",
            "1024-9": "Wind River Arapaho",
            "1031-4": "Fort Peck Assiniboine Sioux",
            "1042-1": "Oklahoma Cado",
            "1045-4": "Agua Caliente Cahuilla",
            "1046-2": "Augustine",
            "1047-0": "Cabazon",
            "1048-8": "Los Coyotes",
            "1049-6": "Morongo",
            "1050-4": "Santa Rosa Cahuilla",
            "1051-2": "Torres-Martinez",
            "1054-6": "Cahto",
            "1055-3": "Chimariko",
            "1056-1": "Coast Miwok",
            "1057-9": "Digger",
            "1058-7": "Kawaiisu",
            "1059-5": "Kern River",
            "1060-3": "Mattole",
            "1061-1": "Red Wood",
            "1062-9": "Santa Rosa",
            "1063-7": "Takelma",
            "1064-5": "Wappo",
            "1065-2": "Yana",
            "1066-0": "Yuki",
            "1069-4": "Canadian Indian",
            "1070-2": "Central American Indian",
            "1071-0": "French American Indian",
            "1072-8": "Mexican American Indian",
            "1073-6": "South American Indian",
            "1074-4": "Spanish American Indian",
            "1083-5": "Hoh",
            "1084-3": "Quileute",
            "1089-2": "Cherokee Alabama",
            "1090-0": "Cherokees of Northeast Alabama",
            "1091-8": "Cherokees of Southeast Alabama",
            "1092-6": "Eastern Cherokee",
            "1093-4": "Echota Cherokee",
            "1094-2": "Etowah Cherokee",
            "1095-9": "Northern Cherokee",
            "1096-7": "Tuscola",
            "1097-5": "United Keetowah Band of Cherokee",
            "1098-3": "Western Cherokee",
            "1103-1": "Northern Cheyenne",
            "1104-9": "Southern Cheyenne",
            "1109-8": "Eastern Chickahominy",
            "1110-6": "Western Chickahominy",
            "1115-5": "Clatsop",
            "1116-3": "Columbia River Chinook",
            "1117-1": "Kathlamet",
            "1118-9": "Upper Chinook",
            "1119-7": "Wakiakum Chinook",
            "1120-5": "Willapa Chinook",
            "1121-3": "Wishram",
            "1124-7": "Bad River",
            "1125-4": "Bay Mills Chippewa",
            "1126-2": "Bois Forte",
            "1127-0": "Burt Lake Chippewa",
            "1128-8": "Fond du Lac",
            "1129-6": "Grand Portage",
            "1130-4": "Grand Traverse Band of Ottawa/Chippewa",
            "1131-2": "Keweenaw",
            "1132-0": "Lac Courte Oreilles",
            "1133-8": "Lac du Flambeau",
            "1134-6": "Lac Vieux Desert Chippewa",
            "1135-3": "Lake Superior",
            "1136-1": "Leech Lake",
            "1137-9": "Little Shell Chippewa",
            "1138-7": "Mille Lacs",
            "1139-5": "Minnesota Chippewa",
            "1140-3": "Ontonagon",
            "1141-1": "Red Cliff Chippewa",
            "1142-9": "Red Lake Chippewa",
            "1143-7": "Saginaw Chippewa",
            "1144-5": "St. Croix Chippewa",
            "1145-2": "Sault Ste. Marie Chippewa",
            "1146-0": "Sokoagon Chippewa",
            "1147-8": "Turtle Mountain",
            "1148-6": "White Earth",
            "1151-0": "Rocky Boy's Chippewa Cree",
            "1156-9": "Clifton Choctaw",
            "1157-7": "Jena Choctaw",
            "1158-5": "Mississippi Choctaw",
            "1159-3": "Mowa Band of Choctaw",
            "1160-1": "Oklahoma Choctaw",
            "1163-5": "Santa Ynez",
            "1176-7": "Oklahoma Comanche",
            "1187-4": "Alabama Coushatta",
            "1194-0": "Alabama Creek",
            "1195-7": "Alabama Quassarte",
            "1196-5": "Eastern Creek",
            "1197-3": "Eastern Muscogee",
            "1198-1": "Kialegee",
            "1199-9": "Lower Muscogee",
            "1200-5": "Machis Lower Creek Indian",
            "1201-3": "Poarch Band",
            "1202-1": "Principal Creek Indian Nation",
            "1203-9": "Star Clan of Muscogee Creeks",
            "1204-7": "Thlopthlocco",
            "1205-4": "Tuckabachee",
            "1212-0": "Agua Caliente",
            "1215-3": "Eastern Delaware",
            "1216-1": "Lenni-Lenape",
            "1217-9": "Munsee",
            "1218-7": "Oklahoma Delaware",
            "1219-5": "Rampough Mountain",
            "1220-3": "Sand Hill",
            "1223-7": "Campo",
            "1224-5": "Capitan Grande",
            "1225-2": "Cuyapaipe",
            "1226-0": "La Posta",
            "1227-8": "Manzanita",
            "1228-6": "Mesa Grande",
            "1229-4": "San Pasqual",
            "1230-2": "Santa Ysabel",
            "1231-0": "Sycuan",
            "1234-4": "Attacapa",
            "1235-1": "Biloxi",
            "1236-9": "Georgetown (Eastern Tribes)",
            "1237-7": "Moor",
            "1238-5": "Nansemond",
            "1239-3": "Natchez",
            "1240-1": "Nausu Waiwash",
            "1241-9": "Nipmuc",
            "1242-7": "Paugussett",
            "1243-5": "Pocomoke Acohonock",
            "1244-3": "Southeastern Indians",
            "1245-0": "Susquehanock",
            "1246-8": "Tunica Biloxi",
            "1247-6": "Waccamaw-Siousan",
            "1248-4": "Wicomico",
            "1265-8": "Atsina",
            "1272-4": "Trinity",
            "1273-2": "Whilkut",
            "1282-3": "Iowa of Kansas-Nebraska",
            "1283-1": "Iowa of Oklahoma",
            "1286-4": "Cayuga",
            "1287-2": "Mohawk",
            "1288-0": "Oneida",
            "1289-8": "Onondaga",
            "1290-6": "Seneca",
            "1291-4": "Seneca Nation",
            "1292-2": "Seneca-Cayuga",
            "1293-0": "Tonawanda Seneca",
            "1294-8": "Tuscarora",
            "1295-5": "Wyandotte",
            "1306-0": "Oklahoma Kickapoo",
            "1307-8": "Texas Kickapoo",
            "1310-2": "Oklahoma Kiowa",
            "1313-6": "Jamestown",
            "1314-4": "Lower Elwha",
            "1315-1": "Port Gamble Klallam",
            "1326-8": "Matinecock",
            "1327-6": "Montauk",
            "1328-4": "Poospatuck",
            "1329-2": "Setauket",
            "1332-6": "La Jolla",
            "1333-4": "Pala",
            "1334-2": "Pauma",
            "1335-9": "Pechanga",
            "1336-7": "Soboba",
            "1337-5": "Twenty-Nine Palms",
            "1338-3": "Temecula",
            "1345-8": "Mountain Maidu",
            "1346-6": "Nishinam",
            "1359-9": "Illinois Miami",
            "1360-7": "Indiana Miami",
            "1361-5": "Oklahoma Miami",
            "1366-4": "Aroostook",
            "1383-9": "Alamo Navajo",
            "1384-7": "Canoncito Navajo",
            "1385-4": "Ramah Navajo",
            "1392-0": "Alsea",
            "1393-8": "Celilo",
            "1394-6": "Columbia",
            "1395-3": "Kalapuya",
            "1396-1": "Molala",
            "1397-9": "Talakamish",
            "1398-7": "Tenino",
            "1399-5": "Tillamook",
            "1400-1": "Wenatchee",
            "1401-9": "Yahooskin",
            "1412-6": "Burt Lake Ottawa",
            "1413-4": "Michigan Ottawa",
            "1414-2": "Oklahoma Ottawa",
            "1417-5": "Bishop",
            "1418-3": "Bridgeport",
            "1419-1": "Burns Paiute",
            "1420-9": "Cedarville",
            "1421-7": "Fort Bidwell",
            "1422-5": "Fort Independence",
            "1423-3": "Kaibab",
            "1424-1": "Las Vegas",
            "1425-8": "Lone Pine",
            "1426-6": "Lovelock",
            "1427-4": "Malheur Paiute",
            "1428-2": "Moapa",
            "1429-0": "Northern Paiute",
            "1430-8": "Owens Valley",
            "1431-6": "Pyramid Lake",
            "1432-4": "San Juan Southern Paiute",
            "1433-2": "Southern Paiute",
            "1434-0": "Summit Lake",
            "1435-7": "Utu Utu Gwaitu Paiute",
            "1436-5": "Walker River",
            "1437-3": "Yerington Paiute",
            "1442-3": "Indian Township",
            "1443-1": "Pleasant Point Passamaquoddy",
            "1446-4": "Oklahoma Pawnee",
            "1451-4": "Oklahoma Peoria",
            "1454-8": "Marshantucket Pequot",
            "1457-1": "Gila River Pima-Maricopa",
            "1458-9": "Salt River Pima-Maricopa",
            "1465-4": "Central Pomo",
            "1466-2": "Dry Creek",
            "1467-0": "Eastern Pomo",
            "1468-8": "Kashia",
            "1469-6": "Northern Pomo",
            "1470-4": "Scotts Valley",
            "1471-2": "Stonyford",
            "1472-0": "Sulphur Bank",
            "1475-3": "Nebraska Ponca",
            "1476-1": "Oklahoma Ponca",
            "1479-5": "Citizen Band Potawatomi",
            "1480-3": "Forest County",
            "1481-1": "Hannahville",
            "1482-9": "Huron Potawatomi",
            "1483-7": "Pokagon Potawatomi",
            "1484-5": "Prairie Band",
            "1485-2": "Wisconsin Potawatomi",
            "1490-2": "Acoma",
            "1491-0": "Arizona Tewa",
            "1492-8": "Cochiti",
            "1493-6": "Hopi",
            "1494-4": "Isleta",
            "1495-1": "Jemez",
            "1496-9": "Keres",
            "1497-7": "Laguna",
            "1498-5": "Nambe",
            "1499-3": "Picuris",
            "1500-8": "Piro",
            "1501-6": "Pojoaque",
            "1502-4": "San Felipe",
            "1503-2": "San Ildefonso",
            "1504-0": "San Juan Pueblo",
            "1505-7": "San Juan De",
            "1506-5": "San Juan",
            "1507-3": "Sandia",
            "1508-1": "Santa Ana",
            "1509-9": "Santa Clara",
            "1510-7": "Santo Domingo",
            "1511-5": "Taos",
            "1512-3": "Tesuque",
            "1513-1": "Tewa",
            "1514-9": "Tigua",
            "1515-6": "Zia",
            "1516-4": "Zuni",
            "1519-8": "Duwamish",
            "1520-6": "Kikiallus",
            "1521-4": "Lower Skagit",
            "1522-2": "Muckleshoot",
            "1523-0": "Nisqually",
            "1524-8": "Nooksack",
            "1525-5": "Port Madison",
            "1526-3": "Puyallup",
            "1527-1": "Samish",
            "1528-9": "Sauk-Suiattle",
            "1529-7": "Skokomish",
            "1530-5": "Skykomish",
            "1531-3": "Snohomish",
            "1532-1": "Snoqualmie",
            "1533-9": "Squaxin Island",
            "1534-7": "Steilacoom",
            "1535-4": "Stillaguamish",
            "1536-2": "Suquamish",
            "1537-0": "Swinomish",
            "1538-8": "Tulalip",
            "1539-6": "Upper Skagit",
            "1552-9": "Iowa Sac and Fox",
            "1553-7": "Missouri Sac and Fox",
            "1554-5": "Oklahoma Sac and Fox",
            "1567-7": "Big Cypress",
            "1568-5": "Brighton",
            "1569-3": "Florida Seminole",
            "1570-1": "Hollywood Seminole",
            "1571-9": "Oklahoma Seminole",
            "1574-3": "San Manual",
            "1579-2": "Absentee Shawnee",
            "1580-0": "Eastern Shawnee",
            "1587-5": "Battle Mountain",
            "1588-3": "Duckwater",
            "1589-1": "Elko",
            "1590-9": "Ely",
            "1591-7": "Goshute",
            "1592-5": "Panamint",
            "1593-3": "Ruby Valley",
            "1594-1": "Skull Valley",
            "1595-8": "South Fork Shoshone",
            "1596-6": "Te-Moak Western Shoshone",
            "1597-4": "Timbi-Sha Shoshone",
            "1598-2": "Washakie",
            "1599-0": "Wind River Shoshone",
            "1600-6": "Yomba",
            "1603-0": "Duck Valley",
            "1604-8": "Fallon",
            "1605-5": "Fort McDermitt",
            "1610-5": "Blackfoot Sioux",
            "1611-3": "Brule Sioux",
            "1612-1": "Cheyenne River Sioux",
            "1613-9": "Crow Creek Sioux",
            "1614-7": "Dakota Sioux",
            "1615-4": "Flandreau Santee",
            "1616-2": "Fort Peck",
            "1617-0": "Lake Traverse Sioux",
            "1618-8": "Lower Brule Sioux",
            "1619-6": "Lower Sioux",
            "1620-4": "Mdewakanton Sioux",
            "1621-2": "Miniconjou",
            "1622-0": "Oglala Sioux",
            "1623-8": "Pine Ridge Sioux",
            "1624-6": "Pipestone Sioux",
            "1625-3": "Prairie Island Sioux",
            "1626-1": "Prior Lake Sioux",
            "1627-9": "Rosebud Sioux",
            "1628-7": "Sans Arc Sioux",
            "1629-5": "Santee Sioux",
            "1630-3": "Sisseton-Wahpeton",
            "1631-1": "Sisseton Sioux",
            "1632-9": "Spirit Lake Sioux",
            "1633-7": "Standing Rock Sioux",
            "1634-5": "Teton Sioux",
            "1635-2": "Two Kettle Sioux",
            "1636-0": "Upper Sioux",
            "1637-8": "Wahpekute Sioux",
            "1638-6": "Wahpeton Sioux",
            "1639-4": "Wazhaza Sioux",
            "1640-2": "Yankton Sioux",
            "1641-0": "Yanktonai Sioux",
            "1654-3": "Ak-Chin",
            "1655-0": "Gila Bend",
            "1656-8": "San Xavier",
            "1657-6": "Sells",
            "1668-3": "Cow Creek Umpqua",
            "1671-7": "Allen Canyon",
            "1672-5": "Uintah Ute",
            "1673-3": "Ute Mountain Ute",
            "1680-8": "Gay Head Wampanoag",
            "1681-6": "Mashpee Wampanoag",
            "1688-1": "Alpine",
            "1689-9": "Carson",
            "1690-7": "Dresslerville",
            "1697-2": "Ho-chunk",
            "1698-0": "Nebraska Winnebago",
            "1705-3": "Table Bluff",
            "1712-9": "Barrio Libre",
            "1713-7": "Pascua Yaqui",
            "1718-6": "Chukchansi",
            "1719-4": "Tachi",
            "1720-2": "Tule River",
            "1725-1": "Cocopah",
            "1726-9": "Havasupai",
            "1727-7": "Hualapai",
            "1728-5": "Maricopa",
            "1729-3": "Mohave",
            "1730-1": "Quechan",
            "1731-9": "Yavapai",
            "1733-5": "Coast Yurok",
            "1739-2": "Alaskan Athabascan",
            "1811-9": "Southeast Alaska",
            "1842-4": "Greenland Eskimo",
            "1844-0": "Inupiat Eskimo",
            "1891-1": "Siberian Eskimo",
            "1896-0": "Yupik Eskimo",
            "1968-7": "Alutiiq Aleut",
            "1972-9": "Bristol Bay Aleut",
            "1984-4": "Chugach Aleut",
            "1990-1": "Eyak",
            "1992-7": "Koniag Aleut",
            "2002-4": "Sugpiaq",
            "2004-0": "Suqpigaq",
            "2006-5": "Unangan Aleut",
            "1740-0": "Ahtna",
            "1741-8": "Alatna",
            "1742-6": "Alexander",
            "1743-4": "Allakaket",
            "1744-2": "Alanvik",
            "1745-9": "Anvik",
            "1746-7": "Arctic",
            "1747-5": "Beaver",
            "1748-3": "Birch Creek",
            "1749-1": "Cantwell",
            "1750-9": "Chalkyitsik",
            "1751-7": "Chickaloon",
            "1752-5": "Chistochina",
            "1753-3": "Chitina",
            "1754-1": "Circle",
            "1755-8": "Cook Inlet",
            "1756-6": "Copper Center",
            "1757-4": "Copper River",
            "1758-2": "Dot Lake",
            "1759-0": "Doyon",
            "1760-8": "Eagle",
            "1761-6": "Eklutna",
            "1762-4": "Evansville",
            "1763-2": "Fort Yukon",
            "1764-0": "Gakona",
            "1765-7": "Galena",
            "1766-5": "Grayling",
            "1767-3": "Gulkana",
            "1768-1": "Healy Lake",
            "1769-9": "Holy Cross",
            "1770-7": "Hughes",
            "1771-5": "Huslia",
            "1772-3": "Iliamna",
            "1773-1": "Kaltag",
            "1774-9": "Kluti Kaah",
            "1775-6": "Knik",
            "1776-4": "Koyukuk",
            "1777-2": "Lake Minchumina",
            "1778-0": "Lime",
            "1779-8": "Mcgrath",
            "1780-6": "Manley Hot Springs",
            "1781-4": "Mentasta Lake",
            "1782-2": "Minto",
            "1783-0": "Nenana",
            "1784-8": "Nikolai",
            "1785-5": "Ninilchik",
            "1786-3": "Nondalton",
            "1787-1": "Northway",
            "1788-9": "Nulato",
            "1789-7": "Pedro Bay",
            "1790-5": "Rampart",
            "1791-3": "Ruby",
            "1792-1": "Salamatof",
            "1793-9": "Seldovia",
            "1794-7": "Slana",
            "1795-4": "Shageluk",
            "1796-2": "Stevens",
            "1797-0": "Stony River",
            "1798-8": "Takotna",
            "1799-6": "Tanacross",
            "1800-2": "Tanaina",
            "1801-0": "Tanana",
            "1802-8": "Tanana Chiefs",
            "1803-6": "Tazlina",
            "1804-4": "Telida",
            "1805-1": "Tetlin",
            "1806-9": "Tok",
            "1807-7": "Tyonek",
            "1808-5": "Venetie",
            "1809-3": "Wiseman",
            "1813-5": "Tlingit-Haida",
            "1837-4": "Tsimshian",
            "1845-7": "Ambler",
            "1846-5": "Anaktuvuk",
            "1847-3": "Anaktuvuk Pass",
            "1848-1": "Arctic Slope Inupiat",
            "1849-9": "Arctic Slope Corporation",
            "1850-7": "Atqasuk",
            "1851-5": "Barrow",
            "1852-3": "Bering Straits Inupiat",
            "1853-1": "Brevig Mission",
            "1854-9": "Buckland",
            "1855-6": "Chinik",
            "1856-4": "Council",
            "1857-2": "Deering",
            "1858-0": "Elim",
            "1859-8": "Golovin",
            "1860-6": "Inalik Diomede",
            "1861-4": "Inupiaq",
            "1862-2": "Kaktovik",
            "1863-0": "Kawerak",
            "1864-8": "Kiana",
            "1865-5": "Kivalina",
            "1866-3": "Kobuk",
            "1867-1": "Kotzebue",
            "1868-9": "Koyuk",
            "1869-7": "Kwiguk",
            "1870-5": "Mauneluk Inupiat",
            "1871-3": "Nana Inupiat",
            "1872-1": "Noatak",
            "1873-9": "Nome",
            "1874-7": "Noorvik",
            "1875-4": "Nuiqsut",
            "1876-2": "Point Hope",
            "1877-0": "Point Lay",
            "1878-8": "Selawik",
            "1879-6": "Shaktoolik",
            "1880-4": "Shishmaref",
            "1881-2": "Shungnak",
            "1882-0": "Solomon",
            "1883-8": "Teller",
            "1884-6": "Unalakleet",
            "1885-3": "Wainwright",
            "1886-1": "Wales",
            "1887-9": "White Mountain",
            "1888-7": "White Mountain Inupiat",
            "1889-5": "Mary's Igloo",
            "1892-9": "Gambell",
            "1893-7": "Savoonga",
            "1894-5": "Siberian Yupik",
            "1897-8": "Akiachak",
            "1898-6": "Akiak",
            "1899-4": "Alakanuk",
            "1900-0": "Aleknagik",
            "1901-8": "Andreafsky",
            "1902-6": "Aniak",
            "1903-4": "Atmautluak",
            "1904-2": "Bethel",
            "1905-9": "Bill Moore's Slough",
            "1906-7": "Bristol Bay Yupik",
            "1907-5": "Calista Yupik",
            "1908-3": "Chefornak",
            "1909-1": "Chevak",
            "1910-9": "Chuathbaluk",
            "1911-7": "Clark's Point",
            "1912-5": "Crooked Creek",
            "1913-3": "Dillingham",
            "1914-1": "Eek",
            "1915-8": "Ekuk",
            "1916-6": "Ekwok",
            "1917-4": "Emmonak",
            "1918-2": "Goodnews Bay",
            "1919-0": "Hooper Bay",
            "1920-8": "Iqurmuit (Russian Mission)",
            "1921-6": "Kalskag",
            "1922-4": "Kasigluk",
            "1923-2": "Kipnuk",
            "1924-0": "Koliganek",
            "1925-7": "Kongiganak",
            "1926-5": "Kotlik",
            "1927-3": "Kwethluk",
            "1928-1": "Kwigillingok",
            "1929-9": "Levelock",
            "1930-7": "Lower Kalskag",
            "1931-5": "Manokotak",
            "1932-3": "Marshall",
            "1933-1": "Mekoryuk",
            "1934-9": "Mountain Village",
            "1935-6": "Naknek",
            "1936-4": "Napaumute",
            "1937-2": "Napakiak",
            "1938-0": "Napaskiak",
            "1939-8": "Newhalen",
            "1940-6": "New Stuyahok",
            "1941-4": "Newtok",
            "1942-2": "Nightmute",
            "1943-0": "Nunapitchukv",
            "1944-8": "Oscarville",
            "1945-5": "Pilot Station",
            "1946-3": "Pitkas Point",
            "1947-1": "Platinum",
            "1948-9": "Portage Creek",
            "1949-7": "Quinhagak",
            "1950-5": "Red Devil",
            "1951-3": "St. Michael",
            "1952-1": "Scammon Bay",
            "1953-9": "Sheldon's Point",
            "1954-7": "Sleetmute",
            "1955-4": "Stebbins",
            "1956-2": "Togiak",
            "1957-0": "Toksook",
            "1958-8": "Tulukskak",
            "1959-6": "Tuntutuliak",
            "1960-4": "Tununak",
            "1961-2": "Twin Hills",
            "1962-0": "Georgetown (Yupik-Eskimo)",
            "1963-8": "St. Mary's",
            "1964-6": "Umkumiate",
            "1969-5": "Tatitlek",
            "1970-3": "Ugashik",
            "1973-7": "Chignik",
            "1974-5": "Chignik Lake",
            "1975-2": "Egegik",
            "1976-0": "Igiugig",
            "1977-8": "Ivanof Bay",
            "1978-6": "King Salmon",
            "1979-4": "Kokhanok",
            "1980-2": "Perryville",
            "1981-0": "Pilot Point",
            "1982-8": "Port Heiden",
            "1985-1": "Chenega",
            "1986-9": "Chugach Corporation",
            "1987-7": "English Bay",
            "1988-5": "Port Graham",
            "1993-5": "Akhiok",
            "1994-3": "Agdaagux",
            "1995-0": "Karluk",
            "1996-8": "Kodiak",
            "1997-6": "Larsen Bay",
            "1998-4": "Old Harbor",
            "1999-2": "Ouzinkie",
            "2000-8": "Port Lions",
            "2007-3": "Akutan",
            "2008-1": "Aleut Corporation",
            "2009-9": "Aleutian",
            "2010-7": "Aleutian Islander",
            "2011-5": "Atka",
            "2012-3": "Belkofski",
            "2013-1": "Chignik Lagoon",
            "2014-9": "King Cove",
            "2015-6": "False Pass",
            "2016-4": "Nelson Lagoon",
            "2017-2": "Nikolski",
            "2018-0": "Pauloff Harbor",
            "2019-8": "Qagan Toyagungin",
            "2020-6": "Qawalangin",
            "2021-4": "St. George",
            "2022-2": "St. Paul",
            "2023-0": "Sand Point",
            "2024-8": "South Naknek",
            "2025-5": "Unalaska",
            "2026-3": "Unga",
            "1814-3": "Angoon",
            "1815-0": "Central Council of Tlingit and Haida Tribes",
            "1816-8": "Chilkat",
            "1817-6": "Chilkoot",
            "1818-4": "Craig",
            "1819-2": "Douglas",
            "1820-0": "Haida",
            "1821-8": "Hoonah",
            "1822-6": "Hydaburg",
            "1823-4": "Kake",
            "1824-2": "Kasaan",
            "1825-9": "Kenaitze",
            "1826-7": "Ketchikan",
            "1827-5": "Klawock",
            "1828-3": "Pelican",
            "1829-1": "Petersburg",
            "1830-9": "Saxman",
            "1831-7": "Sitka",
            "1832-5": "Tenakee Springs",
            "1833-3": "Tlingit",
            "1834-1": "Wrangell",
            "1835-8": "Yakutat",
            "1838-2": "Metlakatla",
            "2135-2": "Hispanic or Latino"
        }
    },
    "2.16.840.1.113883.3.26.1.1": {
        name: "Medication Route FDA",
        table: {
            "C38192": "AURICULAR (OTIC)",
            "C38193": "BUCCAL",
            "C38194": "CONJUNCTIVAL",
            "C38675": "CUTANEOUS",
            "C38197": "DENTAL",
            "C38633": "ELECTRO-OSMOSIS",
            "C38205": "ENDOCERVICAL",
            "C38206": "ENDOSINUSIAL",
            "C38208": "ENDOTRACHEAL",
            "C38209": "ENTERAL",
            "C38210": "EPIDURAL",
            "C38211": "EXTRA-AMNIOTIC",
            "C38212": "EXTRACORPOREAL",
            "C38200": "HEMODIALYSIS",
            "C38215": "INFILTRATION",
            "C38219": "INTERSTITIAL",
            "C38220": "INTRA-ABDOMINAL",
            "C38221": "INTRA-AMNIOTIC",
            "C38222": "INTRA-ARTERIAL",
            "C38223": "INTRA-ARTICULAR",
            "C38224": "INTRABILIARY",
            "C38225": "INTRABRONCHIAL",
            "C38226": "INTRABURSAL",
            "C38227": "INTRACARDIAC",
            "C38228": "INTRACARTILAGINOUS",
            "C38229": "INTRACAUDAL",
            "C38230": "INTRACAVERNOUS",
            "C38231": "INTRACAVITARY",
            "C38232": "INTRACEREBRAL",
            "C38233": "INTRACISTERNAL",
            "C38234": "INTRACORNEAL",
            "C38217": "INTRACORONAL, DENTAL",
            "C38218": "INTRACORONARY",
            "C38235": "INTRACORPORUS CAVERNOSUM",
            "C38238": "INTRADERMAL",
            "C38239": "INTRADISCAL",
            "C38240": "INTRADUCTAL",
            "C38241": "INTRADUODENAL",
            "C38242": "INTRADURAL",
            "C38243": "INTRAEPIDERMAL",
            "C38245": "INTRAESOPHAGEAL",
            "C38246": "INTRAGASTRIC",
            "C38247": "INTRAGINGIVAL",
            "C38249": "INTRAILEAL",
            "C38250": "INTRALESIONAL",
            "C38251": "INTRALUMINAL",
            "C38252": "INTRALYMPHATIC",
            "C38253": "INTRAMEDULLARY",
            "C38254": "INTRAMENINGEAL",
            "C28161": "INTRAMUSCULAR",
            "C38255": "INTRAOCULAR",
            "C38256": "INTRAOVARIAN",
            "C38257": "INTRAPERICARDIAL",
            "C38258": "INTRAPERITONEAL",
            "C38259": "INTRAPLEURAL",
            "C38260": "INTRAPROSTATIC",
            "C38261": "INTRAPULMONARY",
            "C38262": "INTRASINAL",
            "C38263": "INTRASPINAL",
            "C38264": "INTRASYNOVIAL",
            "C38265": "INTRATENDINOUS",
            "C38266": "INTRATESTICULAR",
            "C38267": "INTRATHECAL",
            "C38207": "INTRATHORACIC",
            "C38268": "INTRATUBULAR",
            "C38269": "INTRATUMOR",
            "C38270": "INTRATYMPANIC",
            "C38272": "INTRAUTERINE",
            "C38273": "INTRAVASCULAR",
            "C38276": "INTRAVENOUS",
            "C38277": "INTRAVENTRICULAR",
            "C38278": "INTRAVESICAL",
            "C38280": "INTRAVITREAL",
            "C38203": "IONTOPHORESIS",
            "C38281": "IRRIGATION",
            "C38282": "LARYNGEAL",
            "C38284": "NASAL",
            "C38285": "NASOGASTRIC",
            "C48623": "NOT APPLICABLE",
            "C38286": "OCCLUSIVE DRESSING TECHNIQUE",
            "C38287": "OPHTHALMIC",
            "C38288": "ORAL",
            "C38289": "OROPHARYNGEAL",
            "C38291": "PARENTERAL",
            "C38676": "PERCUTANEOUS",
            "C38292": "PERIARTICULAR",
            "C38677": "PERIDURAL",
            "C38293": "PERINEURAL",
            "C38294": "PERIODONTAL",
            "C38295": "RECTAL",
            "C38216": "RESPIRATORY (INHALATION)",
            "C38296": "RETROBULBAR",
            "C38198": "SOFT TISSUE",
            "C38297": "SUBARACHNOID",
            "C38298": "SUBCONJUNCTIVAL",
            "C38299": "SUBCUTANEOUS",
            "C38300": "SUBLINGUAL",
            "C38301": "SUBMUCOSAL",
            "C38304": "TOPICAL",
            "C38305": "TRANSDERMAL",
            "C38283": "TRANSMUCOSAL",
            "C38307": "TRANSPLACENTAL",
            "C38308": "TRANSTRACHEAL",
            "C38309": "TRANSTYMPANIC",
            "C38312": "URETERAL",
            "C38271": "URETHRAL"
        }
    },
    "2.16.840.1.113883.11.20.9.33": {
        name: "IND Roleclass Codes",
        uri: "",
        code_system: "2.16.840.1.113883.5.110",
        table: {
            "PRS": "Personal Relationship",
            "NOK": "Next of Kin",
            "CAREGIVER": "Caregiver",
            "AGNT": "Agent",
            "GUAR": "Guarantor",
            "ECON": "Emergency Contact"
        }
    },
    "2.16.840.1.113883.5.139": {
        name: "Domain TimingEvent",
        table: {
            //https://groups.google.com/forum/#!msg/ccda_samples/WawmwNMYT_8/pqnp5bG1IygJ
            "AC": "before meal",
            "ACD": "before lunch",
            "ACM": "before breakfast",
            "ACV": "before dinner",
            "C": "with meal",
            "CD": "with lunch",
            "CM": "with breakfast",
            "CV": "with dinner",
            "HS": "at bedtime",
            "IC": "between meals",
            "ICD": "between lunch and dinner",
            "ICM": "between breakfast and lunch",
            "ICV": "between dinner and bedtime",
            "PC": "after meal",
            "PCD": "after lunch",
            "PCM": "after breakfast",
            "PCV": "after dinner",
            "WAKE": "upon waking"
        }
    },
    "2.16.840.1.113883.6.14": {
        name: "HCPCS",
        uri: ""
    },
    "2.16.840.1.113883.3.88.12.3221.8.9": {
        name: "Body Site Value Set"
    },
    "2.16.840.1.113883.5.7": {
        name: "ActPriority"
    }
};

},{}],"blue-button-generate":[function(require,module,exports){
"use strict";

/*
This script converts CCDA data in JSON format (originally generated from a Continuity of Care Document (CCD) in 
standard XML/CCDA format) back to XML/CCDA format.
*/

var engine = require('./lib/engine');
var documentLevel = require('./lib/documentLevel');

var createContext = (function () {
    var base = {
        nextReference: function (referenceKey) {
            var index = this.references[referenceKey] || 0;
            ++index;
            this.references[referenceKey] = index;
            return "#" + referenceKey + index;
        },
        sameReference: function (referenceKey) {
            var index = this.references[referenceKey] || 0;
            return "#" + referenceKey + index;
        }
    };

    return function () {
        var result = Object.create(base);
        result.references = {};
        return result;
    };
})();

var generate = exports.generate = function (template, input) {
    var context = createContext();
    return engine.create(documentLevel.ccd, input, context);
};

exports.generateCCD = function (input) {
    var data = input.data ? input.data : input;
    data.identifiers = input.meta && input.meta.identifiers;
    return generate(documentLevel.ccd, data);
};

},{"./lib/documentLevel":4,"./lib/engine":5}]},{},["blue-button-generate"]);
