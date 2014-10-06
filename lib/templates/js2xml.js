"use strict";

var libxmljs = require("libxmljs");

var startsWithLetter = function (value) {
    var code = value.charCodeAt(0);
    return (code > 64 && code < 91) || (code > 96 && code < 123);
};

var newNode = function (xmlDoc, name, content) {
    if ((content === undefined) || (content === null)) {
        return xmlDoc.node(name);
    } else {
        return xmlDoc.node(name, content);
    }
};

var fillAttributes = function (node, input, attributes) {
    if (typeof attributes === 'function') {
        attributes = attributes(input);
    }
    if (attributes) {
        var definedAttributes = Object.keys(attributes).reduce(function (r, attrKey) {
            var attrVal = attributes[attrKey];
            if (typeof attrVal === 'function') {
                attrVal = attrVal(input);
            }
            if (attrVal) {
                if (startsWithLetter(attrKey)) {
                    r[attrKey] = attrVal;
                } else if (attrKey !== '#') {
                    Object.keys(attrVal).forEach(function (attrValKey) {
                        var v = attrVal[attrValKey];
                        if (v) {
                            r[attrValKey] = v;
                        }
                    });
                }
            }
            return r;
        }, {});
        node.attr(definedAttributes);
    }
};

var fillAttributesUsingSpec = function (node, input, attrSpec) {
    var inputKey = attrSpec['#'];
    if (inputKey) {
        input = input[inputKey];
    }
    if (input) {
        fillAttributes(node, input, attrSpec);
    }
};

var fillUsingTemplate;

var fillSingleUsingTemplate = function fillSingleUsingTemplate(xmlDoc, input, name, template) {
    var condition = template['+'];
    if ((!condition) || condition(input)) {

        var node = newNode(xmlDoc, name, template['_']);

        if ((typeof template) === 'function') {
            template = template(input);
        }

        var attrSpec = template['$'];
        fillAttributesUsingSpec(node, input, attrSpec);

        if (template.content) {
            var childNodeNames = Object.keys(template.content);
            childNodeNames.forEach(function (childNodeName) {
                var childNode = template.content ? template.content[childNodeName] : template[childNodeName];
                fillUsingTemplate(node, input, childNodeName, childNode);
            });
        }
        return true;
    } else {
        return false;
    }
};

fillUsingTemplate = exports.fillUsingTemplate = function (xmlDoc, input, name, template) {
    var filled = false;
    if (input) {
        var inputKey = template['#'];
        if (inputKey) {
            input = input[inputKey];
        }
        if (input) {
            if (Array.isArray(input)) {
                input.forEach(function (element) {
                    filled = fillSingleUsingTemplate(xmlDoc, element, name, template) || filled;
                });
            } else {
                filled = fillSingleUsingTemplate(xmlDoc, input, name, template);
            }
        }
    }
    if ((!filled) && template['*']) { // required
        var node = newNode(xmlDoc, name);
        fillAttributes(node, null, {
            nullFlavor: 'UNK'
        });
    }
};

exports.update = function (xmlDoc, input, template) {
    if (typeof template === 'function') {
        template = template(input);
    }
    Object.keys(template).forEach(function (key) {
        fillUsingTemplate(xmlDoc, input, key, template[key]);
    });
};
