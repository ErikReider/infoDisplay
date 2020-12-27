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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
var bus_1 = require("./bus/bus");
var fs_1 = require("fs");
var fs = require("fs");
var chokidar = require("chokidar");
onload = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, initWeather()];
            case 1:
                _a.sent();
                return [4 /*yield*/, initBusses()];
            case 2:
                _a.sent();
                initTime();
                document.body.style.opacity = "1";
                document.body.style.transform = "scale(1)";
                return [2 /*return*/];
        }
    });
}); };
function initTime() {
    var timeElement = document.getElementById("timeElement");
    var dateMonth = document.getElementById("dateMonth");
    var dateDay = document.getElementById("dateDay");
    function updateTime() {
        var date = new Date();
        // Clock
        var hours = ("0" + date.getHours().toString()).slice(-2);
        var minutes = ("0" + date.getMinutes().toString()).slice(-2);
        var seconds = ("0" + date.getSeconds().toString()).slice(-2);
        timeElement.textContent = hours + ":" + minutes + ":" + seconds;
        // Date
        dateMonth.textContent = date.toLocaleString("default", { month: "short" });
        dateDay.textContent = date.getDate().toLocaleString();
        setTimeout(function () { return updateTime(); }, 1000);
    }
    updateTime();
}
function initWeather() {
    return __awaiter(this, void 0, void 0, function () {
        function updateWeatherElements() {
            return __awaiter(this, void 0, void 0, function () {
                var rawData, temp, iconURL, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!fs.existsSync(cacheURL))
                                return [2 /*return*/];
                            return [4 /*yield*/, fs_1.promises.readFile(cacheURL, "utf-8")];
                        case 1:
                            rawData = _a.sent();
                            temp = "No data";
                            iconURL = "";
                            if (!(rawData !== "")) return [3 /*break*/, 3];
                            return [4 /*yield*/, JSON.parse(rawData)];
                        case 2:
                            data = _a.sent();
                            temp = (Number(data["main"]["temp"]) - 273.15).toFixed(0) + "\u2103";
                            iconURL = "../assets/weatherIcons/" + data["weather"][0]["icon"] + ".svg";
                            _a.label = 3;
                        case 3:
                            weatherImg.src = iconURL;
                            weatherTemp.textContent = temp;
                            return [2 /*return*/];
                    }
                });
            });
        }
        var cacheURL, weatherImg, weatherTemp;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheURL = process.cwd() + "/cache/weather.json";
                    weatherImg = document.getElementById("weatherImage");
                    weatherTemp = document.getElementById("weatherTemp");
                    return [4 /*yield*/, updateWeatherElements()];
                case 1:
                    _a.sent();
                    // Watch for cache file changes
                    chokidar.watch(cacheURL, {
                        awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 100 }
                    }).on("change", (function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, updateWeatherElements()];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); }));
                    return [2 /*return*/];
            }
        });
    });
}
function initBusses() {
    return __awaiter(this, void 0, void 0, function () {
        function updateBusses() {
            var e_1, _a;
            return __awaiter(this, void 0, void 0, function () {
                var rawData, busses, _b, _c, busses_1, busses_1_1, bus, e_1_1;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!fs.existsSync(cacheURL))
                                return [2 /*return*/];
                            return [4 /*yield*/, fs_1.promises.readFile(cacheURL, "utf-8")];
                        case 1:
                            rawData = _d.sent();
                            if (rawData === "" || Object.keys(JSON.parse(rawData)).length == 0) {
                                allBusses.innerHTML = "<span class=\"noBusses\">No Busses...</span>";
                                return [2 /*return*/];
                            }
                            while (allBusses.lastElementChild) {
                                allBusses.removeChild(allBusses.lastElementChild);
                            }
                            _c = (_b = Object).entries;
                            return [4 /*yield*/, JSON.parse(rawData)];
                        case 2:
                            busses = _c.apply(_b, [_d.sent()]).sort(function (a, b) {
                                return Number(a[0].split("_")[0]) > Number(b[0].split("_")[0]) ? 1 : -1;
                            });
                            _d.label = 3;
                        case 3:
                            _d.trys.push([3, 8, 9, 14]);
                            busses_1 = __asyncValues(busses);
                            _d.label = 4;
                        case 4: return [4 /*yield*/, busses_1.next()];
                        case 5:
                            if (!(busses_1_1 = _d.sent(), !busses_1_1.done)) return [3 /*break*/, 7];
                            bus = busses_1_1.value;
                            allBusses.appendChild(new bus_1["default"](bus[0], bus[1]).returnElement());
                            _d.label = 6;
                        case 6: return [3 /*break*/, 4];
                        case 7: return [3 /*break*/, 14];
                        case 8:
                            e_1_1 = _d.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 14];
                        case 9:
                            _d.trys.push([9, , 12, 13]);
                            if (!(busses_1_1 && !busses_1_1.done && (_a = busses_1["return"]))) return [3 /*break*/, 11];
                            return [4 /*yield*/, _a.call(busses_1)];
                        case 10:
                            _d.sent();
                            _d.label = 11;
                        case 11: return [3 /*break*/, 13];
                        case 12:
                            if (e_1) throw e_1.error;
                            return [7 /*endfinally*/];
                        case 13: return [7 /*endfinally*/];
                        case 14: return [2 /*return*/];
                    }
                });
            });
        }
        var cacheURL, allBusses;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheURL = process.cwd() + "/cache/busses.json";
                    allBusses = document.getElementById("allBusses");
                    return [4 /*yield*/, updateBusses()];
                case 1:
                    _a.sent();
                    // Watch for cache file changes
                    chokidar.watch(cacheURL, {
                        awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 100 }
                    }).on("change", (function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, updateBusses()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }));
                    return [2 /*return*/];
            }
        });
    });
}
