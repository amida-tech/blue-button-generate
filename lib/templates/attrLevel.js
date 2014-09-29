"use strict";

exports.code = (function () {
    return function (input) {
        return {
            "code": input.code,
            "displayName": input.name,
            "codeSystem": input.code_system,
            "codeSystemName": input.code_system_name
        };
    };
})();
