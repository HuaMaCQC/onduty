"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnDutyType = exports.OnDutyType = void 0;
var OnDutyType;
(function (OnDutyType) {
    OnDutyType["Mon"] = "Mon";
    OnDutyType["Tue"] = "Tue";
    OnDutyType["Wed"] = "Wed";
    OnDutyType["Thu"] = "Thu";
    OnDutyType["Fri"] = "Fri";
    OnDutyType["Sat"] = "Sat";
    OnDutyType["Sun"] = "Sun";
    OnDutyType["maintain"] = "maintain";
})(OnDutyType || (OnDutyType = {}));
exports.OnDutyType = OnDutyType;
function getOnDutyType(str) {
    var v = OnDutyType.Mon;
    switch (str) {
        case "Mon": {
            v = OnDutyType.Mon;
            break;
        }
        case "Tue": {
            v = OnDutyType.Tue;
            break;
        }
        case "Wed": {
            v = OnDutyType.Wed;
            break;
        }
        case "Thu": {
            v = OnDutyType.Thu;
            break;
        }
        case "Fri": {
            v = OnDutyType.Fri;
            break;
        }
        case "Sat": {
            v = OnDutyType.Sat;
            break;
        }
        case "Sun": {
            v = OnDutyType.Sun;
            break;
        }
        default: {
            break;
        }
    }
    return v;
}
exports.getOnDutyType = getOnDutyType;
//# sourceMappingURL=type.js.map