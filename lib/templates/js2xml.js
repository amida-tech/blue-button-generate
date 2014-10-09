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
    if (attrObj) {
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

var fillSingleUsingTemplate = function fillSingleUsingTemplate(xmlDoc, input, template) {
    var condition = template.existsWhen;
    if ((!condition) || condition(input)) {
        var name = template.key;
        var text = expandText(input, template);
        if (text || template.content || template.attributes) {
            var node = newNode(xmlDoc, name, text);

            fillAttributes(node, input, template);

            var content = template.content;
            if (content) {
                if (!Array.isArray(content)) {
                    content = [content];
                }
                content.forEach(function (element) {
                    fillUsingTemplate(node, input, element);
                });
            }
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
    var transform = template.dataTransform;
    if (transform) {
        input = transform(input);
    }
    return input;
};

fillUsingTemplate = exports.fillUsingTemplate = function (xmlDoc, input, template) {
    var filled = false;
    if (input) {
        input = transformInput(input, template);
        if (input) {
            if (Array.isArray(input)) {
                input.forEach(function (element) {
                    filled = fillSingleUsingTemplate(xmlDoc, element, template) || filled;
                });
            } else {
                filled = fillSingleUsingTemplate(xmlDoc, input, template);
            }
        }
    }
    if ((!filled) && template.required) {
        var node = newNode(xmlDoc, template.key);
        node.attr({
            nullFlavor: 'UNK'
        });
    }
};

exports.update = function (xmlDoc, input, template) {
    template.forEach(function (element) {
        fillUsingTemplate(xmlDoc, input, element);
    });
};
