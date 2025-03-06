import { z } from 'zod';
/**
 * 定義 CreditPackage 資料驗證的 Schema。
 *
 * 此模式用於驗證與 CreditPackage 相關的資料結構，包含：
 * - name: string必填。
 * - credit_amount: 必須為一個正整數。
 * - price: 必須為一個正整數。
 */
export const creditPackageSchema = z.object({
  name: z.string().min(1, { message: 'name 為必填' }),
  credit_amount: z
    .number({
      required_error: 'credit_amount 為必填',
      invalid_type_error: 'credit_amount 必須是整數',
    })
    .int({ message: 'credit_amount 必須是整數' }),
  price: z
    .number({
      required_error: 'price 為必填',
      invalid_type_error: 'price 必須是整數',
    })
    .int({ message: 'price 必須是整數' }),
});
/**
 * 定義刪除操作參數驗證的 Schema。
 *
 * 此模式用於驗證刪除操作所需的參數，要求：
 * - id: 必須為一個符合 UUID 格式的字串。
 */
export const delParams = z.object({
  creditPackageId: z.string().uuid({ message: 'ID錯誤,請輸入正確的格式' }),
});

export default {
  creditPackageSchema,

  delParams,
};
