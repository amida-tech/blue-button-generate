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
    f.dataKey = 'identifiers';
    f.existsWhen = condition.keyExists('identifier');
    f.required = true;
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
                    dataKey: 'low',
                },
                high: {
                    attributes: {
                        "value": translate.time
                    },
                    dataKey: 'high',
                }
            }
        };
    };
    f.dataKey = 'date_time';
    f.existsWhen = condition.eitherKeyExists('point', 'low', 'high');
    f.required = required;
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
                dataKey: 'reference'
            }
        };
    };
    f.dataKey = 'text';
    f.existsWhen = condition.eitherKeyExists('reference', 'value');
    f.required = true;
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
