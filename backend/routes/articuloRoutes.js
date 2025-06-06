import express from 'express';
import { listArticulos } from '../controllers/articuloController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, listArticulos);

export default router;
