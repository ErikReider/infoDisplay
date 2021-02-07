import * as fs from "fs";
// import * as owmKey from "./../../openWeatherMapInfo.json";

export class Owm {
    public apiKey = "";
    public city = "";
    constructor(apiKey: string, city: string) {
        this.apiKey = apiKey;
        this.city = city;
    }
}

export default class Environment {
    public static async getBusStops() {
        return await JSON.parse(
            fs.readFileSync(`${process.cwd()}/busStops.json`, { encoding: "utf-8" })
        );
    }

    public static async getOWM() {
        const info = await JSON.parse(
            fs.readFileSync(`${process.cwd()}/openWeatherMapInfo.json`, { encoding: "utf-8" })
        );
        return new Owm(info["key"], info["cityName"]);
    }
}
