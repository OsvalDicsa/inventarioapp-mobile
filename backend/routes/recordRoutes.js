import express from 'express';
import {
  createRecord,
  listRecords,
  updateRecord,
  deleteRecord
} from '../controllers/recordController.js';
import auth from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post('/', auth, upload.single('photo'), createRecord);
router.get('/', auth, listRecords);
router.put('/:id', auth, updateRecord);
router.delete('/:id', auth, deleteRecord);

export default router;
