// server.ts
import App from './app';
import prisma from './prisma';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('成功連線到資料庫');

    App.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
    process.on('unhandledRejection', (reason, promise) => {
      console.error('未捕捉到的 rejection：', promise, '原因：', reason);
    });
  } catch (error) {
    console.error('資料庫連線失敗:', error);
    process.exit(1);
  }
}

startServer();
