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
var electron_1 = require("electron");
var cron = require("node-cron");
var env_1 = require("../env/env");
var node_fetch_1 = require("node-fetch");
var fs_1 = require("fs");
var fs = require("fs");
var prod = false;
function createWindow() {
    var window = new electron_1.BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            devTools: prod ? false : true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        alwaysOnTop: prod ? true : false,
        kiosk: prod ? true : false,
        autoHideMenuBar: true,
        closable: false,
        fullscreen: prod ? true : false
    });
    window.loadFile("./src/site/index.html");
}
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
electron_1.app.on("activate", function () {
    if (electron_1.BrowserWindow.getAllWindows().length === 0)
        createWindow();
});
electron_1.app.on("ready", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, initCache()];
            case 1:
                _a.sent();
                createWindow();
                return [2 /*return*/];
        }
    });
}); });
function initCache() {
    return __awaiter(this, void 0, void 0, function () {
        var cacheFolderURL;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheFolderURL = process.cwd() + "/cache";
                    if (!!fs.existsSync(cacheFolderURL)) return [3 /*break*/, 2];
                    return [4 /*yield*/, fs_1.promises.mkdir(cacheFolderURL)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, initWeatherCache()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, initBusCache()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Updates the weather.json cache file every 10 mins with new data
function initWeatherCache() {
    return __awaiter(this, void 0, void 0, function () {
        function updateCache() {
            return __awaiter(this, void 0, void 0, function () {
                var url, _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            url = "https://api.openweathermap.org/data/2.5/weather?q=" + env_1["default"].owmCity + "&appid=" + env_1["default"].owmApiKey;
                            _b = (_a = fs_1.promises).writeFile;
                            _c = [cacheURL];
                            return [4 /*yield*/, node_fetch_1["default"](url)];
                        case 1: return [4 /*yield*/, (_d.sent()).text()];
                        case 2: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()]))];
                        case 3:
                            _d.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        var cacheURL;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheURL = process.cwd() + "/cache/weather.json";
                    return [4 /*yield*/, updateCache()];
                case 1:
                    _a.sent();
                    cron.schedule("*/5 * * * *", function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, updateCache()];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); });
                    return [2 /*return*/];
            }
        });
    });
}
// Updates the bus.json cache file every 10 seconds with new data
function initBusCache() {
    return __awaiter(this, void 0, void 0, function () {
        function updateCache() {
            var e_1, _a, e_2, _b;
            return __awaiter(this, void 0, void 0, function () {
                var stops, _c, _d, url, data, _e, _f, _g, _h, departure, line, e_2_1, e_1_1;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            stops = {};
                            _j.label = 1;
                        case 1:
                            _j.trys.push([1, 20, 21, 26]);
                            _c = __asyncValues(Object.entries(env_1["default"].busStops));
                            _j.label = 2;
                        case 2: return [4 /*yield*/, _c.next()];
                        case 3:
                            if (!(_d = _j.sent(), !_d.done)) return [3 /*break*/, 19];
                            url = _d.value;
                            _f = (_e = JSON).parse;
                            return [4 /*yield*/, node_fetch_1["default"](new URL(url[1]))];
                        case 4: return [4 /*yield*/, (_j.sent()).json()];
                        case 5: return [4 /*yield*/, _f.apply(_e, [(_j.sent())["Payload"]])];
                        case 6:
                            data = _j.sent();
                            _j.label = 7;
                        case 7:
                            _j.trys.push([7, 12, 13, 18]);
                            _g = (e_2 = void 0, __asyncValues(Object.values(data["departures"])));
                            _j.label = 8;
                        case 8: return [4 /*yield*/, _g.next()];
                        case 9:
                            if (!(_h = _j.sent(), !_h.done)) return [3 /*break*/, 11];
                            departure = _h.value;
                            line = (departure)["line"]["lineNo"] + "_" + url[0];
                            if (!stops[line])
                                stops[line] = {};
                            if (!stops[line][departure["area"]])
                                stops[line][departure["area"]] = [];
                            stops[line][departure["area"]].push(departure);
                            _j.label = 10;
                        case 10: return [3 /*break*/, 8];
                        case 11: return [3 /*break*/, 18];
                        case 12:
                            e_2_1 = _j.sent();
                            e_2 = { error: e_2_1 };
                            return [3 /*break*/, 18];
                        case 13:
                            _j.trys.push([13, , 16, 17]);
                            if (!(_h && !_h.done && (_b = _g["return"]))) return [3 /*break*/, 15];
                            return [4 /*yield*/, _b.call(_g)];
                        case 14:
                            _j.sent();
                            _j.label = 15;
                        case 15: return [3 /*break*/, 17];
                        case 16:
                            if (e_2) throw e_2.error;
                            return [7 /*endfinally*/];
                        case 17: return [7 /*endfinally*/];
                        case 18: return [3 /*break*/, 2];
                        case 19: return [3 /*break*/, 26];
                        case 20:
                            e_1_1 = _j.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 26];
                        case 21:
                            _j.trys.push([21, , 24, 25]);
                            if (!(_d && !_d.done && (_a = _c["return"]))) return [3 /*break*/, 23];
                            return [4 /*yield*/, _a.call(_c)];
                        case 22:
                            _j.sent();
                            _j.label = 23;
                        case 23: return [3 /*break*/, 25];
                        case 24:
                            if (e_1) throw e_1.error;
                            return [7 /*endfinally*/];
                        case 25: return [7 /*endfinally*/];
                        case 26: return [4 /*yield*/, fs_1.promises.writeFile(cacheURL, JSON.stringify(stops))];
                        case 27:
                            _j.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        var cacheURL;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheURL = process.cwd() + "/cache/busses.json";
                    return [4 /*yield*/, updateCache()];
                case 1:
                    _a.sent();
                    cron.schedule("*/10 * * * * *", function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, updateCache()];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); });
                    return [2 /*return*/];
            }
        });
    });
}
