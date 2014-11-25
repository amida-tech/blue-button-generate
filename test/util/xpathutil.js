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
    "removeNode": function (node) {
        node.remove();
    },
    "removeAttribute": function (node, attr) {
        var attrNode = node.attr(attr);
        if (attrNode) {
            attrNode.remove();
        }
    },
    addAttribute: function (node, params) {
        node.attr(params);
    },
    "normalizeTelNumber": function (node) {
        var attrNode = node.attr('value');
        if (attrNode) {
            var value = attrNode.value().toString();
            if (value.substring(0, 4) !== 'tel:') {
                var newValue = 'tel:' + value;
                attrNode.value(newValue);
            }
        }
    },
    "flatten": function (node, tid) {
        var childrenPath = pathConstructor.localTemplate(tid);
        var newChildren = node.find(childrenPath, ns).map(function (v) {
            var newChild = v.clone();
            v.remove();
            return newChild;
        });
        var p = node.parent();
        newChildren.forEach(function (newChild) {
            p.addChild(newChild);
        });
    },
    "removeTimezone": function (node) {
        var attrNode = node.attr('value');
        if (attrNode) {
            var t = attrNode.value().toString();
            var newT = t.slice(0, 8); // Ignore time for now
            attrNode.value(newT);
        }
    },
    "removeZeros": function (node) {
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
    replaceText: function (node, map) {
        var text = node.text();
        var replacementText = map[text];
        if (replacementText) {
            node.text(replacementText);
        }
    }
};

var sortModications = function (modifications) {
    var grouped = modifications.reduce(function (r, mod) {
        var action = mod.action;
        var group = r[action];
        if (!group) {
            group = r[action] = [];
        }
        group.push(mod);
        return r;
    }, {});
    return ['removeNode', 'removeAttribute', 'flatten', 'addAttribute', 'normalizeTelNumber', 'removeTimezone', 'removeZeros', 'replaceText'].reduce(function (r, name) {
        var groupMods = grouped[name];
        if (groupMods) {
            r = r.concat(groupMods);
        }
        return r;
    }, []);
};

var doModifications = function doModifications(xmlDoc, modifications) {
    var sorted = sortModications(modifications);
    sorted.forEach(function (modification) {
        var pathType = modification.type || "normal";
        var path = pathConstructor[pathType](modification.xpath);
        var nodes = xmlDoc.find(path, ns);
        nodes.forEach(function (node) {
            var execType = modification.action;
            actionExecuter[execType](node, modification.params);
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
