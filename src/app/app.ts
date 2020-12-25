require("log-timestamp");
import { app, BrowserWindow } from "electron";
import * as cron from "node-cron";
import { default as env } from "../env/env";
import { default as fetch } from "node-fetch";
import { promises as fsPromises } from "fs";
import * as fs from "fs";
import { exit } from "process";
import { stringify } from "querystring";

// import * as weatherCache from "../../cache/weather.json";

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
    // await initWeatherCache();
    await initBusCache();
    createWindow();
    // exit(0);
});

// Updates the weather.json cache file every 10 mins with new data
async function initWeatherCache() {
    const cacheURL = `${process.cwd()}/cache/weather.json`;
    async function updateCache() {
        await fsPromises.writeFile(cacheURL, await (await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${env.owmCity}&appid=${env.owmApiKey}`)).text());
        console.log("Updated Weather Cache");
    }
    if (!fs.existsSync(cacheURL) || await fsPromises.readFile(cacheURL, "utf-8") === "") await updateCache();
    cron.schedule("*/10 * * * *", async () => await updateCache());
}


// Updates the bus.json cache file every 10 seconds with new data
async function initBusCache() {
    const cacheURL = `${process.cwd()}/cache/busses.json`;
    async function updateCache() {
        const stops: { [id: string]: { [id: string]: Array<{ [id: string]: any }> } } = {};
        for await (const url of Object.values(env.busStops)) {
            const data = await JSON.parse((await (await fetch(new URL(url))).json())["Payload"]);
            for await (const departure of Object.values(data["departures"])) {
                const line = (departure as any)["line"]["lineNo"];
                if (!stops[line]) stops[line] = {};
                if (!stops[line][(departure as any)["area"]]) stops[line][(departure as any)["area"]] = [];
                stops[line][(departure as any)["area"]].push((departure as any));
            }
        }
        await fsPromises.writeFile(cacheURL, JSON.stringify(stops));
        console.log("Updated Bus Cache");
    }
    if (!fs.existsSync(cacheURL) || await fsPromises.readFile(cacheURL, "utf-8") === "") await updateCache();
    cron.schedule("*/10 * * * * *", async () => await updateCache());
}