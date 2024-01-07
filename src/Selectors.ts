import { Page } from "puppeteer";
import {
  AvailableAttendancePlace,
  AvailableDistrict,
  AvailableLocality,
} from "./models";

export async function selectDistrict(page: Page, district: AvailableDistrict) {
  const select = await page.waitForSelector(
    "::-p-xpath(//*[@id='IdDistrito'])"
  );

  if (select) {
    await select.select(district.value);
    await select?.evaluate("pesquisaLocalidades(this)");
  }

  await page.waitForResponse(
    "https://siga.marcacaodeatendimento.pt/Marcacao/PesquisaLocalidades"
  );

  await page.waitForResponse(
    "https://siga.marcacaodeatendimento.pt/Marcacao/PesquisaLocalAtendimento"
  );
}

export async function selectLocality(page: Page, locality: AvailableLocality) {
  const select = await page.waitForSelector(
    "::-p-xpath(//*[@id='IdLocalidade'])"
  );

  if (select) {
    await select.select(locality.value);
    await select?.evaluate("pesquisaLocalAtendimento(this)");
  }
  await page.waitForResponse(
    "https://siga.marcacaodeatendimento.pt/Marcacao/PesquisaLocalAtendimento"
  );
}

export async function selectAttendancePlace(
  page: Page,
  place: AvailableAttendancePlace
) {
  const select = await page.waitForSelector(
    "::-p-xpath(//*[@id='IdLocalAtendimento'])"
  );

  if (select) {
    await select.select(place.value);
    await select?.evaluate("localAtendimentoChanged(this)");
  }
}
