import pool from '../config/db.js';

export const createRecord = async (req, res, next) => {
  try {
    const { codcliente, cod_articulo, qty } = req.body;
    if (!req.file && Number(cod_articulo) !== 1) {
      console.warn('No se encontró req.file');
      return res.status(400).json({ message: 'Foto requerida' });
    }

    await pool.execute(
      'INSERT INTO records (codcliente, cod_articulo, qty, photo, user_id) VALUES (?, ?, ?, ?, ?)',
      [codcliente, cod_articulo, qty, req.file ? req.file.filename : null, req.user.id]
    );
    res.json({ message: 'Registro guardado' });
  } catch (err) {
    console.error('Error guardando registro:', err.stack);
    next(err);
  }
};
