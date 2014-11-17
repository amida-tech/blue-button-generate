"use strict";

exports.newDocument = function () {
	return document.implementation.createDocument("", "", null);
};

exports.newNode = function (xmlDoc, name, text) {
	var doc =  xmlDoc.ownerDocument || xmlDoc;

	var element = doc.createElement(name);
	if ((text !== undefined) && (text !== null)) {
		var textNode = doc.createTextNode(text);
		element.appendChild(textNode);
	}
	if (xmlDoc.ownerDocument) {
		xmlDoc.appendChild(element);
	}
	return element;
};

exports.nodeAttr = function (node, attr) {
	Object.keys(attr).forEach(function(key) {
		var value = attr[key];
		node.setAttribute(key, value);
	});
};
