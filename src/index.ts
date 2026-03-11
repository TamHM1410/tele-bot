import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { SetUpBot } from './bot/index';

dotenv.config();

const token = process.env.BOT_TOKEN!;

const bot = new TelegramBot(token, {
  polling: {
    autoStart: false, // không start ngay
    params: {
      timeout: 10,
      limit: 100,
    }
  }
});

// Xóa sạch queue tin nhắn cũ trước khi start
const clearPendingUpdates = async (): Promise<void> => {
  const updates = await bot.getUpdates({ offset: -1 });
  if (updates.length > 0) {
    const lastUpdateId = updates[updates.length - 1]?.update_id;
    if (lastUpdateId !== undefined) {
      await bot.getUpdates({ offset: lastUpdateId + 1 });
    }
  }
};

const start = async (): Promise<void> => {
  await clearPendingUpdates(); // xóa tin cũ
  await bot.startPolling();   // bắt đầu polling
  SetUpBot(bot);
  console.log('🤖 Bot đang chạy...');
};

start();