"use strict";

/*
This script converts CCDA data in JSON format (originally generated from a Continuity of Care Document (CCD) in
standard XML/CCDA format) back to XML/CCDA format.
*/

var bbu = require("blue-button-util");

var engine = require('./lib/engine');
var documentLevel = require('./lib/documentLevel');

var bbuo = bbu.object;

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

    return function (options) {
        var result = Object.create(base);
        result.references = {};
        if (options.meta && options.addUniqueIds) {
            result.rootId = bbuo.deepValue(options.meta, 'identifiers.0.identifier');
        } else {
            result.rootId = null;
        }
        result.preventNullFlavor = options.preventNullFlavor;

        return result;
    };
})();

var generate = exports.generate = function (template, input, options) {
    var context = createContext(options);
    return engine.create(documentLevel.ccd, input, context);
};

exports.generateCCD = function (input, options) {
    options = options || {};
    options.meta = input.meta;
    return generate(documentLevel.ccd, input, options);
};
