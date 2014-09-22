"use strict";

var expect = require('chai').expect;

var fs = require("fs");
var path = require('path');
var mkdirp = require('mkdirp');
var xml2js = require('xml2js');
var bb = require('blue-button');
var bbg = require('../../index');
var libxmljs = require('libxmljs');

var jsonutil = require('../util/jsonutil');
var xpathutil = require('../util/xpathutil');
var xml2jsutil = require('../util/xml2jsutil');

describe('xml vs parse generate xml ', function () {
    var generatedDir = null;
    var sampleDir = null;

    before(function () {
        generatedDir = path.join(__dirname, "../fixtures/files/generated");
        sampleDir = path.join(__dirname, "../fixtures/files/ccda_xml");
        mkdirp.sync(generatedDir);
        expect(generatedDir).to.exist;
    });

    describe('CCD_1.xml', function () {
        var toSections = function (ccd) {
            expect(ccd.ClinicalDocument).to.exist;
            expect(ccd.ClinicalDocument.component).to.exist;
            expect(ccd.ClinicalDocument.component[0]).to.exist;
            expect(ccd.ClinicalDocument.component[0].structuredBody).to.exist;
            expect(ccd.ClinicalDocument.component[0].structuredBody[0]).to.exist;
            expect(ccd.ClinicalDocument.component[0].structuredBody[0].component).to.exist;
            return ccd.ClinicalDocument.component[0].structuredBody[0].component;
        };

        var xmlRaw;
        var sections;
        var sectionsGenerated;

        var removePathSpecs = [{
            value: '//*[@nullFlavor]' // All nullFlavors
        }, {
            value: '//h:effectiveTime[@xsi:type="IVL_TS"]', // All "IVL_TS" attributes
            action: 'A',
            params: 'type'
        }, {
            value: '//h:streetAddressLine', // All streetAddressLine white space
            action: 'W'
        }, {
            value: '//h:reference' // All references
        }, {
            value: '//h:originalText' // All originalText
        }, {
            value: '//h:text', // All text white space
            action: 'W'
        }, {
            value: '2.16.840.1.113883.10.20.22.2.6', // Allergies Section (entries optional)
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }]
        }, {
            value: '2.16.840.1.113883.10.20.22.2.1', // Medications Section (entries optional)
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }, {
                value: '2.16.840.1.113883.10.20.22.4.16', // Medication Activity
                type: 'T',
                subPathSpecs: [{
                    value: '2.16.840.1.113883.10.20.22.4.17', // Medication Supply Order
                    type: 'T',
                    subPathSpecs: [{
                        value: 'h:performer'
                    }, {
                        value: 'h:product'
                    }]
                }, {
                    value: '2.16.840.1.113883.10.20.22.4.18', // Medication Dispense
                    type: 'T',
                    subPathSpecs: [{
                        value: 'h:product',
                        comment: 'not read by parser'
                    }, {
                        value: 'h:quantity',
                        comment: 'not read by parser'
                    }, {
                        value: 'h:repeatNumber',
                        comment: 'not read by parser'
                    }, {
                        value: 'h:effectiveTime',
                        comment: 'not read by parser'
                    }, {
                        value: 'h:performer',
                        subPathSpecs: [{
                            value: 'h:assignedEntity/h:assignedPerson',
                            comment: 'not read by parser'
                        }]
                    }]
                }, {
                    value: '2.16.840.1.113883.10.20.22.4.20', // Instructions
                    type: 'T',
                    subPathSpecs: [{
                        value: '..',
                        comment: 'not read by parser'
                    }]
                }]
            }]
        }, {
            value: '2.16.840.1.113883.10.20.22.2.2', // Immunization Section
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }, {
                value: '2.16.840.1.113883.10.20.22.4.52', // Immunization Activity
                type: 'T',
                subPathSpecs: [{
                    value: '2.16.840.1.113883.10.20.22.4.53', // Immunization Refusal Reason
                    type: 'T',
                    subPathSpecs: [{
                        value: 'h:id',
                        comment: 'not read by parser'
                    }]
                }, {
                    value: '2.16.840.1.113883.10.20.22.4.20', // Instructions
                    type: 'T',
                    subPathSpecs: [{
                        value: '..',
                        action: 'A',
                        params: 'inversionInd',
                        comment: 'erroneous in sample file'
                    }]
                }]
            }]
        }];

        it('read xml', function () {
            xmlRaw = fs.readFileSync(path.join(sampleDir, "CCD_1.xml")).toString();
            expect(xmlRaw).to.exist;
        });

        it('xml2js original', function (done) {
            var xmlDoc = libxmljs.parseXmlString(xmlRaw);
            xpathutil.removeHierarchical(xmlDoc, removePathSpecs);
            var xml = xmlDoc.toString();

            var parser = new xml2js.Parser();
            parser.parseString(xml, function (err, result) {
                sections = toSections(result);
                done(err);
            });
        });

        var generatedXMLMods = [{
            value: '//*[@nullFlavor]' // All nullFlavors
        }, {
            value: '//h:effectiveTime[@xsi:type="IVL_TS"]', // All "IVL_TS" attributes
            action: 'A',
            params: 'type'
        }, {
            value: '//h:reference' // All references
        }, {
            value: '//h:originalText' // All originalText
        }, {
            value: '//h:text', // All text white space
            action: 'W'
        }, {
            value: '2.16.840.1.113883.10.20.22.2.6', // Allergies Section (entries optional)
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }]
        }, {
            value: '2.16.840.1.113883.10.20.22.2.1', // Medications Section (entries optional)
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }]
        }, {
            value: '2.16.840.1.113883.10.20.22.2.2', // Immunization Section
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }, {
                value: '2.16.840.1.113883.10.20.22.4.52', // Immunization Activity
                type: 'T',
                subPathSpecs: [{
                    value: '2.16.840.1.113883.10.20.22.4.20', // Instructions
                    type: 'T',
                    subPathSpecs: [{
                        value: '..',
                        action: 'A',
                        params: 'inversionInd'
                    }]
                }]
            }]
        }];

        it('xml2js generated', function (done) {
            var result = bb.parseString(xmlRaw);
            var val = bb.validator.validateDocumentModel(result);
            var err = bb.validator.getLastError();
            expect(err.valid).to.be.true;

            // generate ccda
            var xmlGeneratedRaw = bbg.genWholeCCDA(result).toString();
            var xmlDocGenerated = libxmljs.parseXmlString(xmlGeneratedRaw);
            xpathutil.removeHierarchical(xmlDocGenerated, generatedXMLMods);
            var xmlGenerated = xmlDocGenerated.toString();

            var parser = new xml2js.Parser();
            parser.parseString(xmlGenerated, function (err, result) {
                sectionsGenerated = toSections(result);
                done(err);
            });
        });

        var compareSection = function (templateId) {
            var section = xml2jsutil.findSection(sections, templateId);
            var sectionGenerated = xml2jsutil.findSection(sectionsGenerated, templateId);
            expect(section).to.exist;
            expect(sectionGenerated).to.exist;

            xml2jsutil.processIntroducedCodeAttrs(section, sectionGenerated);
            xml2jsutil.removeTimeZones(section);

            var orderedSection = jsonutil.orderByKeys(section);
            fs.writeFileSync(path.join(generatedDir, "o_" + templateId + ".json"), JSON.stringify(orderedSection, null, 4));
            var orderedSectionGenerated = jsonutil.orderByKeys(sectionGenerated);
            fs.writeFileSync(path.join(generatedDir, "g_" + templateId + ".json"), JSON.stringify(orderedSectionGenerated, null, 4));

            expect(sectionGenerated).to.deep.equal(section);
        };

        it('allergies', function () {
            compareSection("2.16.840.1.113883.10.20.22.2.6");
        });

        it('medications', function () {
            compareSection("2.16.840.1.113883.10.20.22.2.1");
        });

        it('immunizations', function () {
            compareSection("2.16.840.1.113883.10.20.22.2.2");
        });
    });
});
