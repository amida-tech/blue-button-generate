var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require("fs");
var path = require('path');
var bb = require('blue-button');
var bbg = require('../../index');

describe('parse generate parse generate', function () {
    this.timeout(10000);
    var generatedDir = null;

    before(function () {
        generatedDir = path.join(__dirname, "../fixtures/files/generated");
        expect(generatedDir).to.exist;
    });

    it('verifying basic generation still works', function () {
        var data = fs.readFileSync(__dirname + "/../fixtures/files/ccda_xml/CCD_1.xml").toString();
        var result = bb.parseString(data);

        // check validation
        var val = bb.validator.validateDocumentModel(result);
        expect(val).to.be.true;

        // generate ccda
        var xml = bbg.generateCCD(result);

        assert.ok(xml);
    });

});
