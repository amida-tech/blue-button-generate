"use strict";

var condition = require('./condition');

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
                "xsi:type": input.type,
                "value": input.value //,
                //"+": condition.keyOrKeyExist('type', 'value')
            },
            low: {
                "$": {
                    "value": input.low.date
                },
                "#": 'low',
                '+': condition.keyExists('date')
            },
            high: {
                "$": {
                    "value": input.high.date
                },
                "#": 'high',
                '+': condition.keyExists('date')
            }
        };
    };
    f['#'] = 'date_time';
    f['+'] = condition.keyOrKeyExist('low', 'high');
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
