import { Router } from 'express';
import * as transactionController from '../controller/transactionController';

const router = Router();

router.post('/addTransaction', transactionController.checkIsUserTokenValid, transactionController.addTransaction);
router.get('/getTransactionOverview', transactionController.checkIsUserTokenValid, transactionController.getTransactionOverview);
router.get('/gettransactionDetail', transactionController.checkIsUserTokenValid, transactionController.getTransactionDetail);

export default router;
