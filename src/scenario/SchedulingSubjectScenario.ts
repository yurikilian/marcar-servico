import configuration from "../configuration";
import log from "../log";
import BaseScenario from "./BaseScenario";

export default class SchedulingSubjectScenario extends BaseScenario {
  async execute() {
    log("navigateSchedulingSubject -- START");

    await this.clickStart();
    log("clickIRN");

    await this.clickIRN();

    log("selectCategory");
    await this.selectCategory();

    log("waitAndSelectForSubCategory");
    await this.waitAndSelectForSubCategory();

    log("waitAndSelectMotive");
    await this.waitAndSelectMotive();

    log("clickNext");
    await Promise.all([
      this.clickNext(),
      this.page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);

    log("navigateSchedulingSubject -- END");
  }

  async waitAndSelectMotive() {
    const motiveInputSelect = await this.page.waitForSelector(
      "::-p-xpath(/html/body/form/div[1]/div/div[3]/div/select)"
    );

    if (motiveInputSelect) await motiveInputSelect.select("30826");
  }

  async waitAndSelectForSubCategory() {
    await this.page.waitForResponse(
      "https://siga.marcacaodeatendimento.pt/Marcacao/PesquisaSubcategorias"
    );

    const subThemeInputSelect = await this.page.waitForSelector(
      "::-p-xpath(/html/body/form/div[1]/div/div[2]/div/select)"
    );
    if (subThemeInputSelect) await subThemeInputSelect.select("30825");
  }

  async selectCategory() {
    const themeInputSelect = await this.page.waitForSelector(
      "::-p-xpath(//*[@id='IdCategoria'])"
    );
    if (themeInputSelect) await themeInputSelect.select("22002");
  }

  async clickIRN() {
    const irnScheduleButton = await this.page.waitForSelector(
      "::-p-xpath(/html/body/form/div/div[1]/div/div[7]/div[3]/button)"
    );

    if (irnScheduleButton) await irnScheduleButton.click();
  }

  async clickStart() {
    log("Click start");
    const startScheduleButton = await this.page.waitForSelector(
      "body > div.container.div-marcacao-inicio > div.row.inicio-cards > div.card-entidade-assunto.card-entidade > div.div-button > input"
    );

    if (startScheduleButton) await startScheduleButton.click();
  }

  async clickNext() {
    await this.page.waitForResponse(
      "https://siga.marcacaodeatendimento.pt/Marcacao/ObterNumeroCasosAssunto"
    );

    log("next click");

    await this.page.$eval("#proximoButton", (elem: any) => elem.click()); // works
  }
}
