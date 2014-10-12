"use strict";

var bbm = require("blue-button-meta");

var codeSystems = bbm.CCDA.codeSystems;
var OIDs = require("../../node_modules/blue-button/lib/parser/ccda/oids.js");

exports.codeName = function (OID, override) {
    return function (input) {
        var obj = OIDs[OID];
        for (var key in obj.table) {
            obj.table[obj.table[key]] = key;
        }
        return {
            "displayName": input,
            "code": obj.table[input],
            "codeSystem": (override && override.codeSystem) || OID,
            "codeSystemName": (override && override.codeSystemName) || obj.name
        };
    };
};

exports.code = function (input) {
    var result = {};
    if (input.code) {
        result.code = input.code;
    }

    if (input.name) {
        result.displayName = input.name;
    }

    var code_system = input.code_system || (input.code_system_name && codeSystems[input.code_system_name] && codeSystems[input.code_system_name][0]);
    if (code_system) {
        result.codeSystem = code_system;
    }

    if (input.code_system_name) {
        result.codeSystemName = input.code_system_name;
    }

    return result;
};

exports.time = function (input) {
    var timePieces = input.date.split("-");

    // write back the effective time the way it came in
    if (input.precision === "year") {
        timePieces[1] = "";
        timePieces[2] = "";
    } else if (input.precision === "month") {
        timePieces[2] = "";
    } else if (input.precision === "day") { // day precision
        timePieces[2] = timePieces[2].slice(0, 2); // slice off the T00:00:00Z portion of UTC time format
    } else if (input.precision === "hour") { // hour precision
        timePieces[2] = timePieces[2].replace("T", "").split(":").join("").replace("Z", "").slice(0, -4); //YYYYMMDDHH    
    } else if (input.precision === "minute") { // minute precision
        timePieces[2] = timePieces[2].replace("T", "").split(":").join("").replace("Z", "").slice(0, -2); //YYYYMMDDHHMM   
    } else { // second precision
        timePieces[2] = timePieces[2].replace("T", "").split(":").join("").replace("Z", "");
    }
    var result = timePieces[0] + timePieces[1] + timePieces[2];
    return result;
};

var acronymize = exports.acronymize = function (string) {
    var ret = string.split(" ");
    var fL = ret[0].slice(0, 1);
    var lL = ret[1].slice(0, 1);
    fL = fL.toUpperCase();
    lL = lL.toUpperCase();
    ret = fL + lL;
    if (ret === "PH") {
        ret = "HP";
    }
    if (ret === "HA") {
        ret = "H";
    }
    return ret;
};

exports.telecom = function (input) {
    var transformPhones = function (input) {
        var phones = input.phone;
        if (phones) {
            return phones.reduce(function (r, phone) {
                if (phone && phone.number) {
                    var attrs = {
                        value: "tel:" + phone.number
                    };
                    if (phone.type) {
                        attrs.use = acronymize(phone.type);
                    }
                    r.push(attrs);
                }
                return r;
            }, []);
        } else {
            return [];
        }
    };

    var transformEmails = function (input) {
        var emails = input.email;
        if (emails) {
            return emails.reduce(function (r, email) {
                if (email && email.address) {
                    var attrs = {
                        value: "mailto:" + email.address
                    };
                    if (email.type) {
                        attrs.use = acronymize(email.type);
                    }
                    r.push(attrs);
                }
                return r;
            }, []);
        } else {
            return [];
        }
    };

    var result = [].concat(transformPhones(input), transformEmails(input));
    return result.length === 0 ? null : result;
};

var nameSingle = function (input) {
    var given = null;
    if (input.first) {
        given = [input.first];
        if (input.middle && input.middle[0]) {
            given.push(input.middle[0]);
        }
    }
    return {
        prefix: input.prefix,
        given: given,
        family: input.last,
        suffix: input.suffix
    };
};

exports.name = function (input) {
    if (Array.isArray(input)) {
        return input.map(function (e) {
            return nameSingle(e);
        });
    } else {
        return nameSingle(input);
    }
};
