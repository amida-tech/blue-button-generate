"use strict";

var condition = require('./condition');
var translate = require('../bbutil/translate');

exports.id = (function () {
    var f = function (input) {
        return {
            attributes: {
                root: input.identifier,
                extension: input.extension
            },
        };
    };
    f["#"] = 'identifiers';
    f['+'] = condition.keyExists('identifier');
    f['*'] = true;
    return f;
})();

exports.effectiveTime = (function (required) {
    var f = function (input) {
        return {
            attributes: {
                "value": translate.time,
            },
            attributeKey: 'point',
            content: {
                low: {
                    attributes: {
                        "value": translate.time
                    },
                    "#": 'low',
                },
                high: {
                    attributes: {
                        "value": translate.time
                    },
                    "#": 'high',
                }
            }
        };
    };
    f['#'] = 'date_time';
    f['+'] = condition.eitherKeyExists('point', 'low', 'high');
    f['*'] = required;
    return f;
})();

exports.text = (function () {
    var f = function (input) {
        return {
            "_": input.value,
            "reference": {
                attributes: {
                    "value": input.reference
                },
                "#": 'reference'
            }
        };
    };
    f['#'] = 'text';
    f['+'] = condition.eitherKeyExists('reference', 'value');
    f['*'] = true;
    return f;
})();

exports.completed = {
    attributes: {
        code: 'completed'
    }
};

exports.nullFlavor = {
    attributes: {
        nullFlavor: "UNK"
    }
};
