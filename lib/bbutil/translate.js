"use strict";

var bbm = require("blue-button-meta");

var codeSystems = bbm.CCDA.codeSystems;

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
