import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'api-errors.json');

export interface ApiErrorLog {
  timestamp: string;
  chatId: string;
  msgType: string;
  endpoint: string;
  status?: number;
  error: string;
  rawMessage: string;
}

export const logApiError = (log: ApiErrorLog): void => {
  let logs: ApiErrorLog[] = [];

  try {
    if (fs.existsSync(LOG_FILE)) {
      logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
    }
  } catch {
    logs = [];
  }

  logs.push(log);
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
  console.error(`[API ERROR] ${log.timestamp} - ${log.error}`);
};