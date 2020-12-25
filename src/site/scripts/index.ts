require("log-timestamp");
import { default as env } from "../../env/env";
import { default as Bus } from "./bus/bus";
import { promises as fsPromises } from 'fs';
import * as fs from 'fs';

onload = async () => {
    await initWeather();
    await initBusses();

    document.body.style.opacity = "1";
};

async function initWeather() {
    window.customElements.define("iw-bus", Bus);
    const cacheURL = `${process.cwd()}/cache/weather.json`;
    const weatherImg = <HTMLImageElement>document.getElementById("weatherImage");
    const weatherTemp = <HTMLImageElement>document.getElementById("weatherTemp");
    async function updateWeatherElements() {
        if (!fs.existsSync(cacheURL)) return;
        const rawData = await fsPromises.readFile(cacheURL, "utf-8");
        let temp = "No data";
        let iconURL = "../assets/weatherIcons/01d.svg";
        if (rawData !== "") {
            const data = await JSON.parse(rawData);
            temp = `${(Number(data["main"]["temp"]) - 273.15).toFixed(0)}℃`;
            iconURL = `../assets/weatherIcons/${data["weather"][0]["icon"]}.svg`;
        }
        weatherImg.src = iconURL;
        weatherTemp.textContent = temp;
        console.log("Updated Weather Elements");
    }
    await updateWeatherElements();
    fs.watch(cacheURL, (async (e, name) => await updateWeatherElements()));
}

async function initBusses() {
    const cacheURL = `${process.cwd()}/cache/busses.json`;
    const allBusses = <HTMLDivElement>document.getElementById("allBusses");
    async function updateBusses() {
        if (!fs.existsSync(cacheURL)) return;
        const rawData = await fsPromises.readFile(cacheURL, "utf-8");
        if (rawData !== "") {
            const data = await JSON.parse(rawData);
            Object.entries(data).forEach((bus: any) => {
                // const busElem = <HTMLDivElement>document.getElementById(bus[0]);
                // if (busElem) {
                //     // busElem
                //     return;
                // }
                // allBusses.appendChild(new Bus(bus[0], bus[1]));
            });
            console.log("Updated Bus Elements");
            return;
        }
        console.log("No Busses...");
    }
    await updateBusses();
    fs.watch(cacheURL, (async (e, name) => await updateBusses()));
}