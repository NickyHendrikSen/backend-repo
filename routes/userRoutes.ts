import express from 'express';

import {
  fetchUserData,
  register,
  updateUserData
} from '../controllers/userController';
import registerValidator from '../validators/registerValidator';
import updateUserValidator from '../validators/updateUserValidator';

const router = express.Router();

router.post('/register', registerValidator, register);
router.get('/fetch-user-data', fetchUserData);
router.patch('/update-user-data', updateUserValidator, updateUserData);

export default router;
