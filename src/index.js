import dotenv from "dotenv";
import puppeteer from "puppeteer-core";
import Bot from "./bot.js";
import { notifyText, notifyImage } from "./telegram.js";
import log from "./log.js";
import { CronJob } from "cron";

dotenv.config();

const { CHROME_PATH } = process.env;
const MAX_TRIES = 5;

let TRIES = 0;

async function launchBrowser() {
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 60 * 1000, // 60s
    userDataDir: "./session",
    executablePath: CHROME_PATH,
  });
  const page = await browser.newPage();

  return { browser, page };
}

async function run() {
  notifyText("Verficando disponibilidade do servico");

  const { browser, page } = await launchBrowser();

  try {
    await Bot.login(page);
    const isAvailable = await Bot.checkAvailability(page);
    await page.screenshot({ path: "./image.png" });

    if (isAvailable) {
      await notifyImage("Horário disponível");
    } else {
      await notifyText("Nenhum Horário disponvível");
    }

    log(isAvailable);
  } catch (err) {
    console.error(err);

    await notifyText(
      `[WARNING] Falha ao executar o verificador. ${err.message}`
    );
  } finally {
    await browser.close();
  }
}

(async () => {
  console.log("Servico inicializado: ", process.env.CRONTAB);

  const options = {
    cronTime: process.env.CRONTAB,
    onTick: async () => {
      console.log("Execução de serviço disparada");
      await run();
    },
    runOnInit: true,
  };

  const job = new CronJob(options);
  job.start();
})();
