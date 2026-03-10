import fs from 'fs';
import path from 'path';

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