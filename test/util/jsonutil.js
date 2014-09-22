"use strict";

exports.orderByKeys = function orderByKeys(input) {
    var result = {};
    var keys = Object.keys(input);
    keys.sort();
    keys.forEach(function (key) {
        if (input[key] && (typeof input[key] === 'object')) {
            result[key] = orderByKeys(input[key]);
        } else {
            result[key] = input[key];
        }
    });
    return result;
};
