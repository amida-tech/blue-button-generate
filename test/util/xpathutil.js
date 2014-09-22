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
