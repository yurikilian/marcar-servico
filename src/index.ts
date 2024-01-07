import puppeteer from "puppeteer";
import ParameterCrawler from "./ParameterCrawler";
import configuration from "./configuration";
import log, { flushFile } from "./log";
import AttendanceLocalityScenario from "./scenario/AttendanteLocalityScenario";
import SchedulingSubjectScenario from "./scenario/SchedulingSubjectScenario";

import { notifyText, notifyImage } from "./telegram.js";
import { CronJob } from "cron";

async function launchBrowser() {
  return await puppeteer.launch({
    timeout: 60 * 1000, // 60s
    userDataDir: "./session",
    executablePath: configuration.getEnv().browserPath,
    headless: "new",
  });
}

let runCount = 0;

async function run() {
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
          page.setDefaultTimeout(2000);
          page.setDefaultNavigationTimeout(2000);

          try {
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
              log(
                `Nenhuma agenda disponível para o distrito de ${district.name}, localidade de ${locality.name} - ${place.name}`
              );
              // await page.screenshot({ path: "./image.png" });
              // await notifyImage(
              //   `Nenhuma agenda disponível para o distrito de ${district.name}, localidade de ${locality.name} - ${place.name}`
              // );
            }

            await page.close();
            await page.waitForTimeout(100);
          } catch (err: unknown) {
            let e: Error = err as Error;
            console.error(e.message);
            await page.screenshot({ path: "./image.png" });
            await notifyImage(
              `[WARNING] Falha ao executar o verificador. ${e.message}`
            );
          }
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

  runCount++;

  if (runCount % 2 === 0) {
    await flushFile();
  }
}

(async () => {
  notifyText(`Serviço de verificação de vagas inicializado. Data: ${new Date().toLocaleString()}`);
  log(`Servico inicializado: ${process.env.CRONTAB}`);

  const options = {
    cronTime: configuration.getEnv().crontab,
    onTick: async () => {
      log(`Execução de serviço disparada`);
      await run();
    },
    runOnInit: true,
  };

  const job = CronJob.from(options);
  job.start();
})();
