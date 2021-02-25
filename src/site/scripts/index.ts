import Bus from "./bus/bus";
import { promises as fsPromises } from "fs";
import * as fs from "fs";
import * as chokidar from "chokidar";
import { Environment } from "../../env/env";

window.onload = async () => {
    window.addEventListener("online", () => toggleInternetBanner(true));
    window.addEventListener("offline", () => toggleInternetBanner(false));

    await initWeather();
    await initBusses();
    initTime();

    scrollBusses(4000);

    document.body.style.opacity = "1";
};

async function initWeather() {
    const cacheURL = `${process.cwd()}/cache/weather.json`;
    const weatherImg = <HTMLImageElement>document.getElementById("weatherImage");
    const weatherTemp = <HTMLImageElement>document.getElementById("weatherTemp");

    async function updateWeatherElements() {
        if (!fs.existsSync(cacheURL)) return;
        const rawData = await fsPromises.readFile(cacheURL, "utf-8");
        let temp = "No data";
        let iconURL = "noInternet.svg";
        if (rawData !== "") {
            const data = await JSON.parse(rawData);
            if ((data["ERROR"] ?? [])["type"] === Environment.InternetError) {
                toggleInternetBanner(false);
            } else if ((data["ERROR"] ?? [])["type"] === Environment.JSONError) {
                toggleAlert(true, data["ERROR"] as Error);
            } else {
                toggleInternetBanner(true);
                toggleAlert(false, Error());
                // Converts from Kelvin to Celsius
                temp = `${(Number(data["main"]["temp"]) - 273.15).toFixed(0)}℃`;
                iconURL = `${data["weather"][0]["icon"]}.svg`;
            }
        }
        weatherImg.src = `../assets/weatherIcons/${iconURL}`;
        weatherTemp.textContent = temp;
    }
    await updateWeatherElements();
    // Watch for cache file changes. Should be a ~2 second delay
    // to make sure that the file has been fully written to
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
        if ((data["ERROR"] ?? [])["type"] === Environment.InternetError) {
            toggleInternetBanner(false);
            return;
        } else if ((data["ERROR"] ?? [])["type"] === Environment.JSONError) {
            toggleAlert(true, data["ERROR"] as Error);
            return;
        }
        toggleInternetBanner(true);
        toggleAlert(false, Error());

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
    // to make sure that the file has been fully written to
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

function scrollBusses(delay: number) {
    const allBusses = <HTMLDivElement>document.getElementById("allBusses");
    // allBusses.style.marginLeft = "-400vw";
    setInterval(() => {
        allBusses.style.marginLeft =
            allBusses.clientWidth == allBusses.scrollWidth
                ? "0"
                : `${parseInt(allBusses.style.marginLeft || "0") - 100}vw`;
    }, delay + parseInt(getComputedStyle(allBusses).transitionDuration || "0") * 1000);
}

function toggleAlert(show: boolean, error: Error) {
    const alert = <HTMLDivElement>document.getElementById("alert");
    const alertTitle = <HTMLSpanElement>document.getElementById("alertTitle");
    const alertMessage = <HTMLSpanElement>document.getElementById("alertMessage");

    alertTitle.innerText = error.name;
    alertMessage.innerText = error.stack?.toString() ?? "";
    if (show) {
        if (alert.getAttribute("data-visible") === "true") return;
        alert.style.display = "flex";
        alert.clientWidth;
        alert.style.opacity = "1";
        alert.setAttribute("data-visible", "true");
    } else {
        if (alert.getAttribute("data-visible") === "false") return;
        alert.style.opacity = "0";
        setTimeout(() => {
            alert.style.display = "none";
        }, parseFloat(getComputedStyle(alert).transitionDuration || "0") * 1000);
        alert.setAttribute("data-visible", "false");
    }
}

function toggleInternetBanner(hasInternet: boolean) {
    const errorBanner = <HTMLDivElement>document.getElementById("errorBanner");
    if (hasInternet) {
        if (errorBanner.getAttribute("data-visible") === "false") return;
        console.log("Internet");
        errorBanner.style.opacity = "0";
        setTimeout(() => {
            errorBanner.style.display = "none";
        }, parseFloat(getComputedStyle(errorBanner).transitionDuration || "0") * 1000);
        errorBanner.setAttribute("data-visible", "false");
    } else {
        if (errorBanner.getAttribute("data-visible") === "true") return;
        console.log("No Internet");
        errorBanner.style.display = "flex";
        errorBanner.clientWidth;
        errorBanner.style.opacity = "1";
        errorBanner.setAttribute("data-visible", "true");
    }
}
