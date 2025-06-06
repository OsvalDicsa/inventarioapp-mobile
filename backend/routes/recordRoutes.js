import express from 'express';
import { createRecord } from '../controllers/recordController.js';
import auth from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post('/', auth, upload.single('photo'), createRecord);

export default router;
