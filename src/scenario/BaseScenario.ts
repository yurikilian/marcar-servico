import { Page } from "puppeteer";

interface Scenario {
  execute(page: Page): Promise<void>;
}

abstract class BaseScenario implements Scenario {
  protected page: Page;
  abstract execute(page: Page): Promise<void>;

  async selectAndSetValue(selector: string, value: string) {
    const select = await this.page.waitForSelector(selector);
    if (select) await select.select(value);
  }

  constructor(page: Page) {
    this.page = page;
  }
}

export default BaseScenario;
