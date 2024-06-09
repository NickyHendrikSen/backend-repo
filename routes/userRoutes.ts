import express from 'express';

import {
  fetchUserData,
  fetchSingleUserData,
  login,
  register,
  updateUserData,
  logout,
  getUserInfo
} from '../controllers/userController';
import registerValidator from '../validators/registerValidator';
import updateUserValidator from '../validators/updateUserValidator';
import { isAuth } from '../middleware/auth';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/fetch-user-data', fetchUserData);
router.get('/fetch-single-user-data/:id', fetchSingleUserData);
router.patch('/update-user-data', isAuth, updateUserValidator, updateUserData);
router.get('/me', isAuth, getUserInfo);

export default router;
