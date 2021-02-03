import { Application } from "spectron";
import assert from "assert";
import electron from "electron";
import path from "path";
import { promises as fsPromises } from "fs";

describe("Application launch", function () {
    this.timeout(50000);
    var application: Application;

    function sleep(ms: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    beforeEach(async () => {
        application = new Application({
            path: (electron as unknown) as string,
            args: [path.join(__dirname, "../src/app/app.js")],
        });
        return await application.start();
    });

    afterEach(() => {
        if (application && application.isRunning()) return application.stop();
    });

    it("shows an initial window", async () => {
        const count = await application.client.getWindowCount();
        return assert.strictEqual(count, 1);
    });

    it("Test time", async () => {
        const time = await application.webContents.executeJavaScript(
            "document.getElementById('timeElement').textContent"
        );
        const date = new Date();
        const hours = ("0" + date.getHours().toString()).slice(-2);
        const minutes = ("0" + date.getMinutes().toString()).slice(-2);
        const seconds = ("0" + date.getSeconds().toString()).slice(-2);
        return time === `${hours}:${minutes}:${seconds}`;
    });

    it("Test Weather Data", async () => {
        const initData = await fsPromises.readFile(
            __dirname + "/../cache/weather.json",
            "utf8"
        );
        const testData = await fsPromises.readFile(
            __dirname + "/testData/weatherTestData.json",
            "utf8"
        );
        await fsPromises.writeFile(
            __dirname + "/../cache/weather.json",
            testData,
            "utf8"
        );
        await sleep(3000);
        const temperature = await application.webContents.executeJavaScript(
            "document.getElementById('weatherTemp').textContent"
        );
        const icon = await application.webContents.executeJavaScript(
            "document.getElementById('weatherImage').src"
        );
        try {
            assert.strictEqual(temperature, "1℃");
            assert.strictEqual(icon.split("/").slice(-1)[0], "13n.svg");
        } catch (error) {
            throw error;
        } finally {
            // Restore the original weather data
            await fsPromises.writeFile(
                __dirname + "/../cache/weather.json",
                initData,
                "utf8"
            );
        }
    });
});
