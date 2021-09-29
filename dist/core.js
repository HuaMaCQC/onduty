"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Onduty = void 0;
var type_1 = require("./type");
var dayjs_1 = __importDefault(require("dayjs"));
var weekday_1 = __importDefault(require("dayjs/plugin/weekday"));
var utc_1 = __importDefault(require("dayjs/plugin/utc"));
var timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(weekday_1.default);
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
dayjs_1.default.tz.setDefault("Asia/Taipei");
var Onduty = /** @class */ (function () {
    function Onduty(groupMembers, maintain, startDay, endDay) {
        this.groupMembers = JSON.parse(JSON.stringify(groupMembers));
        this.maintain = maintain;
        this.startDay = (0, dayjs_1.default)(startDay);
        this.endDay = (0, dayjs_1.default)(endDay);
    }
    /**
     * 篩選誰值班最少
     * @param key 星期幾
     * @returns
     */
    Onduty.prototype.ruleNoOnDutyIds = function (key) {
        var _this = this;
        var ids = [];
        var length = this.groupMembers[0][key].length;
        this.groupMembers.forEach(function (v, i) {
            if (v[key].length < length) {
                ids = [v.id];
                length = _this.groupMembers[i][key].length;
            }
            else if (v[key].length === length) {
                ids.push(v.id);
            }
        }, []);
        return ids;
    };
    /**
     * 篩選是否有連續值班
     * @param daySting 日期
     */
    Onduty.prototype.ruleNoContinuous = function (day) {
        var yesterday = day.subtract(1, "day");
        var yesterdayWeekday = (0, type_1.getOnDutyType)(yesterday.format("ddd"));
        var ids = [];
        this.groupMembers.forEach(function (v) {
            if (v[yesterdayWeekday].indexOf(yesterday.format("YYYY-MM-DD")) === -1 &&
                (yesterdayWeekday !== "Wed" ||
                    v.maintain.indexOf(yesterday.format("YYYY-MM-DD")) === -1)) {
                ids.push(v.id);
            }
        });
        return ids;
    };
    /**
     * 是否在近期有重複值班
     * @param day 值班日期
     * @param ids 值班人員
     */
    Onduty.prototype.ruleNoRepeatedly = function (day, ids) {
        var dayLength = this.groupMembers.length - 2;
        var member = this.groupMembers.find(function (d) { return d.id === ids; });
        if (dayLength <= 0) {
            return false;
        }
        for (var i = this.groupMembers.length - 2; i > 0; i--) {
            var d = day.subtract(i, "day");
            var dKey = (0, type_1.getOnDutyType)(d.format("ddd"));
            if (member &&
                (member[dKey].indexOf(d.format("YYYY-MM-DD")) !== -1 ||
                    member.maintain.indexOf(d.format("YYYY-MM-DD")) !== -1)) {
                return true;
            }
        }
        return false;
    };
    /**
     * 抽號碼
     * @param ids
     * @returns
     */
    Onduty.prototype.getRandom = function (ids) {
        var id = ids[Math.floor(Math.random() * ids.length)];
        var newIds = ids.filter(function (i) { return i !== id; });
        return { id: id, newIds: newIds };
    };
    /**
     * 抽一般天
     */
    Onduty.prototype.getOnduty = function () {
        var _this = this;
        var day = this.startDay;
        var _loop_1 = function () {
            if (this_1.maintain.indexOf(day.format("YYYY-MM-DD")) !== -1) {
                day = day.add(1, "day");
                return "continue";
            }
            var daykey = (0, type_1.getOnDutyType)(day.format("ddd"));
            var ruleIds1 = this_1.ruleNoOnDutyIds(daykey);
            var ruleIds2 = this_1.ruleNoContinuous(day);
            var ids = ruleIds1.filter(function (id) { return ruleIds2.indexOf(id) !== -1; });
            var newIds = ids.filter(function (id) { return !_this.ruleNoRepeatedly(day, id); });
            if (newIds.length > 0) {
                ids = newIds;
            }
            var idRandom = this_1.getRandom(ids);
            this_1.groupMembers.forEach(function (v, k) {
                return v.id === idRandom.id &&
                    _this.groupMembers[k][daykey].push((0, dayjs_1.default)(day).format("YYYY-MM-DD"));
            });
            day = day.add(1, "day");
        };
        var this_1 = this;
        while (day.isBefore(this.endDay.add(1, "day"), "day")) {
            _loop_1();
        }
    };
    /**
     * 抽大值班
     */
    Onduty.prototype.maintainOnDuty = function () {
        var _this = this;
        var NoOnDutyIds = this.ruleNoOnDutyIds(type_1.OnDutyType.maintain);
        this.maintain.forEach(function (d) {
            if (NoOnDutyIds.length === 0) {
                NoOnDutyIds = _this.ruleNoOnDutyIds(type_1.OnDutyType.maintain);
            }
            var idRandom = _this.getRandom(NoOnDutyIds);
            NoOnDutyIds = idRandom.newIds;
            _this.groupMembers.forEach(function (v, k) { return v.id === idRandom.id && _this.groupMembers[k].maintain.push(d); });
        });
    };
    /**
     * 取得結果
     * @returns
     */
    Onduty.prototype.getGroupMembers = function () {
        console.log(this.groupMembers);
        console.log(2222);
        return this.groupMembers;
    };
    return Onduty;
}());
exports.Onduty = Onduty;
//# sourceMappingURL=core.js.map