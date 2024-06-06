import express from 'express';

import {
  fetchUserData,
  login,
  register,
  updateUserData
} from '../controllers/userController';
import registerValidator from '../validators/registerValidator';
import updateUserValidator from '../validators/updateUserValidator';
import { isAuth } from '../middleware/auth';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', login);
router.get('/fetch-user-data', isAuth, fetchUserData);
router.patch('/update-user-data', isAuth, updateUserValidator, updateUserData);

export default router;
