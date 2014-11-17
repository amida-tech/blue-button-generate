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
        var data = fs.readFileSync(__dirname + "/../fixtures/json/CCD_1.json").toString();
        var result = JSON.parse(data);

        // check validation
        var val = bb.validator.validateDocumentModel(result);
        expect(val).to.be.true;

        // generate ccda
        var xml = bbg.generateCCD(result);
        // write ccda
        fs.writeFileSync(path.join(generatedDir, "CCD_1_generated.xml"), xml);

        // parse generated ccda
        var result2 = bb.parseString(xml);
        var val2 = bb.validator.validateDocumentModel(result2);
        expect(val2).to.be.true;

        // write the parsed json from the generated ccda
        fs.writeFileSync(path.join(generatedDir, "CCD_1_generated_2.json"), JSON.stringify(result2, null, 4));

        // re-generate
        var xml2 = bbg.generateCCD(result2);
        fs.writeFileSync(path.join(generatedDir, "CCD_1_generated_2.xml"), xml2);

        delete result.errors;
        delete result2.errors;

        assert.deepEqual(result2, result);
    });

    it('Vitera_CCDA_SMART_Sample.xml should still be same', function () {
        var data = fs.readFileSync(__dirname + "/../fixtures/json/Vitera_CCDA_SMART_Sample.json").toString();
        var result = JSON.parse(data);

        // check validation
        var val = bb.validator.validateDocumentModel(result);

        // generate ccda
        var xml = bbg.generateCCD(result);
        // write ccda
        fs.writeFileSync(path.join(generatedDir, "Vitera_CCDA_SMART_Sample_generated.xml"), xml);

        // parse generated ccda
        var result2 = bb.parseString(xml);
        // write the parsed json from the generated ccda
        fs.writeFileSync(path.join(generatedDir, "Vitera_CCDA_SMART_Sample_generated_2.json"), JSON.stringify(result2, null, 4));

        // re-generate
        var xml2 = bbg.generateCCD(result2);
        fs.writeFileSync(path.join(generatedDir, "Vitera_CCDA_SMART_Sample_generated_2.xml"), xml2);

        delete result.errors;
        delete result2.errors;

        assert.deepEqual(result2, result);
    });

    it('VA_CCD_Sample_File_Version_12_5_1.xml should still be same', function () {
        var data = fs.readFileSync(__dirname + "/../fixtures/json/VA_CCD_Sample_File_Version_12_5_1.json").toString();
        var result = JSON.parse(data);
        result.meta.sections.sort();

        // check validation
        var val = bb.validator.validateDocumentModel(result);

        // generate ccda
        var xml = bbg.generateCCD(result);
        // write ccda
        fs.writeFileSync(path.join(generatedDir, "VA_CCD_Sample_File_Version_12_5_1_generated.xml"), xml);

        // parse generated ccda
        var result2 = bb.parseString(xml);
        result2.meta.sections.sort();

        // write the parsed json from the generated ccda
        fs.writeFileSync(path.join(generatedDir, "VA_CCD_Sample_File_Version_12_5_1_generated_2.json"), JSON.stringify(result2, null, 4));

        // re-generate
        var xml2 = bbg.generateCCD(result2);
        fs.writeFileSync(path.join(generatedDir, "VA_CCD_Sample_File_Version_12_5_1_generated_2.xml"), xml2);

        delete result.errors;
        delete result2.errors;
        result.data.results.forEach(function (entry) {
            entry.results.forEach(function (r) {
                delete r.text;
            });
        });

        assert.deepEqual(result2, result);
    });

    it('SampleCCDDocument.xml should still be same', function () {
        var data = fs.readFileSync(__dirname + "/../fixtures/json/SampleCCDDocument.json").toString();
        var result = JSON.parse(data);
        result.meta.sections.sort();

        // check validation
        var val = bb.validator.validateDocumentModel(result);

        // generate ccda
        var xml = bbg.generateCCD(result);
        // write ccda
        fs.writeFileSync(path.join(generatedDir, "SampleCCDDocument_generated.xml"), xml);

        // parse generated ccda
        var result2 = bb.parseString(xml);
        result2.meta.sections.sort();

        // write the parsed json from the generated ccda
        fs.writeFileSync(path.join(generatedDir, "SampleCCDDocument_generated_2.json"), JSON.stringify(result2, null, 4));

        // re-generate
        var xml2 = bbg.generateCCD(result2);
        fs.writeFileSync(path.join(generatedDir, "SampleCCDDocument_generated_2.xml"), xml2);

        delete result.errors;
        delete result2.errors;
        delete result.data.providers;
        result.meta.sections = result.meta.sections.filter(function (v) {
            return v !== 'providers';
        });

        assert.deepEqual(result2, result);
    });

    it('cms_sample.xml should not crash', function () {
        var data = fs.readFileSync(__dirname + "/../fixtures/json/cms_sample.json").toString();
        var result = JSON.parse(data);

        // check validation
        var val = bb.validator.validateDocumentModel(result);

        // generate ccda
        var xml = bbg.generateCCD(result);
        // write ccda
        fs.writeFileSync(path.join(generatedDir, "cms_sample_generated.xml"), xml);

        // parse generated ccda
        var result2 = bb.parseString(xml);
        // write the parsed json from the generated ccda
        fs.writeFileSync(path.join(generatedDir, "cms_sample_generated_2.json"), JSON.stringify(result2, null, 4));

        // re-generate
        var xml2 = bbg.generateCCD(result2);
        fs.writeFileSync(path.join(generatedDir, "cms_sample_generated_2.xml"), xml2);

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

        // write generated json
        fs.writeFileSync(path.join(generatedDir, "CCD_1_generated_new.json"), JSON.stringify(result, null, 4));

        // check validation
        var val = bb.validator.validateDocumentModel(result);

        // generate ccda

        //console.log(result.demographics);
        var xml = bbg.generateCCD(result);

        // write ccda
        fs.writeFileSync(path.join(generatedDir, "CCD_1_generated_new.xml"), xml);

        // parse generated ccda
        var result2 = bb.parseString(xml);
        // write the parsed json from the generated ccda
        fs.writeFileSync(path.join(generatedDir, "CCD_1_generated_2_new.json"), JSON.stringify(result2, null, 4));

        // re-generate
        var xml2 = bbg.generateCCD(result2);
        fs.writeFileSync(path.join(generatedDir, "CCD_1_generated_2_new.xml"), xml2);

        delete result.errors;
        delete result2.errors;

        //assert.deepEqual(result2, result);
    });
});
