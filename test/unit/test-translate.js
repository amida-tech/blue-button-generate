"use strict";

var translate = require('../../lib/translate');

describe("time generation", function () {
  var testCases = [{
    hl7: '2012',
    date: "2012-01-01T00:00:00.000Z",
    precision: 'year'
  }, {
    hl7: '201209',
    date: "2012-09-01T00:00:00.000Z",
    precision: 'month'
  }, {
    hl7: '20120915',
    date: "2012-09-15T00:00:00.000Z",
    precision: 'day'
  }, {
    hl7: '20120915',
    date: "2012-09-15T00:00:00.000Z",
    precision: 'day'
  }, {
    hl7: '20120915',
    date: "2012-09-15T00:00:00.000Z",
    precision: 'day'
  }, {
    hl7: '20120915',
    date: "2012-09-15T00:00:00.000Z",
    precision: 'day'
  }, {
    hl7: '20120915191442+0000',
    date: "2012-09-15T19:14:42.000Z",
    precision: 'second'
  }, {
    hl7: '20120915',
    date: "2012-09-15T00:00:00.000Z",
    precision: 'day'
  }, {
    hl7: '20120916021442.123+0000',
    date: "2012-09-16T02:14:42.123Z",
    precision: 'subsecond'
  }];

  testCases.forEach(function (testCase) {
    var description = testCase.date + " (" + testCase.precision + ")";
    it(description, function () {
      var input = {
        date: testCase.date,
        precision: testCase.precision
      };
      var hl7 = translate.time(input);
      expect(hl7).toBe(testCase.hl7);
    });
  });
});
