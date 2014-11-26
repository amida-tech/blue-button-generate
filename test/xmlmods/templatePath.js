var medSection = exports.medSection = '//h:templateId[@root="2.16.840.1.113883.10.20.22.2.1" or @root="2.16.840.1.113883.10.20.22.2.1.1"]/..';
var medActivity = exports.medActivity = medSection + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.16"]/..';
var medSupplyOrder = exports.medSupplyOrder = medActivity + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.17"]/..';
var medDispense = exports.medDispense = medActivity + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.18"]/..';
exports.medActivityInstructions = medActivity + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.20"]/../..';
exports.medStatus = medActivity + '/.//h:templateId[@root="2.16.840.1.113883.10.20.1.47"]/../..';
exports.medProbAct = medActivity + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.3"]/../..';
exports.medDispenseInfo = medDispense + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.23"]/../..';
exports.medSupplyInfo = medSupplyOrder + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.23"]/../..';
exports.medActivityInfo = medActivity + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.23"]/..';

var immSection = exports.immSection = '//h:templateId[@root="2.16.840.1.113883.10.20.22.2.2" or @root="2.16.840.1.113883.10.20.22.2.2.1"]/..';
var immActivity = exports.immActivity = immSection + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.52"]/..';
exports.immRefusalReason = immActivity + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.53"]/..';
exports.immActUnknown1 = immActivity + '/.//h:templateId[@root="2.16.840.1.113883.10.20.1.46"]/../..';
exports.immActUnknown2 = immActivity + '/.//h:templateId[@root="2.16.840.1.113883.10.20.1.47"]/../..';
exports.immActComment = immActivity + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.64"]/../..';
exports.immInstructions = immSection + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.20"]/../..';

var procSection = exports.procSection = '//h:templateId[@root="2.16.840.1.113883.10.20.22.2.7" or @root="2.16.840.1.113883.10.20.22.2.7.1"]/..';
var procActProc = exports.procActProc = procSection + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.14"]/..';
exports.procActProcUnknown = procActProc + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.4"]/../..';
exports.procProductInstance = procActProc + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.37"]/../..';
exports.procActEither = procSection + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.12" or @root="2.16.840.1.113883.10.20.22.4.13" or @root="2.16.840.1.113883.10.20.22.4.14"]/..';

var payersSection = exports.payersSection = '//h:templateId[@root="2.16.840.1.113883.10.20.22.2.18"]/..';
var coverageAct = exports.coverageAct = payersSection + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.60"]/..';
var policyAct = exports.policyAct = coverageAct + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.61"]/..';

var probSection = exports.probSection = '//h:templateId[@root="2.16.840.1.113883.10.20.22.2.5" or @root="2.16.840.1.113883.10.20.22.2.5.1"]/..';
var probAct = exports.probAct = probSection + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.3"]/..';
var probObservation = exports.probObservation = probAct + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.4"]/..';
var probStatus = exports.probStatus = probObservation + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.6"]/..';
exports.probActComment = probAct + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.64"]/../..';

var allergiesSection = exports.allergiesSection = '//h:templateId[@root="2.16.840.1.113883.10.20.22.2.6.1"]/..';
var allergyObs = exports.allergyObs = allergiesSection + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.7"]/..';
var allergyReaction = exports.allergyReaction = allergyObs + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.9"]/..';
exports.allergyCommentAct = allergiesSection + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.64"]/../..';

var encSection = exports.encSection = '//h:templateId[@root="2.16.840.1.113883.10.20.22.2.22"]/..';
var encAct = exports.encAct = encSection + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.49"]/..';

var pocSection = exports.pocSection = '//h:templateId[@root="2.16.840.1.113883.10.20.22.2.10"]/..';
var pocActProc = exports.pocActProc = pocSection + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.41"]/..';
var pocActProcUnknown = exports.pocActProcUnknown = pocActProc + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.4"]/../..';

var resultsSection = exports.resultsSection = '//h:templateId[@root="2.16.840.1.113883.10.20.22.2.3.1"]/..';
var resultOrg = exports.resultOrg = resultsSection + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.1"]/..';
var resultObs = exports.resultObs = resultOrg + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.2"]/..';
exports.resultsCommentAct = resultsSection + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.64"]/../..';

var vitalsSection = exports.vitalsSection = '//h:templateId[@root="2.16.840.1.113883.10.20.22.2.4" or @root="2.16.840.1.113883.10.20.22.2.4.1"]/..';
var vitalsObs = exports.vitalsObs = vitalsSection + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.27"]/..';

var socialHistorySection = '//h:templateId[@root="2.16.840.1.113883.10.20.22.2.17"]/..';
exports.socHistObs = socialHistorySection + '/.//h:templateId[@root="2.16.840.1.113883.10.20.22.4.78"]/..';
