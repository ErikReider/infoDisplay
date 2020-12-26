"use strict";
exports.__esModule = true;
var fs = require("fs");
var owmKey = require("./../../openWeatherMapInfo.json");
var Environment = /** @class */ (function () {
    function Environment() {
    }
    Environment.busStops = JSON.parse(fs.readFileSync(process.cwd() + "/busStops.json", { encoding: "utf-8" }));
    Environment.owmApiKey = owmKey.key;
    Environment.owmCity = owmKey.cityName;
    return Environment;
}());
exports["default"] = Environment;
