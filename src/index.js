import dotenv from "dotenv";
import puppeteer from "puppeteer-core";
import Bot from "./bot.js";
import { notifyText, notifyImage } from "./telegram.js";
import { CronJob } from "cron";
import { format } from "date-fns";

dotenv.config();

const { CHROME_PATH } = process.env;

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
  const { browser, page } = await launchBrowser();

  try {
    await Bot.login(page);
    const isAvailable = await Bot.checkAvailability(page);
    await page.screenshot({ path: "./image.png" });

    if (isAvailable) {
      await notifyImage("@yurikilian. Horário disponível na agenda!");
    } else {
      await notifyText("Nenhum Horário disponvível");
    }
  } catch (err) {
    console.error(err);
    await notifyText(`[ERRO] Falha ao executar o verificador. ${err.message}`);
  } finally {
    await browser.close();
  }
}

(async () => {
  const options = {
    cronTime: process.env.CRONTAB,
    onTick: async () => {
      await run();
    },
    runOnInit: true,
  };

  const job = new CronJob(options);
  job.start();

  notifyText(
    `Procurando agenda para @yurikilian Data de início: ${format(
      new Date(),
      "dd/MM/yyyy"
    )}. ${process.env.MSG_TIME}`
  );
})();
