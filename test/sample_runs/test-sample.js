var fs = require("fs");
var path = require('path');
var bb = require('@amida-tech/blue-button');
var bbg = require('../../index');

describe('parse generate parse generate', function () {
  var generatedDir = null;

  beforeAll(function () {
    generatedDir = path.join(__dirname, "../fixtures/files/generated");
    expect(generatedDir).toBeDefined();
  });

  it('verifying basic generation still works', function () {
    var data = fs.readFileSync(__dirname + "/../fixtures/files/ccda_xml/CCD_1.xml").toString();
    var result = bb.parseString(data);

    // check validation
    var val = bb.validator.validateDocumentModel(result);
    expect(val).toBe(true);

    // generate ccda
    var xml = bbg.generateCCD(result);

    fs.writeFileSync(generatedDir + '/CCD_1.xml', xml);

    expect(xml).toBeTruthy();
  });

});
