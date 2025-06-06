import pool from '../config/db.js';

export const listClients = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT codcliente, razonsocial, alias, zona FROM cod_clientes ORDER BY razonsocial'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error listando clientes:', err.stack);
    next(err);
  }
};
