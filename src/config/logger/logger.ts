// import fs from 'fs';
// import path from 'path';

// const LOG_FILE = path.join(process.cwd(), 'api-errors.json');

// export interface ApiErrorLog {
//   timestamp: string;
//   chatId: string;
//   msgType: string;
//   endpoint: string;
//   status?: number;
//   error: string;
//   rawMessage: string;
// }

// export const logApiError = (log: ApiErrorLog): void => {
//   let logs: ApiErrorLog[] = [];

//   try {
//     if (fs.existsSync(LOG_FILE)) {
//       logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
//     }
//   } catch {
//     logs = [];
//   }

//   logs.push(log);
//   fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
//   console.error(`[API ERROR] ${log.timestamp} - ${log.error}`);
// };

import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

export const logger = winston.createLogger({
  level: "info",

  format: combine(timestamp(), colorize(), logFormat),

  transports: [
    new winston.transports.Console(),

    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    new winston.transports.File({
      filename: "logs/app.log",
    }),
  ],
});
