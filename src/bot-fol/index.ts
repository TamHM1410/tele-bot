import TelegramBot from "node-telegram-bot-api";
import { addTask, getTasks, markDone, deleteTask, setDailyTime, runFlowSteps, finishAndSend } from './helper/index';
import { FlowSession, ManualSession } from "./type/type";
import { FLOW_PATIENT_STEPS, HL7_STEPS } from "./constant/constant";
import cron from 'node-cron';
import { INITIAL_FLOWS_DEFAULT } from "../flows";

type Session = ManualSession | FlowSession;

const sessions = new Map<string, Session>();

export const SetUpBot = (bot: TelegramBot): void => {

  const VALID_COMMANDS = [
    '/start', '/add', '/list', '/done', '/delete',
    '/daily', '/hl7', '/cancel', '/help'
  ];

  // /start
  bot.onText(/^\/start$/, (msg) => {
    bot.sendMessage(msg.chat.id,
      `👋 Xin chào *${msg.from?.first_name}*!\n\n` +
      `📋 *Quản lý công việc:*\n` +
      `/add <việc> — Thêm task\n` +
      `/list — Xem danh sách\n` +
      `/done <số> — Hoàn thành\n` +
      `/delete <số> — Xóa task\n` +
      `/daily <HH:MM> — Nhắc hàng ngày\n\n` +
      `🏥 *HL7 Message:*\n` +
      `/hl7 — Tạo HL7 ADT message\n\n` +
      `/help — Xem hướng dẫn`,
      { parse_mode: 'Markdown' }
    );
  });

  // /add
  bot.onText(/^\/add (.+)$/, (msg, match) => {
    const chatId = String(msg.chat.id);
    const text = match?.[1]?.trim();
    if (!text) { bot.sendMessage(msg.chat.id, '❌ Vui lòng nhập nội dung task!'); return; }
    const task = addTask(chatId, text);
    bot.sendMessage(msg.chat.id, `✅ Đã thêm: *${task.text}*`, { parse_mode: 'Markdown' });
  });

  // /list
  bot.onText(/^\/list$/, (msg) => {
    const chatId = String(msg.chat.id);
    const tasks = getTasks(chatId);
    if (tasks.length === 0) { bot.sendMessage(msg.chat.id, '📭 Chưa có task nào!'); return; }
    const list = tasks.map((t, i) => `${i + 1}. ${t.done ? '✅' : '⬜'} ${t.text}`).join('\n');
    bot.sendMessage(msg.chat.id, `📋 *Danh sách:*\n\n${list}`, { parse_mode: 'Markdown' });
  });

  // /done
  bot.onText(/^\/done (\d+)$/, (msg, match) => {
    const chatId = String(msg.chat.id);
    const task = markDone(chatId, parseInt(match?.[1] ?? '0'));
    if (!task) { bot.sendMessage(msg.chat.id, '❌ Không tìm thấy task!'); return; }
    bot.sendMessage(msg.chat.id, `🎉 Hoàn thành: *${task.text}*`, { parse_mode: 'Markdown' });
  });

  // /delete
  bot.onText(/^\/delete (\d+)$/, (msg, match) => {
    const chatId = String(msg.chat.id);
    const task = deleteTask(chatId, parseInt(match?.[1] ?? '0'));
    if (!task) { bot.sendMessage(msg.chat.id, '❌ Không tìm thấy task!'); return; }
    bot.sendMessage(msg.chat.id, `🗑️ Đã xóa: *${task.text}*`, { parse_mode: 'Markdown' });
  });

  // /daily
  bot.onText(/^\/daily (\d{2}:\d{2})$/, (msg, match) => {
    const chatId = String(msg.chat.id);
    const time = match?.[1];
    if (!time) return;
    const [hour, minute] = time.split(':');
    setDailyTime(chatId, time);
    cron.schedule(`${minute} ${hour} * * *`, () => {
      const pending = getTasks(chatId).filter(t => !t.done);
      if (pending.length === 0) { bot.sendMessage(msg.chat.id, '🎉 Hoàn thành tất cả task hôm nay!'); return; }
      const list = pending.map((t, i) => `${i + 1}. ⬜ ${t.text}`).join('\n');
      bot.sendMessage(msg.chat.id, `⏰ *Nhắc nhở:*\n\n${list}`, { parse_mode: 'Markdown' });
    });
    bot.sendMessage(msg.chat.id, `⏰ Nhắc lúc *${time}* mỗi ngày!`, { parse_mode: 'Markdown' });
  });

  // /hl7 — Chọn Manual hoặc Auto Flow
  bot.onText(/^\/hl7$/, (msg) => {
    bot.sendMessage(msg.chat.id,
      '🏥 *Chọn chế độ tạo HL7 message:*',
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '✍️ Manual — Chọn ADT type thủ công', callback_data: 'MODE_MANUAL' }],
            [{ text: '🔄 Auto Flow — Chạy theo kịch bản có sẵn', callback_data: 'MODE_FLOW' }],
          ]
        }
      }
    );
  });

  // /cancel
  bot.onText(/^\/cancel$/, (msg) => {
    const chatId = String(msg.chat.id);
    if (sessions.has(chatId)) {
      sessions.delete(chatId);
      bot.sendMessage(msg.chat.id, '❌ Đã hủy!');
    } else {
      bot.sendMessage(msg.chat.id, '⚠️ Không có gì để hủy.');
    }
  });

  // /help
  bot.onText(/^\/help$/, (msg) => {
    bot.sendMessage(msg.chat.id,
      `📖 *Hướng dẫn:*\n\n` +
      `*📋 Task:*\n/add, /list, /done, /delete, /daily\n\n` +
      `*🏥 HL7:*\n` +
      `/hl7 → Tạo message (Manual hoặc Auto Flow)\n` +
      `/cancel → Hủy nhập liệu`,
      { parse_mode: 'Markdown' }
    );
  });

  // ─── Callback Handler ───────────────────────────────────
  bot.on('callback_query', async (query) => {
    const chatId = String(query.message!.chat.id);
    const data = query.data ?? '';
    await bot.answerCallbackQuery(query.id);

    // Chọn Manual mode
    if (data === 'MODE_MANUAL') {
      bot.sendMessage(query.message!.chat.id, '📨 Chọn loại ADT message:', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'A01 - Admit',      callback_data: 'HL7_A01' },
              { text: 'A02 - Transfer',   callback_data: 'HL7_A02' },
              { text: 'A03 - Discharge',  callback_data: 'HL7_A03' },
            ],
            [
              { text: 'A04 - Register',     callback_data: 'HL7_A04' },
              { text: 'A08 - Update',       callback_data: 'HL7_A08' },
              { text: 'A11 - Cancel Admit', callback_data: 'HL7_A11' },
            ],
          ]
        }
      });
      return;
    }

    // Chọn Flow mode — hiển thị danh sách flows
    if (data === 'MODE_FLOW') {
      const keyboard = INITIAL_FLOWS_DEFAULT.map(flow => ([{
        text: `${flow.title} — ${flow.subtitle}`,
        callback_data: `FLOW_${flow.id}`
      }]));
      bot.sendMessage(query.message!.chat.id, '🔄 *Chọn kịch bản:*', {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: keyboard }
      });
      return;
    }

    // Chọn flow cụ thể
    if (data.startsWith('FLOW_')) {
      const flowId = data.replace('FLOW_', '');
      const flow = INITIAL_FLOWS_DEFAULT.find(f => f.id === flowId);
      if (!flow) return;

      // Hiển thị thông tin flow
      const stepsText = flow.steps
        .map(s => `  ${s.step}. ${s.label}\n     _${s.desc}_`)
        .join('\n');

      await bot.sendMessage(query.message!.chat.id,
        `✅ *${flow.title}*\n_${flow.subtitle}_\n\n*Các bước:*\n${stepsText}\n\n` +
        `Nhập thông tin bệnh nhân (dùng cho tất cả các bước):\n\n` +
        `🆔 *PAS ID*:`,
        { parse_mode: 'Markdown' }
      );

      // Khởi tạo flow session — dùng patient data từ flow làm default
      const [familyName, givenName] = flow.patient.name.split(' ');
      sessions.set(chatId, {
        mode: 'flow',
        flow,
        currentStep: 0,
        step: 'pasId',
        data: {
          pasId:      flow.patient.pasId,
          familyName: familyName ?? '',
          givenName:  givenName ?? '',
          dob:        flow.patient.dob,
          gender:     flow.patient.gender,
        }
      });

      // Vì đã có patient data từ flow, hỏi thẳng các field còn thiếu
      bot.sendMessage(query.message!.chat.id,
        `💡 _Dữ liệu mặc định từ flow đã được điền. Nhập để override hoặc gõ_ *skip* _để giữ nguyên._\n\n` +
        `🆔 *PAS ID* (mặc định: ${flow.patient.pasId}):`,
        { parse_mode: 'Markdown' }
      );
      return;
    }

    // Manual: chọn ADT type
    if (data.startsWith('HL7_')) {
      const msgType = data.replace('HL7_', '');
      sessions.set(chatId, { mode: 'manual', step: 'pasId', msgType, data: {} });
      await bot.sendMessage(query.message!.chat.id,
        `✅ *ADT^${msgType}* đã chọn!\n\n🆔 *PAS ID* (mã bệnh nhân):`,
        { parse_mode: 'Markdown' }
      );
    }
  });

  // ─── Message Handler ────────────────────────────────────
  bot.on('message', async (msg) => {
    const chatId = String(msg.chat.id);
    const text = msg.text?.trim();
    if (!text || text.startsWith('/')) return;

    const session = sessions.get(chatId);
    if (!session) return;

    // ── Manual mode ──
    if (session.mode === 'manual') {
      const currentIndex = HL7_STEPS.findIndex((s:any) => s.key === session.step);
      session.data[session.step] = text;
      const nextStep = HL7_STEPS[currentIndex + 1];

      if (nextStep) {
        session.step = nextStep.key;
        sessions.set(chatId, session);
        bot.sendMessage(msg.chat.id, nextStep.label, { parse_mode: 'Markdown' });
      } else {
        await finishAndSend(bot, msg.chat.id, chatId, session.msgType, session.data);
        sessions.delete(chatId);
      }
      return;
    }

    // ── Flow mode ──
    if (session.mode === 'flow') {
      const currentStepKey = FLOW_PATIENT_STEPS.find((s:any) => s.key === session.step);
      if (!currentStepKey) return;

      // "skip" → giữ nguyên giá trị mặc định
      if (text.toLowerCase() !== 'skip') {
        session.data[session.step] = text;
      }

      const currentIndex = FLOW_PATIENT_STEPS.findIndex((s:any) => s.key === session.step);
      const nextPatientStep = FLOW_PATIENT_STEPS[currentIndex + 1];

      if (nextPatientStep) {
        // Còn field bệnh nhân cần nhập
        session.step = nextPatientStep.key;
        sessions.set(chatId, session);
        const defaultVal = session.data[nextPatientStep.key];
        bot.sendMessage(msg.chat.id,
          `${nextPatientStep.label}${defaultVal ? ` _(mặc định: ${defaultVal})_` : ''}`,
          { parse_mode: 'Markdown' }
        );
      } else {
        // Đủ patient data → chạy từng step trong flow
        sessions.delete(chatId);
        await runFlowSteps(bot, msg.chat.id, chatId, session);
      }
    }
  });

  // ─── Invalid command ────────────────────────────────────
  bot.on('message', (msg) => {
    const text = msg.text?.trim();
    if (!text?.startsWith('/')) return;
    const command = text.split(' ')[0] ?? '';
    if (!VALID_COMMANDS.includes(command)) {
      bot.sendMessage(msg.chat.id, '❓ Lệnh không hợp lệ! Dùng /help.');
    }
  });
};