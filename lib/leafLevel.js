"use strict";

var bbu = require("@amida-tech/blue-button-util");
var nestedProperty = require("nested-property");

var translate = require('./translate');

var bbuo = bbu.object;
var bbud = bbu.datetime;

exports.input = function (input) {
  return input;
};

exports.inputProperty = function (key) {
  return function (input) {
    return input && input[key];
  };
};

exports.boolInputProperty = function (key) {
  return function (input) {
    if (input && input.hasOwnProperty(key)) {
      return input[key].toString();
    } else {
      return null;
    }
  };
};

exports.code = translate.code;

exports.codeFromName = translate.codeFromName;

exports.codeOnlyFromName = function (OID, key) {
  var f = translate.codeFromName(OID);
  return function (input) {
    if (input && input[key]) {
      return f(input[key]).code;
    } else {
      return null;
    }
  };
};

exports.time = translate.time;

exports.use = function (key) {
  return function (input) {
    var value = input && input[key];
    if (value) {
      return translate.acronymize(value);
    } else {
      return null;
    }
  };
};

exports.typeCD = {
  "xsi:type": "CD"
};

exports.typeCE = {
  "xsi:type": "CE"
};

exports.nextReference = function (referenceKey) {
  return function (input, context) {
    return context.nextReference(referenceKey);
  };
};

exports.sameReference = function (referenceKey) {
  return function (input, context) {
    return context.sameReference(referenceKey);
  };
};

exports.deepInputProperty = function (deepProperty, defaultValue) {
  return function (input) {
    var value = nestedProperty.get(input, deepProperty);
    value = bbuo.exists(value) ? value : defaultValue;
    if (typeof value !== 'string') {
      value = value.toString();
    }
    return value;
  };
};

exports.deepInputDate = function (deepProperty, defaultValue) {
  return function (input) {
    var value = nestedProperty.get(input, deepProperty);
    if (!bbuo.exists(value)) {
      return defaultValue;
    } else {
      value = bbud.modelToDate({
        date: value.date,
        precision: value.precision // workaround a bug in bbud.  Changes precision.
      });
      if (bbuo.exists(value)) {
        return value;
      } else {
        return defaultValue;
      }
    }
  };
};
