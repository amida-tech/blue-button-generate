"use strict";

var expect = require('chai').expect;

var fs = require("fs");
var path = require('path');
var mkdirp = require('mkdirp');
var bb = require('blue-button');
var bbg = require('../../index');

var jsonutil = require('../util/jsonutil');
var xml2jsutil = require('../util/xml2jsutil');

describe('xml vs parse generate xml ', function () {
    var generatedDir = null;
    var sampleDir = null;
    var modsDir = null;

    before(function () {
        generatedDir = path.join(__dirname, "../fixtures/files/generated");
        sampleDir = path.join(__dirname, "../fixtures/files/ccda_xml");
        modsDir = path.join(__dirname, "../xmlmods");
        mkdirp.sync(generatedDir);
        expect(generatedDir).to.exist;
        expect(sampleDir).to.exist;
        expect(modsDir).to.exist;
    });

    var testSampleFile = function (filename, validate, addlParserMods, addlGeneratorMods) {
        return function () {
            var xmlRaw;
            var xmlObj;
            var xmlGeneratedObj;

            it('read xml', function () {
                xmlRaw = fs.readFileSync(path.join(sampleDir, filename + '.xml')).toString();
                expect(xmlRaw).to.exist;

            });

            it('xml2js original', function (done) {
                var mods = jsonutil.fileToJSON(modsDir, 'blueButtonParser.json');
                if (addlParserMods) {
                    mods = mods.concat(addlParserMods);
                }
                xml2jsutil.modifyAndToObject(xmlRaw, mods, function (err, result) {
                    xmlObj = result;
                    done(err);
                });
            });

            it('xml2js generated', function (done) {
                var result = bb.parseString(xmlRaw);
                if (validate) {
                    var val = bb.validator.validateDocumentModel(result);
                    var err = bb.validator.getLastError();
                    expect(err.valid).to.be.true;
                }

                // generate ccda
                var xmlGeneratedRaw = bbg.genWholeCCDA(result).toString();

                var mods = jsonutil.fileToJSON(modsDir, 'blueButtonGenerator.json');
                if (addlGeneratorMods) {
                    mods = mods.concat(addlGeneratorMods);
                }
                xml2jsutil.modifyAndToObject(xmlGeneratedRaw, mods, function (err, result) {
                    xmlGeneratedObj = result;
                    done(err);
                });
            });

            it('process more', function () {
                xml2jsutil.processIntroducedCodeAttrs(xmlObj, xmlGeneratedObj);
                xml2jsutil.removeTimeZones(xmlObj);
            });

            var compareSection = function (section, sectionGenerated, baseName) {
                jsonutil.JSONToOrderedFile(section, generatedDir, "o_" + baseName + ".json");
                jsonutil.JSONToOrderedFile(sectionGenerated, generatedDir, "g_" + baseName + ".json");

                expect(sectionGenerated).to.deep.equal(section);
            };

            var templateIds = {
                'allergies': "2.16.840.1.113883.10.20.22.2.6",
                'medications': "2.16.840.1.113883.10.20.22.2.1",
                'immunizations': "2.16.840.1.113883.10.20.22.2.2",
                'procedures': "2.16.840.1.113883.10.20.22.2.7",
                'encounters': "2.16.840.1.113883.10.20.22.2.22",
                'payers': "2.16.840.1.113883.10.20.22.2.18",
                'plan_of_care': "2.16.840.1.113883.10.20.22.2.10",
                'problems': "2.16.840.1.113883.10.20.22.2.5",
                'social_history': "2.16.840.1.113883.10.20.22.2.17",
                'vitals': "2.16.840.1.113883.10.20.22.2.4",
                'results': "2.16.840.1.113883.10.20.22.2.3"
            };

            var findCompareSection = function (sectionName) {
                var f = function (ccd, templateId) {
                    var root = jsonutil.getDeepValue(ccd, 'ClinicalDocument.component.0.structuredBody.0.component');
                    expect(root).to.exist;
                    var result = xml2jsutil.findSection(root, templateId);
                    expect(result).to.exist;
                    return result;
                };

                var templateId = templateIds[sectionName];
                var section = f(xmlGeneratedObj, templateId);
                var sectionGenerated = f(xmlGeneratedObj, templateId);

                compareSection(section, sectionGenerated, filename + '_' + sectionName);
            };

            it('allergies', function () {
                findCompareSection('allergies');
            });

            it('medications', function () {
                findCompareSection('medications');
            });

            it('immunizations', function () {
                findCompareSection('immunizations');
            });

            it('procedures', function () {
                findCompareSection('procedures');
            });

            it('encounters', function () {
                findCompareSection('encounters');
            });

            it('payers', function () {
                findCompareSection('payers');
            });

            it('plan_of_care', function () {
                findCompareSection('plan_of_care');
            });

            it('problems', function () {
                findCompareSection('problems');
            });

            it('social_history', function () {
                findCompareSection('social_history');
            });

            it('vitals', function () {
                findCompareSection('vitals');
            });

            it('results', function () {
                findCompareSection('results');
            });

            it('demographics', function () {
                var f = function (obj) {
                    var result = jsonutil.getDeepValue(obj, 'ClinicalDocument.recordTarget.0.patientRole.0');
                    expect(result).to.exist;
                    return result;
                };

                var demographics = f(xmlObj);
                var demographicsGenerated = f(xmlGeneratedObj);
                compareSection(demographics, demographicsGenerated, filename + '_' + "demographics");
            });
        };
    };

    describe('CCD_1.xml', testSampleFile('CCD_1', true));
    describe('Vitera_CCDA_Smart_Sample', testSampleFile('Vitera_CCDA_Smart_Sample', false, [{
        "value": "//h:recordTarget/h:patientRole/h:patient/h:raceCode",
        "comment": "due to parser merging raceCode and ethnicGroupCode this is generated as ethnicGroupCode (#173)",
    }], [{
        "value": "//h:recordTarget/h:patientRole/h:patient/h:ethnicGroupCode",
        "comment": "due to parser merging raceCode and ethnicGroupCode original raceCode is converted to ethnicGroupCode (#173)"
    }, {
        "value": "//h:recordTarget/h:patientRole/h:patient/h:name[@use]",
        "action": "A",
        "params": "use",
        "comment": "parser does read @use and generator assumes it is always 'L'"
    }]));
});
