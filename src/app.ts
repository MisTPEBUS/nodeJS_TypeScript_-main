import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import Router from './routers/index';

import { AppError, NotFound } from './utils/appResponse';

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
// 設定 webhook endpoint
app.post('/webhook', (req: Request, res: Response) => {
  // Telegram 會將更新內容以 JSON 格式傳送過來
  console.log('收到 webhook 更新:', JSON.stringify(req.body, null, 2));

  // 可在此處進行進一步處理，例如擷取 chat ID 並發送歡迎訊息
  if (req.body.message) {
    const chatId = req.body.message.chat.id;
    // 根據需求進行處理，例如呼叫 sendMessage 發送訊息
    sendWelcomeMessage(chatId);
  }

  // 回傳 200 OK 表示已成功接收更新
  res.sendStatus(200);
});

// 發送歡迎訊息的函式
async function sendWelcomeMessage(chatId: number | string) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  if (!TELEGRAM_TOKEN) {
    console.error('請在環境變數中設定 TELEGRAM_TOKEN');
    return;
  }
  const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
  try {
    const url = `${TELEGRAM_API}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: chatId,
      text: '歡迎加入！',
    });
    console.log('歡迎訊息發送結果:', response.data);
  } catch (error: any) {
    console.error('歡迎訊息發送失敗:', error.response ? error.response.data : error.message);
  }
}

//Route 404
app.use(NotFound);

// middleware全域錯誤處理
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;

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
