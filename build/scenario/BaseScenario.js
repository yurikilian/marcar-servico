"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseScenario {
    async selectAndSetValue(selector, value) {
        const select = await this.page.waitForSelector(selector);
        if (select)
            await select.select(value);
    }
    constructor(page) {
        this.page = page;
    }
}
exports.default = BaseScenario;
//# sourceMappingURL=BaseScenario.js.map