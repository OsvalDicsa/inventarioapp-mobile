import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log('Intento de login:', username);

    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    if (!rows.length) {
      console.warn('Usuario no encontrado:', username);
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      console.warn('Contraseña inválida para usuario:', username);
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ token });
  } catch (err) {
    console.error('Error en login:', err.stack);
    next(err);
  }
};
