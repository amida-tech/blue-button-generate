"use strict";

/*
This script converts CCDA data in JSON format (originally generated from a Continuity of Care Document (CCD) in 
standard XML/CCDA format) back to XML/CCDA format.
*/

var engine = require('./lib/engine');
var documentLevel = require('./lib/documentLevel');

var createContext = (function () {
    var base = {
        nextReference: function (referenceKey) {
            var index = this.references[referenceKey] || 0;
            ++index;
            this.references[referenceKey] = index;
            return "#" + referenceKey + index;
        },
        sameReference: function (referenceKey) {
            var index = this.references[referenceKey] || 0;
            return "#" + referenceKey + index;
        }
    };

    return function () {
        var result = Object.create(base);
        result.references = {};
        return result;
    };
})();

var generate = exports.generate = function (template, input) {
    var context = createContext();
    return engine.create(documentLevel.ccd, input, context);
};

exports.generateCCD = function (input) {
    var data = input.data ? input.data : input;
    data.identifiers = input.meta && input.meta.identifiers;
    return generate(documentLevel.ccd, data);
};
