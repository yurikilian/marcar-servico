"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Selectors_1 = require("./Selectors");
class ParameterCrawler {
    constructor(page) {
        this.page = page;
    }
    async fetchDistrictOptions() {
        const districtOptions = await this.page.$$eval("#IdDistrito option", (options) => options
            .filter((option) => option.value.length > 0)
            .map((option) => ({
            name: option.innerText,
            value: option.value,
            localities: [],
        })));
        const fullDistrictOptions = [];
        for (const districtOption of districtOptions) {
            const localities = await this.fetchDistrictLocalities(districtOption);
            await this.page.waitForTimeout(50);
            fullDistrictOptions.push({ ...districtOption, localities });
        }
        return fullDistrictOptions;
    }
    async fetchDistrictLocalities(districtOption) {
        await (0, Selectors_1.selectDistrict)(this.page, districtOption);
        const localities = await this.page.$$eval("#IdLocalidade option", (options) => options
            .filter((option) => option.value.length > 0)
            .map((option) => ({
            name: option.innerText,
            value: option.value,
            places: [],
        })));
        const fullLocalities = [];
        for (const locality of localities) {
            const places = await this.fetchLocalityPlaces(locality);
            fullLocalities.push({ ...locality, places });
        }
        return fullLocalities;
    }
    async fetchLocalityPlaces(option) {
        await (0, Selectors_1.selectLocality)(this.page, option);
        return await this.page.$$eval("#IdLocalAtendimento option", (options) => options
            .filter((option) => option.value.length > 0)
            .map((option) => ({
            name: option.innerText,
            value: option.value,
        })));
    }
}
exports.default = ParameterCrawler;
//# sourceMappingURL=ParameterCrawler.js.map