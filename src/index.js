import dotenv from 'dotenv';
import puppeteer from "puppeteer-core";



import Bot from './bot.js'
import {notifyText, notifyImage} from './telegram.js'
import log from './log.js'


dotenv.config()

const { CHROME_PATH } = process.env
const MAX_TRIES = 5

let TRIES = 0

async function launchBrowser() {
    const browser = await puppeteer.launch({
        headless: true,
        timeout: 60 * 1000, // 60s
        userDataDir: "./session",
        executablePath: CHROME_PATH,
    });
    const page = await browser.newPage();

    return { browser, page }
}

async function run() {

    const { browser, page } = await launchBrowser()

    try {
        await Bot.login(page)
        const isAvailable = await Bot.checkAvailability(page)
        await page.screenshot({ "path": './image.png' })

        if (isAvailable) {
            await notifyImage("Tem horário disponível")
        } else {
            log("Horaios indisponiveis")
        }
        
        log(isAvailable)

    } catch (err) {
        log(err);
        
        if (TRIES <= MAX_TRIES) {
            TRIES += 1;
            await run()
        } else {
            log("Tentou, tentou e não conseguiu");
        }
    } finally {
        await browser.close()
    }
}

(async () => {
    await run()
})()