"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
function log(message) {
    const date = new Date().toISOString();
    console.log(`${date}|${message}\n`);
    (0, fs_1.appendFile)("./app.log", `${date}|${message}\n`, () => { });
}
exports.default = log;
//# sourceMappingURL=log.js.map