import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadDir = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    } catch (err) {
      console.error('Error creando carpeta uploads:', err);
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const fname = `${Date.now()}_${file.originalname}`;
    cb(null, fname);
  }
});

const upload = multer({ storage });

export default upload;
