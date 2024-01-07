import puppeteer from "puppeteer";
import ParameterCrawler from "./ParameterCrawler";
import configuration from "./configuration";
import log from "./log";
import AttendanceLocalityScenario from "./scenario/AttendanteLocalityScenario";
import SchedulingSubjectScenario from "./scenario/SchedulingSubjectScenario";

import { notifyText, notifyImage } from "./telegram.js";
// import { CronJob } from "cron";

async function launchBrowser() {
  return await puppeteer.launch({
    timeout: 60 * 1000, // 60s
    userDataDir: "./session",
    executablePath: configuration.getEnv().browserPath,
    headless: "new",
  });
}

async function run() {
  notifyText("Verficando disponibilidade do servico");
  const browser = await launchBrowser();
  try {
    const [page] = await browser.pages();
    await page.goto(configuration.getEnv().url, {
      waitUntil: "networkidle2",
    });

    await page.setViewport({ width: 1900, height: 1080 });

    await new SchedulingSubjectScenario(page).execute();
    const districts = await new ParameterCrawler(page).fetchDistrictOptions();
    await page.close();

    for (const district of districts) {
      for (const locality of district.localities) {
        for (const place of locality.places) {
          log(
            `Distrito de ${district.name}, localidade de ${locality.name} - ${place.name}`
          );
          const page = await browser.newPage();
          page.setViewport({ width: 1920, height: 1080 });
          await page.goto(configuration.getEnv().url, {
            waitUntil: "networkidle2",
          });

          await new SchedulingSubjectScenario(page).execute();
          await new AttendanceLocalityScenario(
            page,
            district,
            locality,
            place
          ).execute();

          let scheduleAvailable = true;
          try {
            const errorHtml = await page.waitForSelector(
              "div.error-message > div > div > h5",
              {
                timeout: 1000,
              }
            );

            const errorMessage = await errorHtml?.evaluate(
              (el) => el.textContent
            );
            console.log(errorMessage);
            if (errorMessage) {
              log(
                `${errorMessage} Distrito de ${district.name}, localidade de ${locality.name} - ${place.name}`
              );

              scheduleAvailable = false;
            }
          } catch (error) {
            console.log(error);
          }

          if (scheduleAvailable) {
            log(
              `Agenda disponível para o distrito de ${district.name}, localidade de ${locality.name} - ${place.name}`
            );

            await page.screenshot({ path: "./image.png" });
            await notifyImage(
              `Agenda disponível para o distrito de ${district.name}, localidade de ${locality.name} - ${place.name}`
            );
          } else {
            await page.screenshot({ path: "./image.png" });
            await notifyImage(
              `Nenhuma agenda disponível para o distrito de ${district.name}, localidade de ${locality.name} - ${place.name}`
            );
          }

          await page.close();
        }
      }
    }
  } catch (err: unknown) {
    let e: Error = err as Error;
    console.error(e.message);

    await notifyText(`[WARNING] Falha ao executar o verificador. ${e.message}`);
  } finally {
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
