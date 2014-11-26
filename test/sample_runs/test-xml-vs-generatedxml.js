"use strict";

var expect = require('chai').expect;

var fs = require("fs");
var path = require('path');
var bb = require('blue-button');
var bbg = require('../../index');

var jsonutil = require('../util/jsonutil');
var xml2jsutil = require('../util/xml2jsutil');

var bbParserMods = require('../xmlmods/bbParser');
var bbParserPostMods = require('../xmlmods/bbParserPost');
var bbGeneratorMods = require('../xmlmods/bbGenerator');
var bbGeneratorPostMods = require('../xmlmods/bbGeneratorPost');
var ccd1ParserMods = require('../xmlmods/ccd1Parser');
var ccd1GeneratorMods = require('../xmlmods/ccd1Generator');
var viteraParserMods = require('../xmlmods/viteraParser');
var viteraGeneratorMods = require('../xmlmods/viteraGenerator');

describe('xml vs parse generate xml ', function () {
    var generatedDir = null;
    var sampleDir = null;

    before(function () {
        generatedDir = path.join(__dirname, "../fixtures/files/generated");
        sampleDir = path.join(__dirname, "../fixtures/files/ccda_xml");
        expect(generatedDir).to.exist;
        expect(sampleDir).to.exist;
    });

    var testSampleFile = function (filename, validate, addlParserMods, addlGeneratorMods, limited) {
        return function () {
            var xmlRaw;
            var xmlObj;
            var xmlGeneratedObj;

            it('read xml', function () {
                xmlRaw = fs.readFileSync(path.join(sampleDir, filename + '.xml')).toString();
                expect(xmlRaw).to.exist;

            });

            it('xml2js original', function (done) {
                var mods = bbParserMods;
                if (addlParserMods) {
                    mods = mods.concat(addlParserMods);
                }
                mods = mods.concat(bbParserPostMods);
                xml2jsutil.modifyAndToObject(xmlRaw, mods, function (err, result) {
                    xmlObj = result;
                    done(err);
                });
            });

            it('xml2js generated', function (done) {
                var result = bb.parseString(xmlRaw);
                if (validate) {
                    var val = bb.validator.validateDocumentModel(result);
                    expect(val).to.be.true;
                }

                // generate ccda
                var xmlGeneratedRaw = bbg.generateCCD(result);

                var mods = bbGeneratorMods;
                if (addlGeneratorMods) {
                    mods = mods.concat(addlGeneratorMods);
                }
                mods = mods.concat(bbGeneratorPostMods);
                xml2jsutil.modifyAndToObject(xmlGeneratedRaw, mods, function (err, result) {
                    xmlGeneratedObj = result;
                    done(err);
                });
            });

            var compareSection = function (section, sectionGenerated, baseName) {
                var orderedSection = jsonutil.orderByKeys(section);
                var orderedGeneratedSection = jsonutil.orderByKeys(sectionGenerated);

                jsonutil.JSONToFile(orderedSection, generatedDir, "o_" + baseName + ".json");
                jsonutil.JSONToFile(orderedGeneratedSection, generatedDir, "g_" + baseName + ".json");

                expect(orderedGeneratedSection).to.deep.equal(orderedSection);
            };

            var templateIdsForSection = {
                'allergies': ["2.16.840.1.113883.10.20.22.2.6", "2.16.840.1.113883.10.20.22.2.6.1"],
                'medications': ["2.16.840.1.113883.10.20.22.2.1", "2.16.840.1.113883.10.20.22.2.1.1"],
                'immunizations': ["2.16.840.1.113883.10.20.22.2.2", "2.16.840.1.113883.10.20.22.2.2.1"],
                'procedures': ["2.16.840.1.113883.10.20.22.2.7", "2.16.840.1.113883.10.20.22.2.7.1"],
                'encounters': ["2.16.840.1.113883.10.20.22.2.22"],
                'payers': ["2.16.840.1.113883.10.20.22.2.18"],
                'plan_of_care': ["2.16.840.1.113883.10.20.22.2.10"],
                'problems': ["2.16.840.1.113883.10.20.22.2.5", "2.16.840.1.113883.10.20.22.2.5.1"],
                'social_history': ["2.16.840.1.113883.10.20.22.2.17"],
                'vitals': ["2.16.840.1.113883.10.20.22.2.4", "2.16.840.1.113883.10.20.22.2.4.1"],
                'results': ["2.16.840.1.113883.10.20.22.2.3", "2.16.840.1.113883.10.20.22.2.3.1"]
            };

            var findCompareSection = function (sectionName) {
                var f = function (ccd, templateId) {
                    var root = jsonutil.getDeepValue(ccd, 'ClinicalDocument.component.0.structuredBody.0.component');
                    expect(root).to.exist;
                    var result = xml2jsutil.findSection(root, templateId);
                    expect(result).to.exist;
                    return result;
                };

                var templateIds = templateIdsForSection[sectionName];
                var section = f(xmlObj, templateIds);
                var sectionGenerated = f(xmlGeneratedObj, templateIds);

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

            if (!limited) {
                it('social_history', function () {
                    findCompareSection('social_history');
                });
            }

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

    describe('CCD_1.xml', testSampleFile('CCD_1', true, ccd1ParserMods, ccd1GeneratorMods));

    describe('Vitera.xml', testSampleFile('Vitera', false, viteraParserMods, viteraGeneratorMods, true));
});
