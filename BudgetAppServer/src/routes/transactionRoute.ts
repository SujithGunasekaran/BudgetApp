import { Router } from 'express';
import * as transactionController from '../controller/transactionController';

const router = Router();

router.post('/addTransaction', transactionController.addTransaction);


export default router;
