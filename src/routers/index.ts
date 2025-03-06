import { Router } from 'express';
import creditPackageAdminRouter from './admin/creditPackage.routes';
import creditPackageRouter from './user/creditPackage.routes';

const router = Router();
// 前台
router.use('/credit-package', creditPackageRouter);

// 後台
router.use('/admin/credit-package', creditPackageAdminRouter);

export default router;
