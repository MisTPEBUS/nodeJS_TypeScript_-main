import { Request, Response, NextFunction } from 'express';
import logger from './logger';
import { ErrorCode, ErrorStatus } from './errorCode';

export const delSuccess = (res: Response, status = 200): Response => {
  return res.status(status).json({
    status: 'success',
  });
};
/**
 * Sends a successful JSON response.
 *
 * 此函式用來回傳一個成功的 JSON 回應，回應內容包含一個 status 標記和資料內容。
 *
 * @template T - 回應資料的類型。
 * @param {Response} res - Express 回應物件。
 * @param {T} data - 要回傳的資料。
 * @param {number} [status=200] - HTTP 狀態碼（預設為 200）。
 * @returns {Response} 回傳包含 JSON 內容的 Express 回應物件。
 */
export const Success = <T>(res: Response, data: T, status = 200): Response => {
  console.log(status);
  return res.status(status).json({
    status: 'success',
    data,
  });
};
/**
 * Sends a 404 Not Found JSON response for undefined routes.
 *
 * 當請求的路由不存在時，此函式會回傳 404 錯誤的 JSON 回應，並記錄錯誤資訊。
 *
 * @param {Request} req - Express 請求物件。
 * @param {Response} res - Express 回應物件。
 */
export const NotFound = (req: Request, res: Response) => {
  logger.error(`404 :${req.path}`);
  res.status(404).json({
    status: 'error',
    message: '查無此路由，請確認 API 格式!',
  });
};

export interface AppError extends Error {
  status?: string;
  statusCode?: number;
  isOperational?: boolean;
}
/**
 * Creates an application error and passes it to the next middleware.
 *
 * 此函式用來產生一個包含自訂訊息與狀態碼的錯誤，並將該錯誤傳遞給 Express 的錯誤處理中介軟體。
 *
 * @param {string} errMessage - 錯誤訊息。
 * @param {NextFunction} next - Express 的 next 函式，用於傳遞錯誤至下一個中介軟體。
 * @param {number} [httpStatus=400] - HTTP 狀態碼（預設為 400）。
 */
export const appError = (errMessage: string, next: NextFunction, httpStatus = 400) => {
  const error = new Error(errMessage) as AppError;
  error.statusCode = httpStatus;
  error.isOperational = true;
  error.status = httpStatus == 500 ? ErrorStatus[ErrorCode.INTERNAL_SERVER_ERROR] : ErrorStatus[ErrorCode.BAD_REQUEST];

  next(error);
};
