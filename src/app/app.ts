import { app, BrowserWindow } from "electron";
import * as cron from "node-cron";
import { default as env } from "../env/env";
import { default as fetch } from "node-fetch";
import { promises as fsPromises } from "fs";
import * as fs from "fs";

const prod = false;

const internetError = '{"ERROR": "INTERNET"}';

function createWindow(): void {
    const window = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            devTools: prod ? false : true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        alwaysOnTop: prod ? true : false,
        kiosk: prod ? true : false,
        autoHideMenuBar: true,
        closable: false,
        fullscreen: prod ? true : false,
    });

    window.loadFile(__dirname + "/../site/index.html");
}

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("ready", async () => {
    await initCache();
    createWindow();
});

async function writeError(path: string, data: string) {
    await fsPromises.writeFile(path, data);
}

async function initCache() {
    const cacheFolderURL = `${process.cwd()}/cache`;
    if (!fs.existsSync(cacheFolderURL)) await fsPromises.mkdir(cacheFolderURL);
    await initWeatherCache();
    await initBusCache();
}

// Updates the weather.json cache file every 10 mins with new data
async function initWeatherCache() {
    const cacheURL = `${process.cwd()}/cache/weather.json`;
    async function updateCache() {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${env.owmCity}&appid=${env.owmApiKey}`;
            await fsPromises.writeFile(cacheURL, await (await fetch(url)).text());
        } catch (error) {
            writeError(cacheURL, internetError);
        }
    }
    await updateCache();
    cron.schedule("*/10 * * * *", async () => await updateCache());
}

// Updates the bus.json cache file every 10 seconds with new data
async function initBusCache() {
    const cacheURL = `${process.cwd()}/cache/busses.json`;
    async function updateCache() {
        try {
            const stops: {
                [id: string]: { [id: string]: Array<{ [id: string]: string }> };
            } = {};
            for await (const jsonData of Object.entries(env.busStops)) {
                const url = (jsonData[1] as any)["url"];
                const data = await JSON.parse(
                    (await (await fetch(new URL(url))).json())["Payload"]
                );
                for await (const departure of Object.values(data["departures"] as JSON)) {
                    const line = `${departure["line"]["lineNo"]}_${jsonData[0]}`;
                    const ignore: number[] = (jsonData[1] as any)["ignore"] ?? [];

                    // Check if line is supposed to be ignored
                    if (ignore.includes(parseInt(line))) continue;
                    // Check if direction is supposed to be ignored
                    const directions: string[] = (jsonData[1] as any)["directions"] ?? [];
                    if (directions.length > 0 && !directions.includes(departure["area"])) continue;

                    if (!stops[line]) stops[line] = {};
                    if (!stops[line][departure["area"]]) stops[line][departure["area"]] = [];
                    stops[line][departure["area"]].push(departure);
                }
            }
            await fsPromises.writeFile(cacheURL, JSON.stringify(stops));
        } catch (error) {
            writeError(cacheURL, internetError);
        }
    }
    await updateCache();
    cron.schedule("*/10 * * * * *", async () => await updateCache());
}
