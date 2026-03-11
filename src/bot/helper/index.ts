import fs from 'fs';
import path from 'path';
import TelegramBot from "node-telegram-bot-api";
import { extractMsgType, extractWard } from "../constant/constant";
import { FlowSession } from "../type/type";
import { sendHL7ToApi } from "../http/service";

const DATA_FILE = path.join(process.cwd(), 'tasks.json');

export interface Task {
  id: number;
  text: string;
  done: boolean;
  remindAt?: string; // format "HH:MM"
}

export interface UserData {
  tasks: Task[];
  dailyTime?: string; // format "HH:MM"
}

type DataStore = Record<string, UserData>;

const loadData = (): DataStore => {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
};

const saveData = (data: DataStore): void => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

export const getUserData = (chatId: string): UserData => {
  const data = loadData();
  if (!data[chatId]) data[chatId] = { tasks: [] };
  return data[chatId];
};

export const addTask = (chatId: string, text: string): Task => {
  const data = loadData();
  if (!data[chatId]) data[chatId] = { tasks: [] };
  const tasks = data[chatId].tasks;
  const newTask: Task = { id: Date.now(), text, done: false };
  tasks.push(newTask);
  saveData(data);
  return newTask;
};

export const getTasks = (chatId: string): Task[] => {
  return getUserData(chatId).tasks;
};

export const markDone = (chatId: string, index: number): Task | null => {
  const data = loadData();
  const tasks = data[chatId]?.tasks ?? [];
  const task = tasks[index - 1];
  if (!task) return null;
  task.done = true;
  saveData(data);
  return task;
};

export const deleteTask = (chatId: string, index: number): Task | null => {
  const data = loadData();
  const tasks = data[chatId]?.tasks ?? [];
  const [removed] = tasks.splice(index - 1, 1);
  if (!removed) return null;
  saveData(data);
  return removed;
};

export const setDailyTime = (chatId: string, time: string): void => {
  const data = loadData();
  if (!data[chatId]) data[chatId] = { tasks: [] };
  data[chatId].dailyTime = time;
  saveData(data);
};


// ─── Helpers ───────────────────────────────────────────────



// ─── HL7 Builder ───────────────────────────────────────────
const buildHL7Message = (msgType: string, data: Record<string, string>): string => {
  const now = new Date();
  const msgDateTime = now.toISOString().replace(/[-T:.Z]/g, '').slice(0, 12);
  const msgId = Date.now().toString();

  const msh = `MSH|^~\\&|PAS|PHU|THINKVITALS|THINKVITALS|${msgDateTime}||ADT^${msgType}|${msgId}|P|2.2`;
  const evn = `EVN|${msgType}|${msgDateTime}`;
  const pid = `PID|1||${data['pasId']}^^^PAS^PI||${data['familyName']}^${data['givenName']}||${data['dob']}|${data['gender']}|||${data['address']}`;
  const pv1 = `PV1|1|I|${data['ward']}^^^${data['consultant']}|||||${data['consultant']}|||||||||||${data['episodeId']}|||||||||||||||||||||||||${msgDateTime}|${msgDateTime}|`;

  return [msh, evn, pid, pv1].join('\r');
};
export const finishAndSend = async (
  bot: TelegramBot,
  chatId: number,
  chatIdStr: string,
  msgType: string,
  data: Record<string, string>
): Promise<void> => {
  const hl7 = buildHL7Message(msgType, data);

  await bot.sendMessage(chatId,
    `📋 *HL7 ADT^${msgType}:*\n\`\`\`\n${hl7.replace(/\r/g, '\n')}\n\`\`\``,
    { parse_mode: 'Markdown' }
  );

  try {
    await bot.sendMessage(chatId, '⏳ Đang gửi đến server...');
    await sendHL7ToApi(hl7, chatIdStr, msgType);
    await bot.sendMessage(chatId, '✅ *Gửi thành công!*', { parse_mode: 'Markdown' });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    await bot.sendMessage(chatId,
      `❌ *Gửi thất bại!*\n\`${errMsg}\`\n\n_Lỗi đã được ghi vào api-errors.json_`,
      { parse_mode: 'Markdown' }
    );
  }
};

export const runFlowSteps = async (
  bot: TelegramBot,
  chatId: number,
  chatIdStr: string,
  session: FlowSession
): Promise<void> => {
  const { flow, data } = session;

  await bot.sendMessage(chatId,
    `🚀 *Bắt đầu chạy flow: ${flow.title}*\n_${flow.subtitle}_\n\nTổng ${flow.steps.length} bước, chạy lần lượt...`,
    { parse_mode: 'Markdown' }
  );

  for (const flowStep of flow.steps) {
    const msgType =  (flowStep.label);
    const ward    = extractWard(flowStep.label) || data['ward'] || '';

    const stepData = { ...data, ward };

    await bot.sendMessage(chatId,
      `▶️ *Bước ${flowStep.step}: ${flowStep.label}*\n_${flowStep.desc}_`,
      { parse_mode: 'Markdown' }
    );

    await finishAndSend(bot, chatId, chatIdStr, msgType, stepData);

    // Delay 1s giữa các step
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  await bot.sendMessage(chatId,
    `🎉 *Flow hoàn thành!*\n_${flow.title} — ${flow.steps.length} bước đã được gửi._`,
    { parse_mode: 'Markdown' }
  );
};
