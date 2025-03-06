import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import Router from './routers/index';

import { AppError, NotFound } from './utils/appResponse';
import logger from './utils/logger';
import bodyParser from 'body-parser';

const app: Application = express();
// Express Middlewares
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use(express.json());
app.use(bodyParser.json());

// 錯誤處理中介軟體：捕捉 JSON 解析錯誤
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  // 檢查是否為 JSON 解析的 SyntaxError
  if (err instanceof SyntaxError && err.statusCode === 400 && 'body' in err) {
    console.error('JSON 解析錯誤:', err);
    return res.status(400).json({
      status: 'error',
      message: '傳入的 JSON 格式錯誤，請檢查逗號或引號是否正確',
    });
  }
  // 如果不是 JSON 解析錯誤，則交由下一個中介軟體處理
  next();
});
app.post('/webhook', (req, res) => {
  console.log('收到 webhook 資料:', req.body);

  // 從訊息中取得 groupID 與 clientID (使用者ID)
  if (req.body && req.body.message) {
    const chatId = req.body.message.chat.id; // 若是在群組中，這通常為 groupID (可能為負數)
    const clientId = req.body.message.from.id; // 發送訊息的使用者ID

    console.log('Group ID:', chatId);
    console.log('Client ID:', clientId);
  }
  res.sendStatus(200);
});
// Root Route
/* app.use('/v1/api', Router);
app.get('/OPTION', (req: Request, res: Response) => {
  res.status(200).json();
}); */

//Route 404
app.use(NotFound);

// middleware全域錯誤處理
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;

  logger.error(`${err.statusCode} :${req.path}-${err.message}`);
  res.setHeader('Content-Type', 'application/json'); // 確保回傳 JSON
  if (process.env.NODE_ENV === 'dev') {
    return res.status(err.statusCode).json({
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
});

export default app;
