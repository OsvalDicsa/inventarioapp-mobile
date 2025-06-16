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

export const listRecords = async (req, res, next) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const [rows] = await pool.execute(
      'SELECT id, codcliente, cod_articulo, qty, photo FROM records WHERE user_id = ? ORDER BY id DESC',
      [req.user.id]
    );
    const records = rows.map(r => ({
      ...r,
      photoUrl: r.photo ? `${baseUrl}/uploads/${r.photo}` : null
    }));
    res.json(records);
  } catch (err) {
    console.error('Error listando registros:', err.stack);
    next(err);
  }
};

export const updateRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { codcliente, cod_articulo, qty } = req.body;
    const [result] = await pool.execute(
      'UPDATE records SET codcliente = ?, cod_articulo = ?, qty = ? WHERE id = ? AND user_id = ?',
      [codcliente, cod_articulo, qty, id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    res.json({ message: 'Registro actualizado' });
  } catch (err) {
    console.error('Error actualizando registro:', err.stack);
    next(err);
  }
};

export const deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[record]] = await pool.execute(
      'SELECT photo FROM records WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    if (!record) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    if (record.photo) {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const photoPath = path.join(__dirname, '..', 'uploads', record.photo);
      fs.unlink(photoPath, err => {
        if (err && err.code !== 'ENOENT') {
          console.error('Error eliminando foto:', err);
        }
      });
    }

    await pool.execute(
      'DELETE FROM records WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    res.json({ message: 'Registro eliminado' });
  } catch (err) {
    console.error('Error eliminando registro:', err.stack);
    next(err);
  }
};
