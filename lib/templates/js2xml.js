"use strict";

var libxmljs = require("libxmljs");
var _ = require("underscore");

var newNode = function (xmlDoc, name, text) {
    if ((text === undefined) || (text === null)) {
        return xmlDoc.node(name);
    } else {
        return xmlDoc.node(name, text);
    }
};

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

var expandAttributes = function expandAttributes(input, attrObj, attrs) {
    if (Array.isArray(attrObj)) {
        attrObj.forEach(function (attrObjElem) {
            expandAttributes(input, attrObjElem, attrs);
        });
    } else if (typeof attrObj === 'function') {
        expandAttributes(input, attrObj(input), attrs);
    } else {
        Object.keys(attrObj).forEach(function (attrKey) {
            var attrVal = attrObj[attrKey];
            if (typeof attrVal === 'function') {
                attrVal = attrVal(input);
            }
            if (attrVal) {
                attrs[attrKey] = attrVal;
            }
        });
    }
};

var fillAttributes = function (node, input, template) {
    var attrObj = template.attributes;
    if (attrObj && input) {
        var inputAttrKey = template.attributeKey;
        if (inputAttrKey) {
            input = input[inputAttrKey];
        }
        if (input) {
            var attrs = {};
            expandAttributes(input, attrObj, attrs);
            node.attr(attrs);
        }
    }
};

var fillUsingTemplate;

var fillSingleUsingTemplate = function fillSingleUsingTemplate(xmlDoc, input, name, template) {
    var condition = template.existsWhen;
    if ((!condition) || condition(input)) {

        var text = expandText(input, template);
        var node = newNode(xmlDoc, name, text);

        if ((typeof template) === 'function') {
            template = template(input);
        }

        fillAttributes(node, input, template);

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
        var inputKey = template.dataKey;
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
    if ((!filled) && template.required) { // required
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
