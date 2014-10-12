"use strict";

var libxmljs = require('libxmljs');

var jsonutil = require('./jsonutil');

var ns = {
    "h": "urn:hl7-org:v3",
    "xsi": "http://www.w3.org/2001/XMLSchema-instance"
};

var templateIdPath = function (templateId, prefix, postfix) {
    var p = '//h:templateId[@root="' + templateId + '"]/..';
    if (prefix) {
        p = prefix + p;
    }
    if (postfix) {
        p = p + postfix;
    }
    return p;
};

var templateIdPathFromSpec = function (spec, prefix, postfix) {
    if (Array.isArray(spec)) {
        var paths = spec.map(function (templateId) {
            return templateIdPath(templateId, prefix, postfix);
        });
        return paths.join(' | ');
    } else {
        return templateIdPath(spec, prefix, postfix);
    }
};

var pathConstructor = {
    'rootTemplate': function (value) {
        return templateIdPathFromSpec(value);
    },
    'localTemplateParent': function (value) {
        return templateIdPathFromSpec(value, '.', '/..');
    },
    'localTemplate': function (value) {
        return templateIdPathFromSpec(value, '.');
    },
    "normal": function (value) {
        return value;
    }
};

var actionExecuter = {
    "removeNode": function (parent, node) {
        node.remove();
    },
    "removeAttribute": function (parent, node, attr) {
        var attrNode = node.attr(attr);
        attrNode.remove();
    },
    "addAttribute": function (parent, node, params) {
        var attrs = {};
        attrs[params[0]] = params[1];
        node.attr(attrs);
    },
    "normalizeTelNumber": function (parent, node) {
        var attrNode = node.attr('value');
        if (attrNode) {
            var value = attrNode.value().toString();
            if (value.substring(0, 4) !== 'tel:') {
                var newValue = 'tel:' + value;
                attrNode.value(newValue);
            }
        }
    },
    "flatten": function (parent, node, tid) {
        var childrenPath = pathConstructor["localTemplate"](tid);
        var newChildren = node.find(childrenPath, ns).map(function (v) {
            return v.clone();
        });
        newChildren.forEach(function (newChild) {
            parent.addChild(newChild);
        });
    },
    "removeTimezone": function (parent, node) {
        var attrNode = node.attr('value');
        if (attrNode) {
            var t = attrNode.value().toString();
            if (t.length > 14) {
                var index = t.indexOf('-');
                if (index < 0) {
                    index = t.indexOf('+');
                }
                if ((index > 12) && (index + 5) === t.length) {
                    var newT = t.slice(0, index);
                    attrNode.value(newT);
                }
            }
        }
    },
    "removeZeros": function (parent, node) {
        var attrNode = node.attr('value');
        if (attrNode) {
            var v = attrNode.value().toString();
            var n = v.length;
            var index = v.indexOf('.0');
            if ((index >= 0) && ((index + 2) === n)) {
                v = v.slice(0, index);
                attrNode.value(v);
            } else if ((v.charAt(n - 1) === '0') && (v.indexOf('.') >= 0)) {
                v = v.slice(0, n - 1);
                attrNode.value(v);
            } else if (v === '00') {
                attrNode.value('0');
            }
        }
    },
    replaceText: function (parent, node, map) {
        var text = node.text();
        var replacementText = map[text];
        if (replacementText) {
            node.text(replacementText);
        }
    }
};

var doModifications = function doModifications(xmlDoc, modifications) {
    modifications.forEach(function (modification) {
        var pathType = modification.type || "normal";
        var path = pathConstructor[pathType](modification.xpath);
        var nodes = xmlDoc.find(path, ns);
        nodes.forEach(function (node) {
            if (modification.childxpaths) {
                doModifications(node, modification.childxpaths);
            } else {
                var execType = modification.action || "removeNode";
                actionExecuter[execType](xmlDoc, node, modification.params);
            }
        });
    });
};

exports.modifyXML = function (xml, modifications) {
    var xmlDoc = libxmljs.parseXmlString(xml, {
        noblanks: true
    });
    doModifications(xmlDoc, modifications);
    var result = xmlDoc.toString();
    return result;
};
