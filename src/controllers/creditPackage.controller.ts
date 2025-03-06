import { NextFunction, Request, Response } from 'express';
import handleErrorAsync from '../middleware/handleErrorAsync';
import { Success, appError, delSuccess } from '../utils/appResponse';
import logger from '../utils/logger';
import prisma from '../prisma';

import { ZodError } from 'zod';
const getAsyncPublicCreditPackage = handleErrorAsync(async (req: Request, res: Response) => {
  const creditPackages = await prisma.creditPackage.findMany();
  logger.info(`creditRouter GET: ${req.path}`);
  Success(res, creditPackages);
});

const createAsyncCreditPackage = handleErrorAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 模擬非同步操作，例如資料庫存取
  try {
    const { name, credit_amount, price } = req.body;
    const existingPackage = await prisma.creditPackage.findFirst({
      where: { name },
    });
    if (existingPackage) {
      return appError(`資料重複`, next, 409);
    }

    logger.info(`creditRouter POST: ${req.path}`);

    const newCreditPackage = await prisma.creditPackage.create({
      data: { name, credit_amount, price },
    });

    Success(res, newCreditPackage, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return appError(`欄位未填寫正確`, next);
    }
    return next(error);
  }
});

/**
 * 更新 CreditPackage
 */
const updateAsyncCreditPackage = handleErrorAsync(async (req: Request, res: Response) => {
  logger.info(`creditRouter PUT: ${req.path}`);
  // 待補：更新的實際邏輯
  // const { id } = req.params;
  // const { name, credit_amount, price } = req.body;
  // ...
  await Success(res, { message: 'Update logic not yet implemented.' });
});

const deleteAsyncCreditPackage = handleErrorAsync(async (req: Request, res: Response, next: NextFunction) => {
  //驗證

  const { creditPackageId } = req.params;
  const existingPackage = await prisma.creditPackage.findUnique({ where: { id: creditPackageId } });

  if (!existingPackage) {
    return appError(`ID錯誤`, next, 400);
  }

  await prisma.creditPackage.delete({ where: { id: creditPackageId } });
  logger.info(`creditRouter DELETE: ${req.path}`);

  delSuccess(res);
});

/**
 * （管理員用）
 */
const getAdminCreditPackages = (req: Request, res: Response) => {
  // 待補： 實作管理員相關邏輯
  res.status(200).json({ success: true, data: [] });
};

/**
 * CreditPackage Controller 物件。
 */
const creditPackageController = {
  getAsyncPublicCreditPackage,
  createAsyncCreditPackage,
  updateAsyncCreditPackage,
  deleteAsyncCreditPackage,
  getAdminCreditPackages,
};

export default creditPackageController;
