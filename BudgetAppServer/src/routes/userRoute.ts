import { Router } from 'express';
import * as userController from '../controller/userController';

const router = Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/checkUser', userController.checkIsUserTokenValid);

export default router;
