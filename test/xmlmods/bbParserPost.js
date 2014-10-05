module.exports = [{
    xpath: "//h:effectiveTime[@value] | //h:effectiveTime/h:low[@value] | //h:effectiveTime/h:high[@value]",
    action: "removeTimezone",
    comment: "parser bug: timezones are not read"
}];
