import { default as Bus } from "./bus/bus";
import { promises as fsPromises } from "fs";
import * as fs from "fs";
import * as chokidar from "chokidar";

onload = async () => {
    await initWeather();
    await initBusses();
    initTime();

    document.body.style.opacity = "1";
    document.body.style.transform = "scale(1)";
};

function initTime() {
    const timeElement = <HTMLSpanElement>document.getElementById("timeElement");
    const dateMonth = <HTMLSpanElement>document.getElementById("dateMonth");
    const dateDay = <HTMLSpanElement>document.getElementById("dateDay");
    function updateTime() {
        const date = new Date();
        // Clock
        const hours = ("0" + date.getHours().toString()).slice(-2);
        const minutes = ("0" + date.getMinutes().toString()).slice(-2);
        const seconds = ("0" + date.getSeconds().toString()).slice(-2);
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        // Date
        dateMonth.textContent = date.toLocaleString("default", { month: "short" });
        dateDay.textContent = date.getDate().toLocaleString();
        setTimeout(() => updateTime(), 1000);
    }
    updateTime();
}

async function initWeather() {
    const cacheURL = `${process.cwd()}/cache/weather.json`;
    const weatherImg = <HTMLImageElement>document.getElementById("weatherImage");
    const weatherTemp = <HTMLImageElement>document.getElementById("weatherTemp");
    async function updateWeatherElements() {
        if (!fs.existsSync(cacheURL)) return;
        const rawData = await fsPromises.readFile(cacheURL, "utf-8");
        let temp = "No data";
        let iconURL = "";
        if (rawData !== "") {
            const data = await JSON.parse(rawData);
            temp = `${(Number(data["main"]["temp"]) - 273.15).toFixed(0)}℃`;
            iconURL = `../assets/weatherIcons/${data["weather"][0]["icon"]}.svg`;
        }
        weatherImg.src = iconURL;
        weatherTemp.textContent = temp;
    }
    await updateWeatherElements();
    // Watch for cache file changes
    chokidar.watch(cacheURL, {
        awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 100 }
    }).on("change", (async () => await updateWeatherElements()));
}

async function initBusses() {
    const cacheURL = `${process.cwd()}/cache/busses.json`;
    const allBusses = <HTMLDivElement>document.getElementById("allBusses");
    async function updateBusses() {
        if (!fs.existsSync(cacheURL)) return;
        const rawData = await fsPromises.readFile(cacheURL, "utf-8");
        if (rawData === "" || Object.keys(JSON.parse(rawData)).length == 0) {
            allBusses.innerHTML = "<span class=\"noBusses\">No Busses...</span>";
            return;
        }

        while (allBusses.lastElementChild) {
            allBusses.removeChild(allBusses.lastElementChild);
        }
        // Sort by bus number
        const busses: [string, any][] = Object.entries(await JSON.parse(rawData)).sort((a, b) => {
            return Number(a[0].split("_")[0]) > Number(b[0].split("_")[0]) ? 1 : -1;
        });
        for await (const bus of busses) {
            allBusses.appendChild(new Bus(bus[0], bus[1]).returnElement());
        }
    }
    await updateBusses();
    // Watch for cache file changes
    chokidar.watch(cacheURL, {
        awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 100 }
    }).on("change", (async () => {
        await updateBusses();
    }));
}