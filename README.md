blue-button-generate
====================

Blue Button CCDA Generator

[![NPM](https://nodei.co/npm/blue-button-generate.png)](https://nodei.co/npm/blue-button-generate/)

[![Build Status](https://travis-ci.org/amida-tech/blue-button-generate.svg)](https://travis-ci.org/amida-tech/blue-button-generate)
[![Coverage Status](https://coveralls.io/repos/amida-tech/blue-button-generate/badge.png)](https://coveralls.io/r/amida-tech/blue-button-generate)

blue-button-generate is a module to generate CCDA files from JSON data.  Currently it only supports [blue-button](https://github.com/amida-tech/blue-button) JSON data model.

## Usage

``` javascript
var fs = require('fs');
var bb = require('blue-button');
bar bbg = require('blue-button-generate');

var xmlString = fs.readFileSync('test/fixtures/files/ccda_xml/CCD_1.xml', 'utf-8');
var record = bb.parseString(xmlString);

// ...
// changes to record
// ...

// get back xml as text
var updatedXmlString = bbg(record);

```

## Implementation

blue-button-generate uses javascript template objects for implementation.  As an example Reaction Observation object is shown
``` javascript
var reactionObservation = exports.reactionObservation = {
    "$": {
        "classCode": "OBS",
        "moodCode": "EVN"
    },
    "templateId": common.templateId("2.16.840.1.113883.10.20.22.4.9"),
    "id": fieldLevel.id,
    "code": common.nullFlavor,
    "text": fieldLevel.text,
    "statusCode": common.completed,
    "effectiveTime": fieldLevel.effectiveTime,
    "value": {
        "$": {
            "xsi:type": "CD",
            "@": attrLevel.code
        },
        '#': 'reaction',
        '+': condition.eitherKeyExists('code', 'name'),
        '*': true
    },
    "entryRelationship": {
        "$": {
            "typeCode": "SUBJ",
            "inversionInd": "true"
        },
        "observation": severityObservation,
        "+": condition.keyExists('severity')
    }
};
```
this template is internally used with a call
```  javascript
js2xml.fillUsingTemplate(xmlDoc, input, 'observation', reactionObservation)
```
where `xmlDoc` is the parent xml document (Allergy Intolerance Observation) and `input` is the immediate parent of [bluebutton.js](https://github.com/blue-button/bluebutton.js) object that describes Reaction Observation

### Motivation

This approach is an alternative to direct programming or text based templates such as in [bluebutton.js](https://github.com/blue-button/bluebutton.js) and is motivated by the following
* Each template directly follows the actual specification.  One can easily match each node in the template to the actual statements in the specification.
* Individual templates can be tested independently without any additional flags or programming.
* Required elements are specified in the template and get `nullFlavor` automatically when no data exists.
* No coding required to add new templates.
* It is also a step in the right direction for the possible future directions
 * Factoring out data model dependencies so that blue-button](https://github.com/amida-tech/blue-button) data model changes or other data models can be accomodated more easily 
 * Automatic generation of templates from [blue-button](https://github.com/amida-tech/blue-button) like CCDA parsers. 

### Template Structure

Each alpha-numeric key in the template corresponds a statement in the CCDA specification.  `$` key is used to specify attributes and `*` key is used to indicate an element is required.  Values for `$` and `*` also directly come from the specification. `@` and other keys that start with `@` are used as place holder keys.  Values for `@` are functions that provide both the keys and the values of the attributes.  An additional key `_` is used to represent text value of an xml node.

`#` and `+` keys relates the templates to [blue-button](https://github.com/amida-tech/blue-button) data model. Value for the key `#` identifies the key in the data model that is associated with the node.  For example [blue-button](https://github.com/amida-tech/blue-button) data model uses `reaction` for values of Reaction Observations.  `+` is used to specify a function that checks if the node should exists or not.  For example in `reactionObservation` the Severity Observation `entryRelationship` is only created if `reaction` has a `severity` key.  Required nodes that should not exist based on `+` are created with a `nullFlavor`.

Each value in the template can either be an other template object or a function.  
