import * as fs from "fs";
import * as owmKey from "./../../openWeatherMapInfo.json";

export default class Environment {
    public static busStops = JSON.parse(
        fs.readFileSync(`${process.cwd()}/busStops.json`, { encoding: "utf-8" })
    );
    public static owmApiKey = owmKey.key;
    public static owmCity = owmKey.cityName;
}

