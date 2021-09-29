"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = void 0;
var type_1 = require("./type");
var mariadb_1 = __importDefault(require("mariadb"));
var dayjs_1 = __importDefault(require("dayjs"));
var maintain = ["2021-09-29", "2021-10-13", "2021-10-27"];
var groupMembers = [
    {
        id: 1,
        name: "花媽",
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
        maintain: [],
    },
    {
        id: 2,
        name: "eddy",
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
        maintain: [],
    },
    {
        id: 3,
        name: "小楓",
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
        maintain: [],
    },
    {
        id: 4,
        name: "ray",
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
        maintain: [],
    },
    {
        id: 5,
        name: "youli",
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
        maintain: [],
    },
    {
        id: 6,
        name: "hong-yin",
        Mon: [],
        Tue: [],
        Wed: ["2021-09-22"],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
        maintain: [],
    },
    {
        id: 7,
        name: "winnie",
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
        maintain: [],
    },
    {
        id: 8,
        name: "alex10",
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
        maintain: [],
    },
];
var startDay = "2021-09-23";
var endDay = "2021-10-31";
var Data = /** @class */ (function () {
    function Data() {
        this.pool = mariadb_1.default.createPool({
            host: "127.0.0.1",
            user: "root",
            password: "1234",
            database: "on_duty",
            connectionLimit: 5,
        });
    }
    /**
     * 取得組員列表
     * @returns
     */
    Data.prototype.getMember = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn, rows, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        return [4 /*yield*/, this.pool.getConnection()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query("SELECT * FROM `group_member` ORDER BY `id` ASC")];
                    case 2:
                        rows = _a.sent();
                        return [2 /*return*/, rows];
                    case 3:
                        err_1 = _a.sent();
                        throw err_1;
                    case 4:
                        if (conn)
                            conn.release(); //release to pool
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 取得之前的值班
     * @returns
     */
    Data.prototype.getBeforeOnduty = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn, rows, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        return [4 /*yield*/, this.pool.getConnection()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query("SELECT group_member.id, onduty.onduty_date, onduty.isMaintain FROM `onduty` INNER JOIN `group_member` ON onduty.nameID = group_member.id")];
                    case 2:
                        rows = _a.sent();
                        return [2 /*return*/, rows];
                    case 3:
                        err_2 = _a.sent();
                        throw err_2;
                    case 4:
                        if (conn)
                            conn.release(); //release to pool
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Data.prototype.getGroupMember = function () {
        return __awaiter(this, void 0, void 0, function () {
            var member, beforeOnduty, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMember()];
                    case 1:
                        member = _a.sent();
                        return [4 /*yield*/, this.getBeforeOnduty()];
                    case 2:
                        beforeOnduty = _a.sent();
                        data = member.map(function (d) { return ({
                            id: d.id,
                            name: d.name,
                            Mon: [],
                            Tue: [],
                            Wed: [],
                            Thu: [],
                            Fri: [],
                            Sat: [],
                            Sun: [],
                            maintain: [],
                        }); });
                        beforeOnduty.forEach(function (d) {
                            data.forEach(function (v, i) {
                                if (v.id === d.id && !d.isMaintain) {
                                    var day = (0, dayjs_1.default)(d.onduty_date);
                                    data[i][(0, type_1.getOnDutyType)(day.format("ddd"))].push((0, dayjs_1.default)(d.onduty_date).format('YYYY-MM-DD'));
                                }
                                if (v.id === d.id && d.isMaintain) {
                                    data[i].maintain.push((0, dayjs_1.default)(d.onduty_date).format('YYYY-MM-DD'));
                                }
                            });
                        });
                        console.log(data);
                        return [2 /*return*/, data];
                }
            });
        });
    };
    return Data;
}());
exports.Data = Data;
var data = new Data();
data.getGroupMember();
//# sourceMappingURL=data.js.map