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

describe('xml vs parse generate xml ', function () {
    var NS = {
        "h": "urn:hl7-org:v3",
        "xsi": "http://www.w3.org/2001/XMLSchema-instance"
    };

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

        var findSection = function (sections, templateId) {
            var n = sections.length;
            for (var i = 0; i < n; ++i) {
                var sectionInfo = sections[i].section[0];
                var ids = sectionInfo.templateId;
                if (ids) {
                    for (var j = 0; j < ids.length; ++j) {
                        var id = ids[j];
                        if (id['$'].root === templateId) {
                            return sections[i].section[0];
                        }
                    }
                }
            }
            return null;
        };

        var normalizedDisplayNames = {
            "History of immunizations": 'Immunizations',
            "Patient Objection": "Patient objection"
        };

        var normalizedCodeSystemNames = {
            "National Cancer Institute (NCI) Thesaurus": "Medication Route FDA",
            "NCI Thesaurus": "Medication Route FDA",
            "HL7 ActNoImmunizationReason": "Act Reason",
            "RxNorm": "RXNORM"
        };

        var cleanIntroducedCodeAttrs = function cleanIntroducedCodeAttrs(original, generated) {
            Object.keys(generated).forEach(function (key) {
                if ((key === '$') && original[key]) {
                    var originalAttrs = original[key];
                    var generatedAttrs = generated[key];
                    ['codeSystem', 'codeSystemName', 'displayName'].forEach(function (attr) {
                        if (generatedAttrs[attr] && !originalAttrs[attr]) {
                            delete generatedAttrs[attr];
                        }
                    });
                    if (originalAttrs.codeSystemName && (originalAttrs.codeSystemName !== generatedAttrs.codeSystemName)) {
                        if (normalizedCodeSystemNames[originalAttrs.codeSystemName]) {
                            originalAttrs.codeSystemName = normalizedCodeSystemNames[originalAttrs.codeSystemName];
                        }
                    }
                    if (originalAttrs.displayName && (originalAttrs.displayName !== generatedAttrs.displayName)) {
                        if (normalizedDisplayNames[originalAttrs.displayName]) {
                            originalAttrs.displayName = normalizedDisplayNames[originalAttrs.displayName];
                        }
                    }
                } else if (original[key] && (typeof original[key] === 'object') && (typeof generated[key] === 'object')) {
                    cleanIntroducedCodeAttrs(original[key], generated[key]);
                }
            });
        };

        // Parser does not keep time zones.  This removes them from original until that is fixed
        var removeTimeZones = function (original) {
            Object.keys(original).forEach(function (key) {
                if ((key === '$') && original[key]) {
                    var t = original[key].value;
                    if (t && (typeof t === 'string')) {
                        if (t.length > 14) {
                            var index = t.indexOf('-');
                            if (index < 0) {
                                index = t.indexOf('+');
                            }
                            if ((index + 5) === t.length) {
                                original[key].value = t.slice(0, index);
                            }
                        }
                    }
                } else if (original[key] && (typeof original[key] === 'object')) {
                    removeTimeZones(original[key]);
                }
            });
        };

        // Parser does not keep time zones.  This removes them from original until that is fixed
        var removeOriginalText = function (original, generated) {
            Object.keys(original).forEach(function (key) {
                if ((key === 'originalText') || (key === 'reference')) {
                    delete original[key];
                    if (generated[key]) {
                        delete generated[key];
                    }
                } else if (generated[key] && (typeof original[key] === 'object')) {
                    removeOriginalText(original[key], generated[key]);
                }
            });
        };

        var trimText = function (original, generated) {
            Object.keys(original).forEach(function (key) {
                if ((key === '_') && generated[key]) {
                    original[key] = original[key].replace(/[\r\t\n ]/g, '');
                    generated[key] = generated[key].replace(/[\r\t\n ]/g, '');
                } else if (generated[key] && (typeof original[key] === 'object') && (typeof generated[key] === 'object')) {
                    trimText(original[key], generated[key]);
                }
            });
        };

        var xmlRaw;
        var sections;
        var sectionsGenerated;

        var rmTimeTypeAttrs = function (xmlDoc) {
            xpathutil.removeAttr(xmlDoc, '//h:effectiveTime[@xsi:type="IVL_TS"]', 'type');
        };

        var removeNullFlavored = function (xmlDoc) {
            xpathutil.remove(xmlDoc, '//*[@nullFlavor]');
        };

        var removePathSpecs = [{
            value: '//*[@nullFlavor]'                       // All nullFlavors
        }, {
            value: '//h:effectiveTime[@xsi:type="IVL_TS"]', // All "IVL_TS" attributes
            action: 'A',
            params: 'type'
        }, {
            value: '//h:streetAddressLine',                  // All streetAddressLine white space
            action: 'W'
        }, {
            value: '2.16.840.1.113883.10.20.22.2.1', // Medications Section (entries optional)
            type: 'T',
            subPathSpecs: [{
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
                        value: 'h:product'
                    }, {
                        value: 'h:quantity'
                    }, {
                        value: 'h:repeatNumber'
                    }, {
                        value: 'h:effectiveTime'
                    }, {
                        value: 'h:performer',
                        subPathSpecs: [{
                            value: 'h:assignedEntity/h:assignedPerson'
                        }]
                    }]             
                }, {
                    value: '2.16.840.1.113883.10.20.22.4.20', // Instructions
                    type: 'T',
                    subPathSpecs: [{
                        value: '..'
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

        var generatedXMLMods =  [{
            value: '//*[@nullFlavor]'                       // All nullFlavors
        }, {
            value: '//h:effectiveTime[@xsi:type="IVL_TS"]', // All "IVL_TS" attributes
            action: 'A',
            params: 'type'
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
            var section = findSection(sections, templateId);
            var sectionGenerated = findSection(sectionsGenerated, templateId);
            expect(section).to.exist;
            expect(sectionGenerated).to.exist;

            // ignore text
            delete section.text;
            delete sectionGenerated.text;

            cleanIntroducedCodeAttrs(section, sectionGenerated);
            removeTimeZones(section);
            removeOriginalText(section, sectionGenerated);
            trimText(section, sectionGenerated);

            var orderedSection = jsonutil.orderByKeys(section);
            fs.writeFileSync(path.join(generatedDir, "o_" + templateId + ".json"), JSON.stringify(orderedSection, null, 4));
            var orderedSectionGenerated = jsonutil.orderByKeys(sectionGenerated);
            fs.writeFileSync(path.join(generatedDir, "g_" + templateId + ".json"), JSON.stringify(orderedSectionGenerated, null, 4));

            expect(sectionGenerated).to.deep.equal(section);
        };

        it('allergies', function () {
            compareSection("2.16.840.1.113883.10.20.22.2.6");
        });

        //it('immunizations', function () {
        //    compareSection("2.16.840.1.113883.10.20.22.2.2");
        //});

        it('medications', function () {
            compareSection("2.16.840.1.113883.10.20.22.2.1");
        });
    });
});
