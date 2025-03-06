import request from 'supertest';
import express, { Application } from 'express';
import { describe } from 'node:test';
import Router from '../src/routers/index';
import prisma from '../src/prisma';

const app: Application = express();
app.use(express.json());
app.use('/v1/api', Router);

describe('Credit Package API', () => {
  beforeAll(async () => {
    // 清空資料庫中的 creditPackage 資料表
    await prisma.creditPackage.deleteMany();
  });
  afterAll(async () => {
    // 關閉 Prisma 連接
    await prisma.$disconnect();
  });
  /**
   * 測試 POST /v1/api/credit-package
   */
  let tmpCreditPackage = {
    creditPackageId: '',
    name: '7堂組合包方案',
    credit_amount: 7,
    price: 1400,
  };
  const validPackage = {
    name: '7堂組合包方案',
    credit_amount: 7,
    price: 1400,
  };
  describe('/v1/api/credit-package', () => {
    it('新增一筆credit package資料', async () => {
      const res = await request(app).post('/v1/api/credit-package').send(validPackage);
      // 預期狀態碼 200 或 201（視你的實作而定）
      tmpCreditPackage = res.body.data;
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe(validPackage.name);
    });
  });
  /**
   * 測試 GET /v1/api/credit-package
   */
  describe('GET /v1/api/credit-package', () => {
    it('讀取清單', async () => {
      const res = await request(app).get('/v1/api/credit-package');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
