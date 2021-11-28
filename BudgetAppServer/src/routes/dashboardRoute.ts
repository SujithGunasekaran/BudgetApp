import { Router } from 'express';
import * as dashboardController from '../controller/dashboardController';
import * as utilController from '../controller/utilController';

const router = Router();

router.get('/getMonthTransactionOverview', utilController.checkIsUserTokenValid, dashboardController.getMonthTransactionOverview);
router.get('/getTransactioDataByCategory', utilController.checkIsUserTokenValid, dashboardController.getTransactioDataForCategory);



export default router;
