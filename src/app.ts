import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';

import { AppError, NotFound } from './utils/appResponse';

const app: Application = express();

// Express Middlewares
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use(express.json());
app.use(bodyParser.json());

// 捕捉 JSON 解析錯誤的 middleware
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && err.statusCode === 400 && 'body' in err) {
    console.error('JSON 解析錯誤:', err);
    return res.status(400).json({
      status: 'error',
      message: '傳入的 JSON 格式錯誤，請檢查逗號或引號是否正確',
    });
  }
  next();
});

// 簡單的記憶體儲存已加入用戶
const joinedUsers = new Set<number | string>();

// 設定 webhook endpoint
app.post('/webhook', async (req: Request, res: Response) => {
  console.log('收到 webhook 更新:', JSON.stringify(req.body, null, 2));

  if (req.body.message) {
    const chatId = req.body.message.chat.id;
    const text = req.body.message.text;

    // 檢查是否為第一次加入 (這裡以 /start 為例)
    if (text === '/start' && !joinedUsers.has(chatId)) {
      joinedUsers.add(chatId);
      try {
        const sendResult = await sendWelcomeMessage(chatId, `歡迎加入notify_bot！`); // 傳入 true 表示首次歡迎訊息
        return res.status(200).json({
          status: 'success',
          message: '首次歡迎訊息已發送',
          sendResult,
        });
      } catch (error: any) {
        return res.status(200).json({
          status: 'fail',
          message: '首次歡迎訊息發送失敗',
          error: error.response ? error.response.data : error.message,
        });
      }
    } else {
      // 非首次歡迎或其他訊息處理邏輯
      // 可根據需求進行其他處理
      const sendResult = await sendWelcomeMessage(chatId, `id:${chatId} \n你說${req.body.message.text}`);
    }
  }
  res.sendStatus(200);
});

app.post('/sendMsg', async (req: Request, res: Response) => {
  console.log('收到 webhook 更新:', JSON.stringify(req.body, null, 2));

  if (req.body.message) {
    const chatId = req.body.chat_id;
    const text = req.body.message;

    // 非首次歡迎或其他訊息處理邏輯
    // 可根據需求進行其他處理
    const sendResult = await sendWelcomeMessage(chatId, `${text}`);
  }
  res.sendStatus(200);
});

// 發送歡迎訊息的函式，isFirst 用來區分是否為首次加入
async function sendWelcomeMessage(chatId: number | string, Msg?: string): Promise<any> {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  if (!TELEGRAM_TOKEN) {
    console.error('請在環境變數中設定 TELEGRAM_TOKEN');
    throw new Error('TELEGRAM_TOKEN not set');
  }
  const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

  try {
    const url = `${TELEGRAM_API}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: chatId,
      text: Msg,
    });
    console.log('歡迎訊息發送結果:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('歡迎訊息發送失敗:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Route 404
app.use(NotFound);

// 全域錯誤處理 middleware
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  res.setHeader('Content-Type', 'application/json');
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
