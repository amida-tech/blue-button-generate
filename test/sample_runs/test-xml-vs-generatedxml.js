"use strict";

var expect = require('chai').expect;

var fs = require("fs");
var path = require('path');
var bb = require('blue-button');
var bbg = require('../../index');

var jsonutil = require('../util/jsonutil');
var util = require('../util');

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
                util.toSectionJSONs(xmlRaw, mods, function (err, result) {
                    xmlObj = result;
                    done(err);
                });
            });

            it('xml2js generated', function (done) {
                var mods = bbGeneratorMods;
                if (addlGeneratorMods) {
                    mods = mods.concat(addlGeneratorMods);
                }
                util.toBBSectionJSONs(xmlRaw, validate, mods, function (err, result) {
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
                var section = xmlObj[sectionName];
                var sectionGenerated = xmlGeneratedObj[sectionName];

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
