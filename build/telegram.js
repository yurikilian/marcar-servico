"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyImage = exports.notifyText = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
dotenv_1.default.config();
const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
async function notifyText(message) {
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const bot = new node_telegram_bot_api_1.default(TELEGRAM_BOT_TOKEN, { polling: false });
        await bot.sendMessage(TELEGRAM_CHAT_ID, message);
    }
}
exports.notifyText = notifyText;
async function notifyImage(message) {
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const bot = new node_telegram_bot_api_1.default(TELEGRAM_BOT_TOKEN, { polling: false });
        await bot.sendPhoto(TELEGRAM_CHAT_ID, "./image.png", {
            caption: message,
            parse_mode: "HTML",
        });
    }
}
exports.notifyImage = notifyImage;
//# sourceMappingURL=telegram.js.map