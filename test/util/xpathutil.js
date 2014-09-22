"use strict";

var ns = {
    "h": "urn:hl7-org:v3",
    "xsi": "http://www.w3.org/2001/XMLSchema-instance"
};

exports.remove = function (xmlDoc, xpath) {
    var nodes = xmlDoc.find(xpath, ns);
    nodes.forEach(function (node) {
        node.remove();
    });
};

exports.removeAttr = function (xmlDoc, xpath, attr) {
    var nodes = xmlDoc.find(xpath, ns);
    nodes.forEach(function (node) {
        var attrNode = node.attr(attr);
        attrNode.remove();
    });
};

var pathConstructor = {
    'TR': function (value) {
        return '//h:templateId[@root="' + value + '"]/..';
    },
    'T': function (value) {
        return './/h:templateId[@root="' + value + '"]/..';
    },
    'N': function (value) {
        return value;
    }
};

var actionExecuter = {
    'R': function (node) {
        node.remove();
    },
    'A': function (node, attr) {
        var attrNode = node.attr(attr);
        attrNode.remove();
    },
    'W': function (node) {
        var text = node.text();
        var newText = text.replace(/(\r\n|\n|\r|\t)/gm, " ").replace(/\s+/g, ' ').trim();
        node.text(newText);
    },
    "TEL": function (node) {
        var attrNode = node.attr('value');
        if (attrNode) {
            var value = attrNode.value().toString();
            if (value.substring(0, 4) !== 'tel:') {
                var newValue = 'tel:' + value;
                attrNode.value(newValue);
            }
        }
    }
};

exports.removeHierarchical = function removeHierarchical(xmlDoc, pathSpecs) {
    pathSpecs.forEach(function (pathSpec) {
        var t = pathSpec.type || 'N';
        var path = pathConstructor[t](pathSpec.value);
        var nodes = xmlDoc.find(path, ns);
        nodes.forEach(function (node) {
            if (pathSpec.subPathSpecs) {
                removeHierarchical(node, pathSpec.subPathSpecs);
            } else {
                var execType = pathSpec.action || 'R';
                actionExecuter[execType](node, pathSpec.params);
            }
        });
    });
};
