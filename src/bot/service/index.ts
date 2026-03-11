import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";

import {
  addTask,
  getTasks,
  markDone,
  deleteTask,
  setDailyTime,
  runFlowSteps,
  finishAndSend,
} from "../helper";

import {
  FLOW_PATIENT_STEPS,
  HL7_STEPS,
  INITIAL_FLOWS_DEFAULT,
} from "../constant/constant";

import { FlowSession, ManualSession } from "../type/type";

type Session = ManualSession | FlowSession;

class BotService {
  private bot: TelegramBot;
  private sessions = new Map<string, Session>();

  constructor(bot: TelegramBot) {
    this.bot = bot;
  }

  // =========================
  // START
  // =========================
  public onStart(msg: any): void {
    this.bot.sendMessage(
      msg.chat.id,
      `👋 Xin chào *${msg.from?.first_name}*!\n\n` +
        `📋 *Quản lý công việc:*\n` +
        `/add <việc>\n` +
        `/list\n` +
        `/done <số>\n` +
        `/delete <số>\n` +
        `/daily <HH:MM>\n\n` +
        `🏥 *HL7 Message:*\n` +
        `/hl7\n\n` +
        `/help`,
      { parse_mode: "Markdown" }
    );
  }

  // =========================
  // TASK
  // =========================

  public addTask(msg: any, match: any): void {
    const chatId = String(msg.chat.id);
    const text = match?.[1]?.trim();

    if (!text) {
      this.bot.sendMessage(msg.chat.id, "❌ Vui lòng nhập nội dung task!");
      return;
    }

    const task = addTask(chatId, text);

    this.bot.sendMessage(msg.chat.id, `✅ Đã thêm: *${task.text}*`, {
      parse_mode: "Markdown",
    });
  }

  public listTasks(msg: any): void {
    const chatId = String(msg.chat.id);

    const tasks = getTasks(chatId);

    if (tasks.length === 0) {
      this.bot.sendMessage(msg.chat.id, "📭 Chưa có task nào!");
      return;
    }

    const list = tasks
      .map((t, i) => `${i + 1}. ${t.done ? "✅" : "⬜"} ${t.text}`)
      .join("\n");

    this.bot.sendMessage(msg.chat.id, `📋 *Danh sách:*\n\n${list}`, {
      parse_mode: "Markdown",
    });
  }

  public markDone(msg: any, match: any): void {
    const chatId = String(msg.chat.id);

    const task = markDone(chatId, parseInt(match?.[1]));

    if (!task) {
      this.bot.sendMessage(msg.chat.id, "❌ Không tìm thấy task!");
      return;
    }

    this.bot.sendMessage(msg.chat.id, `🎉 Hoàn thành: *${task.text}*`, {
      parse_mode: "Markdown",
    });
  }

  public deleteTask(msg: any, match: any): void {
    const chatId = String(msg.chat.id);

    const task = deleteTask(chatId, parseInt(match?.[1]));

    if (!task) {
      this.bot.sendMessage(msg.chat.id, "❌ Không tìm thấy task!");
      return;
    }

    this.bot.sendMessage(msg.chat.id, `🗑️ Đã xóa: *${task.text}*`, {
      parse_mode: "Markdown",
    });
  }

  // =========================
  // DAILY REMINDER
  // =========================

  public setDailyReminder(msg: any, match: any): void {
    const chatId = String(msg.chat.id);
    const time = match?.[1];

    if (!time) return;

    const [hour, minute] = time.split(":");

    setDailyTime(chatId, time);

    cron.schedule(`${minute} ${hour} * * *`, () => {
      const pending = getTasks(chatId).filter((t) => !t.done);

      if (pending.length === 0) {
        this.bot.sendMessage(msg.chat.id, "🎉 Hoàn thành tất cả task hôm nay!");
        return;
      }

      const list = pending
        .map((t, i) => `${i + 1}. ⬜ ${t.text}`)
        .join("\n");

      this.bot.sendMessage(msg.chat.id, `⏰ *Nhắc nhở:*\n\n${list}`, {
        parse_mode: "Markdown",
      });
    });

    this.bot.sendMessage(msg.chat.id, `⏰ Nhắc lúc *${time}* mỗi ngày!`, {
      parse_mode: "Markdown",
    });
  }

  // =========================
  // HL7 MENU
  // =========================

  public handleHL7(msg: any): void {
    this.bot.sendMessage(msg.chat.id, "🏥 *Chọn chế độ tạo HL7 message:*", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "✍️ Manual", callback_data: "MODE_MANUAL" }],
          [{ text: "🔄 Auto Flow", callback_data: "MODE_FLOW" }],
        ],
      },
    });
  }

  // =========================
  // CALLBACK QUERY
  // =========================

  public async handleCallback(query: any) {
    const chatId = String(query.message.chat.id);
    const data = query.data;

    await this.bot.answerCallbackQuery(query.id);

    // Manual mode
    if (data === "MODE_MANUAL") {
      this.bot.sendMessage(query.message.chat.id, "📨 Chọn loại ADT message:", {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "A01 - Admit", callback_data: "HL7_A01" },
              { text: "A02 - Transfer", callback_data: "HL7_A02" },
              { text: "A03 - Discharge", callback_data: "HL7_A03" },
            ],
          ],
        },
      });

      return;
    }

    // Flow mode
    if (data === "MODE_FLOW") {
      const keyboard = INITIAL_FLOWS_DEFAULT.map((flow) => [
        {
          text: `${flow.title}`,
          callback_data: `FLOW_${flow.id}`,
        },
      ]);

      this.bot.sendMessage(query.message.chat.id, "🔄 *Chọn kịch bản:*", {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: keyboard },
      });

      return;
    }

    // Manual HL7
    if (data.startsWith("HL7_")) {
      const msgType = data.replace("HL7_", "");

      this.sessions.set(chatId, {
        mode: "manual",
        step: "pasId",
        msgType,
        data: {},
      });

      this.bot.sendMessage(
        query.message.chat.id,
        `✅ *ADT^${msgType}*\n\n🆔 PAS ID:`,
        { parse_mode: "Markdown" }
      );
    }
  }

  // =========================
  // MESSAGE FLOW
  // =========================

  public async handleMessage(msg: any) {
    const chatId = String(msg.chat.id);
    const text = msg.text?.trim();

    if (!text || text.startsWith("/")) return;

    const session = this.sessions.get(chatId);

    if (!session) return;

    // MANUAL MODE
    if (session.mode === "manual") {
      const index = HL7_STEPS.findIndex((s: any) => s.key === session.step);

      session.data[session.step] = text;

      const nextStep = HL7_STEPS[index + 1];

      if (nextStep) {
        session.step = nextStep.key;

        this.sessions.set(chatId, session);

        this.bot.sendMessage(msg.chat.id, nextStep.label, {
          parse_mode: "Markdown",
        });
      } else {
        await finishAndSend(
          this.bot,
          msg.chat.id,
          chatId,
          session.msgType,
          session.data
        );

        this.sessions.delete(chatId);
      }

      return;
    }

    // FLOW MODE
    if (session.mode === "flow") {
      const stepIndex = FLOW_PATIENT_STEPS.findIndex(
        (s: any) => s.key === session.step
      );

      if (text.toLowerCase() !== "skip") {
        session.data[session.step] = text;
      }

      const nextStep = FLOW_PATIENT_STEPS[stepIndex + 1];

      if (nextStep) {
        session.step = nextStep.key;

        this.sessions.set(chatId, session);

        this.bot.sendMessage(msg.chat.id, nextStep.label, {
          parse_mode: "Markdown",
        });
      } else {
        this.sessions.delete(chatId);

        await runFlowSteps(this.bot, msg.chat.id, chatId, session);
      }
    }
  }
}

export default BotService;