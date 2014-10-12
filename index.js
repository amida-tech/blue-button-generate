/*
This script converts CCDA data in JSON format (originally generated from a Continuity of Care Document (CCD) in 
standard XML/CCDA format) back to XML/CCDA format.
*/

var js2xml = require('./lib/templates/js2xml');
var documentLevel = require('./lib/documentLevel');

var generate = function (input) {
    var data = input.data ? input.data : input;
    data.identifiers = input.meta && input.meta.identifiers;

    return js2xml.create(documentLevel.ccd, data);
};

module.exports = generate;
