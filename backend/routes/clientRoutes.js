import express from 'express';
import { listClients } from '../controllers/clientController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, listClients);

export default router;
