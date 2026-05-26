import express from "express";
import dotenv from "dotenv";

import router from "./routes/index";
import { logger } from "./config/logger/logger";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, _, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use(router);

app.use((err: any, _req: any, res: any, _next: any) => {
  logger.error(err.stack || err.message);

  res.status(500).json({
    message: "Internal Server Error",
  });
  
});

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});
