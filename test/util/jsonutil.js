"use strict";

var path = require('path');
var fs = require('fs');

var orderByTemplateId = function (input) {
    var elementsPerTID = input.reduce(function (r, element) {
        var subElement = element['observation'] || element['supply'] || element['act'];
        if (subElement) {
            var templateNode = subElement[0] && subElement[0].templateId;
            if (templateNode) {
                var templateId = templateNode[0] && templateNode[0]['$'] && templateNode[0]['$'].root;
                if (templateId) {
                    if (!r[templateId]) {
                        r[templateId] = [];
                    }
                    r[templateId].push(element);
                    return r;
                }
            }
        }
        if (!r.unknown) {
            r.unknown = [];
        }
        r.unknown.push(element);
        return r;
    }, {});
    var templateIds = Object.keys(elementsPerTID);
    templateIds.sort();
    var result = templateIds.reduce(function (r, templateId) {
        r = r.concat(elementsPerTID[templateId]);
        return r;
    }, []);
    return result;
};

var orderByKeys = exports.orderByKeys = function orderByKeys(input, parentKey) {
    if (Array.isArray(input)) {
        if (parentKey === 'entryRelationship') {
            input = orderByTemplateId(input);
        }
        var aresult = input.map(function (element) {
            if (element && (typeof element === 'object')) {
                return orderByKeys(element);
            } else {
                return element;
            }
        });
        return aresult;
    } else {
        var result = {};
        var keys = Object.keys(input);
        keys.sort();
        keys.forEach(function (key) {
            if (input[key] && (typeof input[key] === 'object')) {
                result[key] = orderByKeys(input[key], key);
            } else {
                result[key] = input[key];
            }
        });
        return result;
    }
};

exports.getDeepValue = function (root, path) {
    var keys = path.split('.');
    var node = root;
    keys.forEach(function (key) {
        if (node.hasOwnProperty(key)) {
            node = node[key];
        } else {
            node = null;
        }
        if ((node === undefined) || (node === null)) {
            return null;
        }
    });
    return node;
};

exports.fileToJSON = function (directory, filename) {
    var p = path.join(directory, filename);
    var content = fs.readFileSync(p);
    var result = JSON.parse(content);
    return result;
};

exports.JSONToFile = function (json, directory, filename) {
    var p = path.join(directory, filename);
    var content = JSON.stringify(json, null, 2);
    fs.writeFileSync(p, content);
};
