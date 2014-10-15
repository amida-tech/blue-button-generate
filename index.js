/*
This script converts CCDA data in JSON format (originally generated from a Continuity of Care Document (CCD) in 
standard XML/CCDA format) back to XML/CCDA format.
*/

var js2xml = require('./lib/js2xml');
var documentLevel = require('./lib/documentLevel');

var createContext = (function () {
    var base = {
        getReference: function (referenceKey) {
            var index = this.references[referenceKey] || 0;
            ++index;
            this.references[referenceKey] = index;
            return "#" + referenceKey + index;
        }
    };

    return function () {
        var result = Object.create(base);
        result.references = {};
        return result;
    };
})();

var generate = function (input) {
    var data = input.data ? input.data : input;
    data.identifiers = input.meta && input.meta.identifiers;

    var context = createContext();

    return js2xml.create(documentLevel.ccd, data, context);
};

module.exports = generate;
