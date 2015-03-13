var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require("fs");
var path = require('path');
var bb = require('blue-button');
var bbg = require('../../index');

describe('parse generate parse generate', function () {
    var generatedDir = null;

    before(function () {
        generatedDir = path.join(__dirname, "../fixtures/files/generated");
        expect(generatedDir).to.exist;
    });

    it('CCD_1 should still be same', function () {
        var data = fs.readFileSync(__dirname + "/../fixtures/files/ccda_xml/CCD_1.xml").toString();
        var result = bb.parseString(data);

        // check validation
        var val = bb.validator.validateDocumentModel(result);
        expect(val).to.be.true;

        // generate ccda
        var xml = bbg.generateCCD(result);

        // parse generated ccda
        var result2 = bb.parseString(xml);
        var val2 = bb.validator.validateDocumentModel(result2);
        expect(val2).to.be.true;

        // re-generate
        var xml2 = bbg.generateCCD(result2);

        delete result.errors;
        delete result2.errors;

        assert.deepEqual(result2, result);
    });

    it('Vitera_CCDA_SMART_Sample.xml should still be same', function () {
        var data = fs.readFileSync(__dirname + "/../fixtures/files/ccda_xml/Vitera_CCDA_SMART_Sample.xml").toString();
        var result = bb.parseString(data);

        // check validation
        var val = bb.validator.validateDocumentModel(result);

        // generate ccda
        var xml = bbg.generateCCD(result);

        // parse generated ccda
        var result2 = bb.parseString(xml);

        // re-generate
        var xml2 = bbg.generateCCD(result2);

        delete result.errors;
        delete result2.errors;

        assert.deepEqual(result2, result);
    });

    it('VA_CCD_Sample_File_Version_12_5_1.xml should still be same', function () {
        var data = fs.readFileSync(__dirname + "/../fixtures/files/ccda_xml/VA_CCD_Sample_File_Version_12_5_1.xml").toString();
        var result = bb.parseString(data);
        result.meta.sections.sort();

        // check validation
        var val = bb.validator.validateDocumentModel(result);

        // generate ccda
        var xml = bbg.generateCCD(result);

        // parse generated ccda
        var result2 = bb.parseString(xml);
        result2.meta.sections.sort();

        // re-generate
        var xml2 = bbg.generateCCD(result2);

        delete result.errors;
        delete result2.errors;

        assert.deepEqual(result2, result);
    });

    it('SampleCCDDocument.xml should still be same', function () {
        var data = fs.readFileSync(__dirname + "/../fixtures/files/ccda_xml/SampleCCDDocument.xml").toString();
        var result = bb.parseString(data);
        result.meta.sections.sort();

        // check validation
        var val = bb.validator.validateDocumentModel(result);

        // generate ccda
        var xml = bbg.generateCCD(result);

        // parse generated ccda
        var result2 = bb.parseString(xml);
        result2.meta.sections.sort();

        // re-generate
        var xml2 = bbg.generateCCD(result2);

        delete result.errors;
        delete result2.errors;
        delete result.data.providers;
        result.meta.sections = result.meta.sections.filter(function (v) {
            return v !== 'providers';
        });

        assert.deepEqual(result2, result);
    });

    it('cms_sample.xml should not crash', function () {
        var data = fs.readFileSync(__dirname + "/../fixtures/files/cms_txt/cms_sample.txt").toString();
        var result = bb.parseText(data);

        // check validation
        var val = bb.validator.validateDocumentModel(result);

        // generate ccda
        var xml = bbg.generateCCD(result);

        // parse generated ccda
        var result2 = bb.parseString(xml);

        // re-generate
        var xml2 = bbg.generateCCD(result2);

        delete result.errors;
        delete result2.errors;
        delete result.data.claims;
        delete result2.data.claims;
        delete result.data.plan_of_care;
        delete result2.data.plan_of_care;
        delete result.data.providers;
        delete result2.data.providers;

        assert.deepEqual(result2.data, result.data);
    });

    it('skewed sample data from app should still be same', function () {
        //var data = fs.readFileSync("./sample.JSON").toString();

        var data = fs.readFileSync(__dirname + "/../fixtures/json/sample.JSON");

        //convert string into JSON 
        var result = JSON.parse(data);

        // check validation
        var val = bb.validator.validateDocumentModel(result);

        // generate ccda

        //console.log(result.demographics);
        var xml = bbg.generateCCD(result);

        // parse generated ccda
        var result2 = bb.parseString(xml);

        // re-generate
        var xml2 = bbg.generateCCD(result2);

        delete result.errors;
        delete result2.errors;

        //assert.deepEqual(result2, result);
    });
});
