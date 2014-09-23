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

        var toDemographics = function (ccd) {
            expect(ccd.ClinicalDocument).to.exist;
            expect(ccd.ClinicalDocument.recordTarget).to.exist;
            expect(ccd.ClinicalDocument.recordTarget[0]).to.exist;
            expect(ccd.ClinicalDocument.recordTarget[0].patientRole).to.exist;
            expect(ccd.ClinicalDocument.recordTarget[0].patientRole[0]).to.exist;
            return ccd.ClinicalDocument.recordTarget[0].patientRole[0];

            //expect(ccd.ClinicalDocument.recordTarget[0].patientRole[0].patient).to.exist;
            //expect(ccd.ClinicalDocument.recordTarget[0].patientRole[0].patient[0]).to.exist;
            //return ccd.ClinicalDocument.recordTarget[0].patientRole[0].patient[0];
        };

        var xmlRaw;
        var sections;
        var sectionsGenerated;
        var demographics;
        var demographicsGenerated;

        var removePathSpecs = [{
            value: '//*[@nullFlavor]' // All nullFlavors
        }, {
            value: '//h:effectiveTime[@xsi:type="IVL_TS"]', // All "IVL_TS" attributes
            action: 'A',
            params: 'type'
        }, {
            value: ' //h:telecom[@use="WP"]', // All "WP" attributes
            action: 'TEL'
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
            value: '//h:code[@codeSystemVersion]', // All text white space
            action: 'A',
            params: 'codeSystemVersion'
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
        }, {
            value: '2.16.840.1.113883.10.20.22.2.7', // Procedures Section
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }, {
                value: '2.16.840.1.113883.10.20.22.4.12', // Procedure Actitivity Act
                type: 'T',
                subPathSpecs: [{
                    value: '.',
                    action: 'A',
                    params: 'moodCode'
                }]
            }, {
                value: '2.16.840.1.113883.10.20.22.4.13', // Procedure Actitivity Observation
                type: 'T',
                subPathSpecs: [{
                    value: '.',
                    action: 'A',
                    params: 'moodCode'
                }]
            }, {
                value: '2.16.840.1.113883.10.20.22.4.14', // Procedure Actitivity Procedure
                type: 'T',
                subPathSpecs: [{
                    value: '.',
                    action: 'A',
                    params: 'moodCode'
                }, {
                    value: '2.16.840.1.113883.10.20.22.4.37', // Product Instance
                    type: 'T',
                    subPathSpecs: [{
                        value: '..'
                    }]
                }]
            }]
        }, {
            value: '2.16.840.1.113883.10.20.22.2.22', // Encounters Section
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }]
        }, {
            value: "2.16.840.1.113883.10.20.22.2.18", // Payers Section
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }, {
                value: './/h:time',
                comment: "null flavored induced text value"
            }]
        }, {
            value: '2.16.840.1.113883.10.20.22.2.10', // Plan Of Care Section
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }]
        }, {
            value: "2.16.840.1.113883.10.20.22.2.5", // Problems
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }, {
                value: '2.16.840.1.113883.10.20.22.4.3', // Problem Concern Act
                type: 'T',
                subPathSpecs: [{
                    value: '2.16.840.1.113883.10.20.22.4.4', // Problem Observation
                    type: 'T',
                    subPathSpecs: [{
                        value: 'h:code'
                    }]
                }]
            }]
        }, {
            value: "2.16.840.1.113883.10.20.22.2.17", // social_history
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }]
        }, {
            value: "2.16.840.1.113883.10.20.22.2.4", // vitals
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }, {
                value: '..',
                action: 'ADD',
                params: '2.16.840.1.113883.10.20.22.4.27'
            }, {
                value: 'h:entry'
            }]
        }, {
            value: "2.16.840.1.113883.10.20.22.2.3", // results
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }]
        }, {
            value: "//h:recordTarget/h:patientRole", // demographics
            subPathSpecs: [{
                value: 'h:patient/h:ethnicGroupCode'
            }, {
                value: 'h:providerOrganization'
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
            //fs.writeFileSync(path.join(generatedDir, "CCD_1_modified.xml"), xml);

            var parser = new xml2js.Parser();
            parser.parseString(xml, function (err, result) {
                sections = toSections(result);
                demographics = toDemographics(result);
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
        }, {
            value: '2.16.840.1.113883.10.20.22.2.7', // Procedures Section
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }, {
                value: '2.16.840.1.113883.10.20.22.4.12', // Procedure Actitivity Act
                type: 'T',
                subPathSpecs: [{
                    value: '.',
                    action: 'A',
                    params: 'moodCode'
                }]
            }, {
                value: '2.16.840.1.113883.10.20.22.4.13', // Procedure Actitivity Observation
                type: 'T',
                subPathSpecs: [{
                    value: '.',
                    action: 'A',
                    params: 'moodCode'
                }]
            }, {
                value: '2.16.840.1.113883.10.20.22.4.14', // Procedure Actitivity Procedure
                type: 'T',
                subPathSpecs: [{
                    value: '.',
                    action: 'A',
                    params: 'moodCode'
                }]
            }]
        }, {
            value: '2.16.840.1.113883.10.20.22.2.22', // Encounters Section
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }]
        }, {
            value: "2.16.840.1.113883.10.20.22.2.18", // Payers Section
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }, {
                value: './/h:time',
                comment: "null flavored induced text value"
            }]
        }, {
            value: '2.16.840.1.113883.10.20.22.2.10', // Plan Of Care Section
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }]
        }, {
            value: "2.16.840.1.113883.10.20.22.2.5", // Problems
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }]
        }, {
            value: "2.16.840.1.113883.10.20.22.2.17", // social_history
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }]
        }, {
            value: "2.16.840.1.113883.10.20.22.2.4", // vitals
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
            }, {
                value: '..',
                action: 'ADD',
                params: '2.16.840.1.113883.10.20.22.4.27'
            }, {
                value: 'h:entry'
            }]
        }, {
            value: "2.16.840.1.113883.10.20.22.2.3", // results
            type: 'TR',
            subPathSpecs: [{
                value: 'h:text'
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
                demographicsGenerated = toDemographics(result);
                done(err);
            });
        });

        var compareSection = function (section, sectionGenerated, templateId) {
            xml2jsutil.processIntroducedCodeAttrs(section, sectionGenerated);
            xml2jsutil.removeTimeZones(section);

            //console.log(JSON.stringify(section, null, 4));
            var orderedSection = jsonutil.orderByKeys(section);
            fs.writeFileSync(path.join(generatedDir, "o_" + templateId + ".json"), JSON.stringify(orderedSection, null, 4));
            var orderedSectionGenerated = jsonutil.orderByKeys(sectionGenerated);
            fs.writeFileSync(path.join(generatedDir, "g_" + templateId + ".json"), JSON.stringify(orderedSectionGenerated, null, 4));

            expect(sectionGenerated).to.deep.equal(section);
        };

        var findCompareSection = function (templateId) {
            var section = xml2jsutil.findSection(sections, templateId);
            var sectionGenerated = xml2jsutil.findSection(sectionsGenerated, templateId);
            expect(section).to.exist;
            expect(sectionGenerated).to.exist;
            compareSection(section, sectionGenerated, templateId);
        };

        it('allergies', function () {
            findCompareSection("2.16.840.1.113883.10.20.22.2.6");
        });

        it('medications', function () {
            findCompareSection("2.16.840.1.113883.10.20.22.2.1");
        });

        it('immunizations', function () {
            findCompareSection("2.16.840.1.113883.10.20.22.2.2");
        });

        it('procedures', function () {
            findCompareSection("2.16.840.1.113883.10.20.22.2.7");
        });

        it('encounters', function () {
            findCompareSection("2.16.840.1.113883.10.20.22.2.22");
        });

        it('payers', function () {
            findCompareSection("2.16.840.1.113883.10.20.22.2.18");
        });

        it('plan of care', function () {
            findCompareSection("2.16.840.1.113883.10.20.22.2.10");
        });

        it('problems', function () {
            findCompareSection("2.16.840.1.113883.10.20.22.2.5");
        });

        it('social_history', function () {
            findCompareSection("2.16.840.1.113883.10.20.22.2.17");
        });

        it('vitals', function () {
            findCompareSection("2.16.840.1.113883.10.20.22.2.4");
        });

        it('results', function () {
            findCompareSection("2.16.840.1.113883.10.20.22.2.3");
        });

        it('demographics', function () {
            compareSection(demographics, demographicsGenerated, "demographics");
        });
    });
});
