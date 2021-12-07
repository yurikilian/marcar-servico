import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config()

const { 
    TELEGRAM_BOT_TOKEN, 
    TELEGRAM_CHAT_ID 
} = process.env;


export async function notifyText(message) {
    const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });
    
    await bot.sendMessage(TELEGRAM_CHAT_ID, message)
}

export async function notifyImage(message) {
    const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });
    
    await bot.sendPhoto(TELEGRAM_CHAT_ID, './image.png', {
        caption: message,
        parse_mode: "HTML"
    })
}

