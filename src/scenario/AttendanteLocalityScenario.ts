import { Page } from "puppeteer";
import log from "../log";
import BaseScenario from "./BaseScenario";
import {
  selectAttendancePlace,
  selectDistrict,
  selectLocality,
} from "../Selectors";
import {
  AvailableAttendancePlace,
  AvailableDistrict,
  AvailableLocality,
} from "../models";

export default class AttendanceLocalityScenario extends BaseScenario {
  constructor(
    protected page: Page,
    private district: AvailableDistrict,
    private locality: AvailableLocality,
    private place: AvailableAttendancePlace
  ) {
    super(page);
  }

  async execute() {
    log("AttendanceLocalityScenario --- START");

    await selectDistrict(this.page, this.district);
    await selectLocality(this.page, this.locality);
    await selectAttendancePlace(this.page, this.place);
    await this.clickNext();

    log("AttendanceLocalityScenario --- END");
  }

  async clickNext() {
    await this.page.$eval("#proximoButton", (elem: any) => elem.click()); // works
  }
}
