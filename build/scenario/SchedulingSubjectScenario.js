"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __importDefault(require("../log"));
const BaseScenario_1 = __importDefault(require("./BaseScenario"));
class SchedulingSubjectScenario extends BaseScenario_1.default {
    async execute() {
        (0, log_1.default)("navigateSchedulingSubject -- START");
        await this.clickStart();
        (0, log_1.default)("clickIRN");
        await this.clickIRN();
        (0, log_1.default)("selectCategory");
        await this.selectCategory();
        (0, log_1.default)("waitAndSelectForSubCategory");
        await this.waitAndSelectForSubCategory();
        (0, log_1.default)("waitAndSelectMotive");
        await this.waitAndSelectMotive();
        (0, log_1.default)("clickNext");
        await Promise.all([
            this.clickNext(),
            this.page.waitForNavigation({ waitUntil: "networkidle2" }),
        ]);
        (0, log_1.default)("navigateSchedulingSubject -- END");
    }
    async waitAndSelectMotive() {
        const motiveInputSelect = await this.page.waitForSelector("::-p-xpath(/html/body/form/div[1]/div/div[3]/div/select)");
        if (motiveInputSelect)
            await motiveInputSelect.select("30826");
    }
    async waitAndSelectForSubCategory() {
        await this.page.waitForResponse("https://siga.marcacaodeatendimento.pt/Marcacao/PesquisaSubcategorias");
        const subThemeInputSelect = await this.page.waitForSelector("::-p-xpath(/html/body/form/div[1]/div/div[2]/div/select)");
        if (subThemeInputSelect)
            await subThemeInputSelect.select("30825");
    }
    async selectCategory() {
        const themeInputSelect = await this.page.waitForSelector("::-p-xpath(//*[@id='IdCategoria'])");
        if (themeInputSelect)
            await themeInputSelect.select("22002");
    }
    async clickIRN() {
        const irnScheduleButton = await this.page.waitForSelector("::-p-xpath(/html/body/form/div/div[1]/div/div[7]/div[3]/button)");
        if (irnScheduleButton)
            await irnScheduleButton.click();
    }
    async clickStart() {
        (0, log_1.default)("Click start");
        const startScheduleButton = await this.page.waitForSelector("body > div.container.div-marcacao-inicio > div.row.inicio-cards > div.card-entidade-assunto.card-entidade > div.div-button > input");
        if (startScheduleButton)
            await startScheduleButton.click();
    }
    async clickNext() {
        await this.page.waitForResponse("https://siga.marcacaodeatendimento.pt/Marcacao/ObterNumeroCasosAssunto");
        (0, log_1.default)("next click");
        await this.page.$eval("#proximoButton", (elem) => elem.click()); // works
    }
}
exports.default = SchedulingSubjectScenario;
//# sourceMappingURL=SchedulingSubjectScenario.js.map