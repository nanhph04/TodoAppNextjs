import express from 'express';
import { protect } from '../milddlewares/auth.middleware.js';
import { getMe } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile', protect, getMe);

export default router;