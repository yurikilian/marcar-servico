"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
class Configuration {
    constructor() {
        dotenv_1.default.config();
        const { URL, BROWSER_PATH, CRONTAB } = process.env;
        if (!URL)
            throw "Invalid URL";
        if (!BROWSER_PATH)
            throw "Invalid browser path";
        if (!CRONTAB)
            throw "Invalid crontab";
        this.env = {
            url: URL,
            browserPath: BROWSER_PATH,
            crontab: CRONTAB,
        };
    }
    getEnv() {
        return this.env;
    }
}
exports.default = new Configuration();
//# sourceMappingURL=configuration.js.map