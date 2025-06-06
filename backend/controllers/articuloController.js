import pool from '../config/db.js';

export const listArticulos = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT cod_articulo, articulo FROM articulos ORDER BY articulo'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error listando articulos:', err.stack);
    next(err);
  }
};
