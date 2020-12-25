import * as stops from "./../../busStops.json";
import * as owmKey from "./../../openWeatherMapInfo.json";

export default class Environment {
    public static busStops = stops;
    public static owmApiKey = owmKey.key;
    public static owmCity = owmKey.cityName;
}