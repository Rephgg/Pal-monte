/**
 * ==============================================
 * MIEMBRO 3 — PARTE 1: FAVORITOS
 * Endpoints:
 *  - GET    /api/favoritos?usuario_id=
 *  - POST   /api/favoritos?usuario_id=&ruta_id=
 *  - DELETE /api/favoritos?usuario_id=&ruta_id=
 * ==============================================
 */
const pool = require('../db');

// GET /api/favoritos?usuario_id=
const getByUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.query;

    if (!usuario_id) return res.status(400).json({ ok: false, msg: 'usuario_id es requerido' });

    const [rows] = await pool.query(
      `SELECT r.id, r.nombre, r.distancia_km, r.dificultad, r.zona, f.fecha as fecha_favorito
       FROM favorito f JOIN ruta r ON f.id_ruta = r.id
       WHERE f.id_usuario = ? ORDER BY f.fecha DESC`,
      [usuario_id]
    );

    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/favoritos?usuario_id=&ruta_id=
const add = async (req, res) => {
  try {
    const { usuario_id, ruta_id } = req.query;

    if (!usuario_id || !ruta_id) {
      return res.status(400).json({ ok: false, msg: 'usuario_id y ruta_id son requeridos' });
    }

    await pool.query('INSERT INTO favorito (id_usuario, id_ruta) VALUES (?, ?)', [usuario_id, ruta_id]);
    res.status(201).json({ ok: true, msg: 'Agregado a favoritos' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ ok: false, msg: 'Ya está en favoritos' });
    }
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/favoritos?usuario_id=&ruta_id=
const remove = async (req, res) => {
  try {
    const { usuario_id, ruta_id } = req.query;

    if (!usuario_id || !ruta_id) {
      return res.status(400).json({ ok: false, msg: 'usuario_id y ruta_id son requeridos' });
    }

    await pool.query('DELETE FROM favorito WHERE id_usuario = ? AND id_ruta = ?', [usuario_id, ruta_id]);
    res.json({ ok: true, msg: 'Eliminado de favoritos' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getByUsuario, add, remove };
