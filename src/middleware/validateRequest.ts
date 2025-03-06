import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { appError } from '../utils/appResponse';

type ReqPropertyType = 'body' | 'params' | 'query';

/**
 * 驗證資料
 * @param schema - Zod schema
 * @param property -  'body' | 'params' | 'query'
 * @returns 驗證通過next()，失敗傳遞錯誤
 */
export const validateData = <T>(schema: ZodSchema<T>, property: ReqPropertyType) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req[property] = await schema.parseAsync(req[property]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstErrorMessage = error.errors[0]?.message || '系統錯誤';
        console.error(firstErrorMessage);
        // 傳遞錯誤訊息給 appError
        appError(firstErrorMessage, next, 400);
      } else {
        appError('validate處理異常', next);
      }
    }
  };
};
