import { Router } from 'express';
import * as transactionController from '../controller/transactionController';
import * as utilController from '../controller/utilController';

const router = Router();

router.post('/addTransaction', utilController.checkIsUserTokenValid, transactionController.addTransaction);
router.get('/getTransactionOverview', utilController.checkIsUserTokenValid, transactionController.getTransactionOverview);
router.get('/gettransactionDetail', utilController.checkIsUserTokenValid, transactionController.getTransactionDetail);

export default router;
