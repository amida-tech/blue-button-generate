"use strict";

var libxmljs = require('libxmljs');

var js2xml = require('../../lib/templates/js2xml');
var entryLevel = require('../../lib/templates/entryLevel');

var reactions1 = {
    reactions: [{
        "identifiers": [{
            "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a64"
        }],
        "date_time": {
            "low": {
                "date": "2007-05-01T00:00:00Z",
                "precision": "day"
            },
            "high": {
                "date": "2009-02-27T13:00:00Z",
                "precision": "second"
            }
        },
        "reaction": {
            "name": "Nausea",
            "code": "422587007",
            "code_system_name": "SNOMED CT"
        },
        "severity": {
            "code": {
                "name": "Mild",
                "code": "255604002",
                "code_system_name": "SNOMED CT"
            },
            "interpretation": {
                "name": "Suceptible",
                "code": "S",
                "code_system_name": "Observation Interpretation"
            }
        }
    }]
};

var reactions2 = {
    reactions: [{
        "identifiers": [{
            "identifier": "caf25d83-e4c2-4397-b25a-09cacc209182"
        }],
        "reaction": {
            "name": "Skin Rashes/Hives",
            "code": "64144002",
            "code_system_name": "SNOMED CT"
        }
    }, {
        "identifiers": [{
            "identifier": "2c1a2c69-a39c-4eba-8575-36b04d55bd9d"
        }],
        "reaction": {
            "name": "Nausea/Vomiting/Diarrhea",
            "code": "2919008",
            "code_system_name": "SNOMED CT"
        }
    }]
};

describe('test', function () {
    it('test', function () {
        var doc = new libxmljs.Document();
        var node = doc.node('root');
        js2xml.fillUsingTemplate(node, reactions2, "observation", entryLevel.reactionObservation);
        console.log(doc.toString());
    });
});
