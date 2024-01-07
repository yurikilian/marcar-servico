"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __importDefault(require("../log"));
const BaseScenario_1 = __importDefault(require("./BaseScenario"));
const Selectors_1 = require("../Selectors");
class AttendanceLocalityScenario extends BaseScenario_1.default {
    constructor(page, district, locality, place) {
        super(page);
        this.page = page;
        this.district = district;
        this.locality = locality;
        this.place = place;
    }
    async execute() {
        (0, log_1.default)("AttendanceLocalityScenario --- START");
        await (0, Selectors_1.selectDistrict)(this.page, this.district);
        await (0, Selectors_1.selectLocality)(this.page, this.locality);
        await (0, Selectors_1.selectAttendancePlace)(this.page, this.place);
        await this.clickNext();
        (0, log_1.default)("AttendanceLocalityScenario --- END");
    }
    async clickNext() {
        await this.page.$eval("#proximoButton", (elem) => elem.click()); // works
    }
}
exports.default = AttendanceLocalityScenario;
//# sourceMappingURL=AttendanteLocalityScenario.js.map