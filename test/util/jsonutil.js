"use strict";

var path = require('path');
var fs = require('fs');

var orderByKeys = exports.orderByKeys = function orderByKeys(input) {
    var result = {};
    var keys = Object.keys(input);
    keys.sort();
    keys.forEach(function (key) {
        if (input[key] && (typeof input[key] === 'object')) {
            result[key] = orderByKeys(input[key]);
        } else {
            result[key] = input[key];
        }
    });
    return result;
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

exports.JSONToOrderedFile = function (json, directory, filename) {
    var orderedJson = orderByKeys(json);
    var p = path.join(directory, filename);
    var content = JSON.stringify(orderedJson, null, 2);
    fs.writeFileSync(p, content);
};
