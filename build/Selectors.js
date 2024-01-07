"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectAttendancePlace = exports.selectLocality = exports.selectDistrict = void 0;
async function selectDistrict(page, district) {
    const select = await page.waitForSelector("::-p-xpath(//*[@id='IdDistrito'])");
    if (select) {
        await select.select(district.value);
        await (select === null || select === void 0 ? void 0 : select.evaluate("pesquisaLocalidades(this)"));
    }
    await page.waitForResponse("https://siga.marcacaodeatendimento.pt/Marcacao/PesquisaLocalidades");
    await page.waitForResponse("https://siga.marcacaodeatendimento.pt/Marcacao/PesquisaLocalAtendimento");
}
exports.selectDistrict = selectDistrict;
async function selectLocality(page, locality) {
    const select = await page.waitForSelector("::-p-xpath(//*[@id='IdLocalidade'])");
    if (select) {
        await select.select(locality.value);
        await (select === null || select === void 0 ? void 0 : select.evaluate("pesquisaLocalAtendimento(this)"));
    }
    await page.waitForResponse("https://siga.marcacaodeatendimento.pt/Marcacao/PesquisaLocalAtendimento");
}
exports.selectLocality = selectLocality;
async function selectAttendancePlace(page, place) {
    const select = await page.waitForSelector("::-p-xpath(//*[@id='IdLocalAtendimento'])");
    if (select) {
        await select.select(place.value);
        await (select === null || select === void 0 ? void 0 : select.evaluate("localAtendimentoChanged(this)"));
    }
}
exports.selectAttendancePlace = selectAttendancePlace;
//# sourceMappingURL=Selectors.js.map