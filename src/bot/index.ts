import TelegramBot from "node-telegram-bot-api";
import { addTask, getTasks, markDone, deleteTask, setDailyTime, runFlowSteps, finishAndSend } from './helper/index';
import { FlowSession, ManualSession } from "./type/type";
import { FLOW_PATIENT_STEPS, HL7_STEPS, INITIAL_FLOWS_DEFAULT } from "./constant/constant";
import cron from 'node-cron';
import BotService from "./service";

type Session = ManualSession | FlowSession;

const sessions = new Map<string, Session>();

export const SetUpBot = (bot: TelegramBot): void => {

 const service = new BotService(bot);

 bot.onText(/^\/start$/, service.onStart.bind(service));
 bot.onText(/^\/add (.+)$/, service.addTask.bind(service));
 bot.onText(/^\/list$/, service.listTasks.bind(service));
 bot.onText(/^\/done (\d+)$/, service.markDone.bind(service));
 bot.onText(/^\/delete (\d+)$/, service.deleteTask.bind(service));
 bot.onText(/^\/daily (\d{2}:\d{2})$/, service.setDailyReminder.bind(service));
 bot.onText(/^\/hl7$/, service.handleHL7.bind(service));

 bot.on("callback_query", service.handleCallback.bind(service));

 bot.on("message", service.handleMessage.bind(service));

};