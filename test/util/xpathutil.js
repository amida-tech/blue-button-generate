"use strict";

var libxmljs = require('libxmljs');

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

// The order of actions in this list is important.  There is a bug in 
// libxmljs: if you access a node and later remove a parent or itself
// you get segmentation faults. See https://github.com/polotek/libxmljs/pull/163
var actions = [{
    key: "removeNode",
    implementation: function (node) {
        node.remove();
    }
}, {
    key: "removeAttribute",
    implementation: function (node, attr) {
        var attrNode = node.attr(attr);
        if (attrNode) {
            attrNode.remove();
        }
    }
}, {
    key: "flatten",
    implementation: function (node, tid) {
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
    }
}, {
    key: "addAttribute",
    implementation: function (node, params) {
        node.attr(params);
    }
}, {
    key: "addAttributeWhenEmpty",
    implementation: function (node, params) {
        var allEmpty = Object.keys(params).every(function (param) {
            var attrNode = node.attr(param);
            return !attrNode;
        });
        if (allEmpty) {
            node.attr(params);
        }
    }
}, {
    key: "normalizeTelNumber",
    implementation: function (node) {
        var attrNode = node.attr('value');
        if (attrNode) {
            var value = attrNode.value().toString();
            if (value.substring(0, 4) !== 'tel:') {
                var newValue = 'tel:' + value;
                attrNode.value(newValue);
            }
        }
    }
}, {
    key: "removeTimezone",
    implementation: function (node) {
        var attrNode = node.attr('value');
        if (attrNode) {
            var t = attrNode.value().toString();
            var newT = t.slice(0, 8); // Ignore time for now
            attrNode.value(newT);
        }
    }
}, {
    key: "removeZeros",
    implementation: function (node) {
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
    }
}, {
    key: "replaceText",
    implementation: function (node, map) {
        var text = node.text();
        var replacementText = map[text];
        if (replacementText) {
            node.text(replacementText);
        }
    }
}, {
    key: "normalize",
    implementation: function (node, params) {
        var attrNode = node.attr(params.attr);
        var value = attrNode.value();
        var replacementInfo = params.map[value];
        if (replacementInfo) {
            var replacementValue;
            if (typeof replacementInfo === 'object') {
                var srcAttrValue = node.attr(params.srcAttr).value();
                if (srcAttrValue === replacementInfo.src) {
                    replacementValue = replacementInfo.value;
                }
            } else {
                replacementValue = replacementInfo;
            }
            if (replacementValue) {
                attrNode.value(replacementValue);
            }
        }
    }
}];

var doModifications = (function () {
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
        return actions.reduce(function (r, action) {
            var key = action.key;
            var groupMods = grouped[key];
            if (groupMods) {
                r = r.concat(groupMods);
            }
            return r;
        }, []);
    };

    var actionMap = actions.reduce(function (r, action) {
        r[action.key] = action.implementation;
        return r;
    }, {});

    return function doModifications(xmlDoc, modifications) {
        var sorted = sortModications(modifications);
        sorted.forEach(function (modification) {
            var pathType = modification.type || "normal";
            var path = pathConstructor[pathType](modification.xpath);
            var nodes = xmlDoc.find(path, ns);
            nodes.forEach(function (node) {
                var actionKey = modification.action;
                actionMap[actionKey](node, modification.params);
            });
        });
    };
})();

exports.modifyXML = function (xml, modifications) {
    var xmlDoc = libxmljs.parseXmlString(xml, {
        noblanks: true
    });
    doModifications(xmlDoc, modifications);
    var result = xmlDoc.toString();
    return result;
};
