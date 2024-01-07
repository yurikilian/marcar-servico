import { Page } from "puppeteer";
import { selectDistrict, selectLocality } from "./Selectors";
import {
  AvailableAttendancePlace,
  AvailableDistrict,
  AvailableLocality,
} from "./models";

export default class ParameterCrawler {
  constructor(private page: Page) {}

  async fetchDistrictOptions(): Promise<AvailableDistrict[]> {
    const districtOptions = await this.page.$$eval(
      "#IdDistrito option",
      (options) =>
        options
          .filter((option) => option.value.length > 0)
          .map(
            (option) =>
              ({
                name: option.innerText,
                value: option.value,
                localities: [],
              } as AvailableDistrict)
          )
    );

    const fullDistrictOptions: AvailableDistrict[] = [];
    for (const districtOption of districtOptions) {
      const localities = await this.fetchDistrictLocalities(districtOption);
      await this.page.waitForTimeout(50);
      fullDistrictOptions.push({ ...districtOption, localities });
    }

    return fullDistrictOptions;
  }

  private async fetchDistrictLocalities(
    districtOption: AvailableDistrict
  ): Promise<AvailableLocality[]> {
    await selectDistrict(this.page, districtOption);

    const localities = await this.page.$$eval(
      "#IdLocalidade option",
      (options) =>
        options
          .filter((option) => option.value.length > 0)
          .map((option) => ({
            name: option.innerText,
            value: option.value,
            places: [],
          }))
    );

    const fullLocalities = [];
    for (const locality of localities) {
      const places = await this.fetchLocalityPlaces(locality);
      fullLocalities.push({ ...locality, places });
    }

    return fullLocalities;
  }

  private async fetchLocalityPlaces(
    option: AvailableLocality
  ): Promise<AvailableAttendancePlace[]> {
    await selectLocality(this.page, option);

    return await this.page.$$eval("#IdLocalAtendimento option", (options) =>
      options
        .filter((option) => option.value.length > 0)
        .map((option) => ({
          name: option.innerText,
          value: option.value,
        }))
    );
  }
}
