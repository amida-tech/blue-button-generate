"use strict";

var fieldLevel = require('./fieldLevel');
var leafLevel = require('./leafLevel');
var condition = require('./condition');
var contentModifier = require("./contentModifier");

var key = contentModifier.key;
var required = contentModifier.required;
var dataKey = contentModifier.dataKey;

var patientName = Object.create(fieldLevel.usRealmName);
patientName.attributes = {
  use: "L"
};

var patient = exports.patient = {
  key: "patient",
  content: [
    patientName, {
      key: "administrativeGenderCode",
      attributes: {
        code: function (input) {
          return input.code;
        },
        codeSystem: "2.16.840.1.113883.5.1",
        codeSystemName: "HL7 AdministrativeGender",
        displayName: leafLevel.input
      },
      dataKey: "gender"
    },
    [fieldLevel.effectiveTime, key("birthTime"), dataKey("dob")], {
      key: "maritalStatusCode",
      attributes: {
        code: function (input) {
          return input.code;
        },
        displayName: leafLevel.input,
        codeSystem: "2.16.840.1.113883.5.2",
        codeSystemName: "HL7 Marital Status"
      },
      dataKey: "marital_status"
    }, {
      key: "religiousAffiliationCode",
      attributes: leafLevel.codeFromName("2.16.840.1.113883.5.1076"),
      dataKey: "religion"
    }, {
      key: "ethnicGroupCode",
      attributes: leafLevel.codeFromName("2.16.840.1.113883.6.238"),
      dataKey: "ethnicity"
    }, {
      key: "raceCode",
      attributes: leafLevel.codeFromName("2.16.840.1.113883.6.238"),
      dataKey: "race"
    }, {
      key: "guardian",
      content: [{
          key: "code",
          attributes: leafLevel.codeFromName("2.16.840.1.113883.5.111"),
          dataKey: "relation"
        },
        [fieldLevel.usRealmAddress, dataKey("addresses")],
        fieldLevel.telecom, {
          key: "guardianPerson",
          content: {
            key: "name",
            content: [{
              key: "given",
              text: leafLevel.inputProperty("first")
            }, {
              key: "family",
              text: leafLevel.inputProperty("last")
            }],
            dataKey: "names"
          }
        }
      ],
      dataKey: "guardians"
    }, {
      key: "birthplace",
      content: {
        key: "place",
        content: [
          [fieldLevel.usRealmAddress, dataKey("birthplace")]
        ]
      },
      existsWhen: condition.keyExists("birthplace")
    }, {
      key: "languageCommunication",
      content: [{
        key: "languageCode",
        attributes: {
          code: leafLevel.input
        },
        dataKey: "language"
      }, {
        key: "modeCode",
        attributes: leafLevel.codeFromName("2.16.840.1.113883.5.60"),
        dataKey: "mode"
      }, {
        key: "proficiencyLevelCode",
        attributes: {
          code: function (input) {
            return input.code;
          },
          displayName: leafLevel.input,
          codeSystem: "2.16.840.1.113883.5.61",
          codeSystemName: "LanguageAbilityProficiency"
        },
        dataKey: "proficiency"
      }, {
        key: "preferenceInd",
        attributes: {
          value: function (input) {
            return input.toString();
          }
        },
        dataKey: "preferred"
      }],
      dataKey: "languages"
    }
  ]
};

var provider = exports.provider = {
  key: "performer",
  attributes: {
    typeCode: "PRF"
  },
  content: [
    [fieldLevel.effectiveTime, key("time"), dataKey("date_time")], {
      key: "assignedEntity",
      content: [{
          key: "id",
          attributes: {
            extension: leafLevel.inputProperty("extension"),
            root: leafLevel.inputProperty("root")
          },
          dataKey: "identity"
        }, {
          key: "code",
          attributes: leafLevel.code,
          dataKey: "type"
        },

        {
          key: "telecom",
          attributes: [{
            use: "WP",
            value: function (input) {
              return input.value.number;
            }
          }],
          dataKey: "phone"
        }, {
          key: "assignedPerson",
          content: [{
            key: "name",
            content: [{
              key: "given",
              text: leafLevel.inputProperty("first")
            }, {
              key: "family",
              text: leafLevel.inputProperty("last")
            }],
            dataKey: "name"
          }]
        }
      ]
    }
  ],
  dataKey: "providers"
};

var attributed_provider = exports.attributed_provider = {
  key: "providerOrganization",
  content: [{
    key: "id",
    attributes: {
      extension: leafLevel.inputProperty("extension"),
      root: leafLevel.inputProperty("root")
    },
    dataKey: "attributed_provider.identity"
  }, {
    key: "name",
    text: leafLevel.inputProperty("full"),
    dataKey: "attributed_provider.name"
  }, {
    key: "telecom",
    attributes: [{
      use: "WP",
      value: function (input) {
        return input.value.number;
      }
    }],
    dataKey: "attributed_provider.phone"
  }],
  dataKey: "meta"
};

var recordTarget = exports.recordTarget = {
  key: "recordTarget",
  content: {
    key: "patientRole",
    content: [
      fieldLevel.id, [fieldLevel.usRealmAddress, dataKey("addresses")],
      fieldLevel.telecom,
      patient,
      attributed_provider
    ]
  },
  dataKey: "data.demographics"
};

var headerAuthor = exports.headerAuthor = {
  key: "author",
  content: [
    [fieldLevel.timeNow, required], {
      key: "assignedAuthor",
      //attributes: {id:}
      content: [{
        key: "id",
        attributes: {
          root: leafLevel.inputProperty("id")
        },
        dataKey: "author"

      }, {
        key: "representedOrganization",
        content: [{
          key: "id",
          attributes: {
            root: leafLevel.inputProperty("id")
          },
          dataKey: "author"
        }, {
          key: "name",
          text: leafLevel.inputProperty("name"),
          dataKey: "author"

        }]
      }]
    }
  ],
  dataKey: "meta.ccda_header"
};
var headerInformant = exports.headerInformant = {
  key: "informant",
  content: {
    key: "assignedEntity",
    //attributes: {id:}
    content: [{
      key: "id",
      attributes: {
        root: leafLevel.inputProperty("id")
      },
      dataKey: "informant"

    }, {
      key: "representedOrganization",
      content: [{
        key: "id",
        attributes: {
          root: leafLevel.inputProperty("id")
        },
        dataKey: "informant"
      }, {
        key: "name",
        text: leafLevel.inputProperty("name"),
        dataKey: "informant"

      }]
    }]
  },
  dataKey: "meta.ccda_header"
};
var headerCustodian = exports.headerCustodian = {
  key: "custodian",
  content: {
    key: "assignedCustodian",
    //attributes: {id:}
    content: [{
      key: "representedCustodianOrganization",
      content: [{
        key: "id",
        attributes: {
          root: leafLevel.inputProperty("id")
        },
        dataKey: "custodian"
      }, {
        key: "name",
        text: leafLevel.inputProperty("name"),
        dataKey: "custodian"

      }]
    }]
  },
  dataKey: "meta.ccda_header"
};

var providers = exports.providers = {
  key: "documentationOf",
  attributes: {
    typeCode: "DOC"
  },
  content: {
    key: "serviceEvent",
    attributes: {
      classCode: "PCPR"
    },
    content: [
      provider
    ]
  },
  dataKey: "data.demographics"
};
