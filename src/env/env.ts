import * as fs from "fs";

export class Owm {
    public apiKey = "";
    public city = "";
    constructor(apiKey: string, city: string) {
        this.apiKey = apiKey;
        this.city = city;
    }
}

export class Environment {
    public static async getBusStops() {
        try {
            return await JSON.parse(
                fs.readFileSync(`${process.cwd()}/busStops.json`, { encoding: "utf-8" })
            );
        } catch (error) {
            const e = error as Error;
            return e;
        }
    }

    public static async getOWM() {
        try {
            const info = await JSON.parse(
                fs.readFileSync(`${process.cwd()}/openWeatherMapInfo.json`, { encoding: "utf-8" })
            );
            return new Owm(info["key"], info["cityName"]);
        } catch (error) {
            return error;
        }
    }

    public static readonly InternetError = "INTERNET";
    public static readonly JSONError = "JSON";
}
