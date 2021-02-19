import { app, BrowserWindow } from "electron";
import * as cron from "node-cron";
import { Environment, Owm } from "../env/env";
import fetch from "node-fetch";
import { promises as fsPromises } from "fs";
import * as fs from "fs";

const production = false;

// The error string used in the json cache to indicate a loss of intnernet
const internetError = `{"ERROR": "${Environment.InternetError}"}`;
const jsonError = `{"ERROR": "${Environment.JSONError}"}`;

function createWindow(): void {
    const window = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            devTools: production ? false : true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        alwaysOnTop: production ? true : false,
        kiosk: production ? true : false,
        autoHideMenuBar: true,
        closable: false,
        fullscreen: production ? true : false,
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

async function initCache() {
    const cacheFolderURL = `${process.cwd()}/cache`;
    // Create cache folder if not created
    if (!fs.existsSync(cacheFolderURL)) await fsPromises.mkdir(cacheFolderURL);
    await initWeatherCache();
    await initBusCache();
}

// Handles error and writes if error type is known
async function handleError(error: Error, path: string) {
    let errorType = "";
    if (error.name === "ENOTFOUND") {
        // Internet Error
        console.log("NO INTERNET");
    } else if (new RegExp("SyntaxError|JSON").test(error.message)) {
        // Json Syntax Error
        console.log("JSON SYNTAX ERROR");
    } else {
        console.log(error);
        return;
    }
    let errorObj = { ERROR: { type: errorType, message: "", name: "", stack: "" } };
    errorObj["ERROR"]["message"] = error.message;
    errorObj["ERROR"]["name"] = error.name;
    errorObj["ERROR"]["stack"] = error.stack?.toString() ?? "";
    await fsPromises.writeFile(path, JSON.stringify(errorObj));
}

// Updates the weather.json cache file every 10 mins with new data
async function initWeatherCache() {
    const cacheURL = `${process.cwd()}/cache/weather.json`;
    async function updateCache() {
        try {
            const owm: Owm = await Environment.getOWM();
            if (owm.city === undefined) throw owm;
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${owm.city}&appid=${owm.apiKey}`;
            await fsPromises.writeFile(cacheURL, await (await fetch(url)).text());
        } catch (error) {
            handleError(error, cacheURL);
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
            const envBusses = await Environment.getBusStops();
            if (envBusses.name !== undefined) throw envBusses;
            const stops: {
                [id: string]: { [id: string]: Array<{ [id: string]: string }> };
            } = {};
            // Sort and move data into a workable json
            for await (const jsonData of Object.entries(envBusses)) {
                const url = (jsonData[1] as any)["url"];
                const data = await JSON.parse((await (await fetch(url)).json())["Payload"]);
                for await (const departure of Object.values(data["departures"] as JSON)) {
                    const line = `${departure["line"]["lineNo"]}_${jsonData[0]}`;
                    const lineInt = parseInt(line);

                    // Check if line is supposed to be ignored
                    if (((jsonData[1] as any)["ignore"] ?? []).includes(lineInt)) continue;
                    // Check if line number is smaller than limit
                    if (lineInt < (jsonData[1] as any)["minLineNumber"] ?? 0) continue;
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
            handleError(error, cacheURL);
        }
    }
    await updateCache();
    cron.schedule("*/10 * * * * *", async () => await updateCache());
}
