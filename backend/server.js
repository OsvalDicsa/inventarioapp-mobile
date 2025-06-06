import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import articuloRoutes from './routes/articuloRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import { uploadDir } from './config/multer.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(uploadDir));

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/articulos', articuloRoutes);
app.use('/api/records', recordRoutes);

app.use((err, req, res, next) => {
  console.error('--- ERROR GLOBAL ---');
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: err.message,
    stack: err.stack
  });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
