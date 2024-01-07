"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const ParameterCrawler_1 = __importDefault(require("./ParameterCrawler"));
const configuration_1 = __importDefault(require("./configuration"));
const log_1 = __importDefault(require("./log"));
const AttendanteLocalityScenario_1 = __importDefault(require("./scenario/AttendanteLocalityScenario"));
const SchedulingSubjectScenario_1 = __importDefault(require("./scenario/SchedulingSubjectScenario"));
const telegram_js_1 = require("./telegram.js");
// import { CronJob } from "cron";
async function launchBrowser() {
    return await puppeteer_1.default.launch({
        timeout: 60 * 1000, // 60s
        userDataDir: "./session",
        executablePath: configuration_1.default.getEnv().browserPath,
        headless: "new",
    });
}
async function run() {
    (0, telegram_js_1.notifyText)("Verficando disponibilidade do servico");
    const browser = await launchBrowser();
    try {
        const [page] = await browser.pages();
        await page.goto(configuration_1.default.getEnv().url, {
            waitUntil: "networkidle2",
        });
        await page.setViewport({ width: 1900, height: 1080 });
        await new SchedulingSubjectScenario_1.default(page).execute();
        const districts = await new ParameterCrawler_1.default(page).fetchDistrictOptions();
        await page.close();
        for (const district of districts) {
            for (const locality of district.localities) {
                for (const place of locality.places) {
                    (0, log_1.default)(`Distrito de ${district.name}, localidade de ${locality.name} - ${place.name}`);
                    const page = await browser.newPage();
                    page.setViewport({ width: 1920, height: 1080 });
                    await page.goto(configuration_1.default.getEnv().url, {
                        waitUntil: "networkidle2",
                    });
                    await new SchedulingSubjectScenario_1.default(page).execute();
                    await new AttendanteLocalityScenario_1.default(page, district, locality, place).execute();
                    let scheduleAvailable = true;
                    try {
                        const errorHtml = await page.waitForSelector("div.error-message > div > div > h5", {
                            timeout: 1000,
                        });
                        const errorMessage = await (errorHtml === null || errorHtml === void 0 ? void 0 : errorHtml.evaluate((el) => el.textContent));
                        console.log(errorMessage);
                        if (errorMessage) {
                            (0, log_1.default)(`${errorMessage} Distrito de ${district.name}, localidade de ${locality.name} - ${place.name}`);
                            scheduleAvailable = false;
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                    if (scheduleAvailable) {
                        (0, log_1.default)(`Agenda disponível para o distrito de ${district.name}, localidade de ${locality.name} - ${place.name}`);
                        await page.screenshot({ path: "./image.png" });
                        await (0, telegram_js_1.notifyImage)(`Agenda disponível para o distrito de ${district.name}, localidade de ${locality.name} - ${place.name}`);
                    }
                    else {
                        await page.screenshot({ path: "./image.png" });
                        await (0, telegram_js_1.notifyImage)(`Nenhuma agenda disponível para o distrito de ${district.name}, localidade de ${locality.name} - ${place.name}`);
                    }
                    await page.close();
                }
            }
        }
    }
    catch (err) {
        let e = err;
        console.error(e.message);
        await (0, telegram_js_1.notifyText)(`[WARNING] Falha ao executar o verificador. ${e.message}`);
    }
    finally {
        await browser.close();
    }
}
(async () => {
    // console.log("Servico inicializado: ", process.env.CRONTAB);
    // const options = {
    //   cronTime: process.env.CRONTAB,
    //   onTick: async () => {
    //     console.log("Execução de serviço disparada");
    //     await run();
    //   },
    //   runOnInit: true,
    // };
    // const job = new CronJob(options);
    // job.start();
    await run();
})();
//# sourceMappingURL=index.js.map