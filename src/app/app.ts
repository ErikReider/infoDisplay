import { app, BrowserWindow } from "electron";
import * as cron from "node-cron";
import { default as env } from "../env/env";
import { default as fetch } from "node-fetch";
import { promises as fsPromises } from "fs";
import * as fs from "fs";

const prod = false;

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

    window.loadFile("./src/site/index.html");
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
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${env.owmCity}&appid=${env.owmApiKey}`;
        await fsPromises.writeFile(cacheURL, await (await fetch(url)).text());
    }
    await updateCache();
    cron.schedule("*/5 * * * *", async () => await updateCache());
}

// Updates the bus.json cache file every 10 seconds with new data
async function initBusCache() {
    const cacheURL = `${process.cwd()}/cache/busses.json`;
    async function updateCache() {
        const stops: {
            [id: string]: { [id: string]: Array<{ [id: string]: string }> };
        } = {};
        for await (const url of Object.entries(env.busStops)) {
            const data = await JSON.parse(
                (await (await fetch(new URL(url[1] as string))).json())[
                    "Payload"
                ]
            );
            for await (const departure of Object.values(
                data["departures"] as JSON
            )) {
                const line = `${departure["line"]["lineNo"]}_${url[0]}`;
                if (!stops[line]) stops[line] = {};
                if (!stops[line][departure["area"]])
                    stops[line][departure["area"]] = [];
                stops[line][departure["area"]].push(departure);
            }
        }
        await fsPromises.writeFile(cacheURL, JSON.stringify(stops));
    }
    await updateCache();
    cron.schedule("*/10 * * * * *", async () => await updateCache());
}

