"use strict";

var condition = require('./condition');
var translate = require('../bbutil/translate');

exports.id = (function () {
    var f = function (input) {
        return {
            "$": {
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
            "$": {
                "value": translate.time,
                '#': 'point'
            },
            low: {
                "$": {
                    "value": translate.time
                },
                "#": 'low',
            },
            high: {
                "$": {
                    "value": translate.time
                },
                "#": 'high',
            }
        };
    };
    f['#'] = 'date_time';
    f['+'] = condition.keyOrKeyExist('point', 'low', 'high');
    f['*'] = required;
    return f;
})();

exports.text = (function () {
    var f = function (input) {
        return {
            "_": input.value,
            "reference": {
                "$": {
                    "value": input.reference
                },
                "#": 'reference'
            }
        };
    };
    f['#'] = 'text';
    f['+'] = condition.keyOrKeyExist('reference', 'value');
    f['*'] = true;
    return f;
})();

exports.completed = {
    "$": {
        code: 'completed'
    }
};

exports.nullFlavor = {
    "$": {
        nullFlavor: "UNK"
    }
};
