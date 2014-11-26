"use strict";

var expect = require('chai').expect;

var fs = require("fs");
var path = require('path');
var bb = require('blue-button');
var bbg = require('../../index');

var jsonutil = require('../util/jsonutil');
var xpathutil = require('../util/xpathutil');
var xml2jsutil = require('../util/xml2jsutil');

var bbParserMods = require('../xmlmods/bbParser');
var bbGeneratorMods = require('../xmlmods/bbGenerator');
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
                var xmlModified = xpathutil.modifyXML(xmlRaw, mods);

                xml2jsutil.toOrderedJSON(xmlModified, function (err, result) {
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
                var xmlModified = xpathutil.modifyXML(xmlGeneratedRaw, mods);

                xml2jsutil.toOrderedJSON(xmlModified, function (err, result) {
                    xmlGeneratedObj = result;
                    done(err);
                });
            });

            var compareSection = function (section, sectionGenerated, baseName) {
                jsonutil.JSONToFile(section, generatedDir, "o_" + baseName + ".json");
                jsonutil.JSONToFile(sectionGenerated, generatedDir, "g_" + baseName + ".json");

                expect(sectionGenerated).to.deep.equal(section);
            };

            var findCompareSection = function (sectionName) {
                var f = function (ccd) {
                    var result = xml2jsutil.findSection(ccd, sectionName);
                    expect(result).to.exist;
                    return result;
                };

                var section = f(xmlObj);
                var sectionGenerated = f(xmlGeneratedObj);

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
                findCompareSection('demographics');
            });

        };
    };

    describe('CCD_1.xml', testSampleFile('CCD_1', true, ccd1ParserMods, ccd1GeneratorMods));

    describe('Vitera.xml', testSampleFile('Vitera', false, viteraParserMods, viteraGeneratorMods, true));
});
