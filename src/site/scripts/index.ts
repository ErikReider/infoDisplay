import { default as Bus } from "./bus/bus";
import { promises as fsPromises } from "fs";
import * as fs from "fs";
import * as chokidar from "chokidar";
import LavaLampBubbles from "lava-lamp-bubbles";

window.onload = async () => {
    window.addEventListener("online", () => internetStatus(true));
    window.addEventListener("offline", () => internetStatus(false));

    // Initialize the canvas background
    new LavaLampBubbles("backgroundCanvas", 1, "#9C066B", "#2F004B").start();

    await initWeather();
    await initBusses();
    initTime();

    document.body.style.opacity = "1";
};

function internetStatus(online: boolean) {
    toggleInternetBanner(online);
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
            if (data["ERROR"] == "INTERNET") {
                toggleInternetBanner(false);
                return;
            }
            toggleInternetBanner(true);

            // Converts from Kelvin to Celsius
            temp = `${(Number(data["main"]["temp"]) - 273.15).toFixed(0)}℃`;
            iconURL = `../assets/weatherIcons/${data["weather"][0]["icon"]}.svg`;
        }
        weatherImg.src = iconURL;
        weatherTemp.textContent = temp;
    }
    await updateWeatherElements();
    // Watch for cache file changes. Should be a ~2 second delay
    chokidar
        .watch(cacheURL, {
            awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 100 },
        })
        .on("change", async () => await updateWeatherElements());
}

async function initBusses() {
    const cacheURL = `${process.cwd()}/cache/busses.json`;
    const allBusses = <HTMLDivElement>document.getElementById("allBusses");

    async function updateBusses() {
        if (!fs.existsSync(cacheURL)) return;
        const rawData = await fsPromises.readFile(cacheURL, "utf-8");
        if (rawData === "" || Object.keys(JSON.parse(rawData)).length == 0) {
            allBusses.innerHTML = '<span class="noBusses">No Busses...</span>';
            return;
        }

        // Removes all previous busses from the DOM
        while (allBusses.lastElementChild) {
            allBusses.removeChild(allBusses.lastElementChild);
        }
        const data = await JSON.parse(rawData);
        if (data["ERROR"] == "INTERNET") {
            toggleInternetBanner(false);
            return;
        }
        toggleInternetBanner(true);

        // Sort by bus number. Each key will be BUSNUMBER_BUSSTOP
        const busses: [string, any][] = Object.entries(data).sort((a, b) => {
            return Number(a[0].split("_")[0]) > Number(b[0].split("_")[0]) ? 1 : -1;
        });
        for await (const bus of busses) {
            allBusses.appendChild(new Bus(bus[0], bus[1]).returnElement());
        }
    }
    await updateBusses();
    // Watch for cache file changes. Should be a ~2 second delay
    chokidar
        .watch(cacheURL, {
            awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 100 },
        })
        .on("change", async () => {
            await updateBusses();
        });
}

function initTime() {
    const timeElement = <HTMLSpanElement>document.getElementById("timeElement");
    const monthElement = <HTMLSpanElement>document.getElementById("dateMonth");
    const dayElement = <HTMLSpanElement>document.getElementById("dateDay");
    function updateTime() {
        const date = new Date();
        // Clock
        // Add 0 to beginging if length isn't 2, ex 05 instead 0f 5
        const hours = ("0" + date.getHours().toString()).slice(-2);
        const minutes = ("0" + date.getMinutes().toString()).slice(-2);
        const seconds = ("0" + date.getSeconds().toString()).slice(-2);
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        // Date
        monthElement.textContent = date.toLocaleString("default", {
            month: "short",
        });
        dayElement.textContent = date.getDate().toLocaleString();
        setTimeout(() => updateTime(), 1000);
    }
    updateTime();
}

function toggleInternetBanner(hasInternet: boolean) {
    const errorBanner = <HTMLDivElement>document.getElementById("errorBanner");
    if (hasInternet) {
        if (errorBanner.getAttribute("data-visible") == "false") return;
        console.log("Internet");
        const duration = (parseFloat(getComputedStyle(errorBanner).transitionDuration) ?? 0) * 1000;
        errorBanner.style.opacity = "0";
        setTimeout(() => {
            errorBanner.style.display = "none";
        }, duration);
        errorBanner.setAttribute("data-visible", "false");
    } else {
        if (errorBanner.getAttribute("data-visible") == "true") return;
        console.log("No Internet");
        errorBanner.style.display = "flex";
        errorBanner.clientWidth;
        errorBanner.style.opacity = "1";
        errorBanner.setAttribute("data-visible", "true");
    }
}
