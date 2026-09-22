/**
 * ==============================================
 * MIEMBRO 3 — PARTE 2: RESEÑAS
 * Endpoints:
 *  - POST   /api/resenas
 *  - PUT    /api/resenas/:resena_id
 *  - DELETE /api/resenas/:resena_id
 * ==============================================
 */
const pool = require('../db');

const syncComercioCalificacion = async (id_comercio) => {
  const [prom] = await pool.query('SELECT AVG(calificacion) as promedio FROM resena WHERE id_comercio = ?', [id_comercio]);
  await pool.query('UPDATE comercio SET calificacion = ? WHERE id = ?', [prom[0].promedio || 0, id_comercio]);
};

// POST /api/resenas
const create = async (req, res) => {
  try {
    const { id_usuario, id_ruta, id_comercio, calificacion, comentario } = req.body || {};

    if (!id_usuario) return res.status(400).json({ ok: false, msg: 'id_usuario es requerido' });
    if (!calificacion) return res.status(400).json({ ok: false, msg: 'calificacion es requerida' });
    if (!comentario) return res.status(400).json({ ok: false, msg: 'comentario es requerido' });

    if (id_ruta) {
      const [ya] = await pool.query('SELECT * FROM resena WHERE id_usuario = ? AND id_ruta = ?', [id_usuario, id_ruta]);
      if (ya.length > 0) return res.status(400).json({ ok: false, msg: 'Ya calificaste esta ruta' });

      await pool.query('INSERT INTO resena (id_usuario, id_ruta, calificacion, comentario) VALUES (?, ?, ?, ?)',
        [id_usuario, id_ruta, calificacion, comentario]);
    } else if (id_comercio) {
      const [ya] = await pool.query('SELECT * FROM resena WHERE id_usuario = ? AND id_comercio = ?', [id_usuario, id_comercio]);
      if (ya.length > 0) return res.status(400).json({ ok: false, msg: 'Ya calificaste este comercio' });

      await pool.query('INSERT INTO resena (id_usuario, id_comercio, calificacion, comentario) VALUES (?, ?, ?, ?)',
        [id_usuario, id_comercio, calificacion, comentario]);

      await syncComercioCalificacion(id_comercio);
    } else {
      return res.status(400).json({ ok: false, msg: 'Debes especificar una ruta o un comercio' });
    }

    res.status(201).json({ ok: true, msg: 'Reseña guardada exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// PUT /api/resenas/:resena_id
const update = async (req, res) => {
  try {
    const { resena_id } = req.params;
    const { calificacion, comentario } = req.body || {};

    if (!calificacion) return res.status(400).json({ ok: false, msg: 'calificacion es requerida' });
    if (!comentario) return res.status(400).json({ ok: false, msg: 'comentario es requerido' });

    const [resena] = await pool.query('SELECT id_comercio FROM resena WHERE id = ?', [resena_id]);
    if (resena.length === 0) return res.status(404).json({ ok: false, msg: 'Reseña no encontrada' });

    await pool.query(
      'UPDATE resena SET calificacion = ?, comentario = ? WHERE id = ?',
      [calificacion, comentario, resena_id]
    );

    if (resena[0].id_comercio) await syncComercioCalificacion(resena[0].id_comercio);

    res.json({ ok: true, msg: 'Reseña actualizada exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/resenas/:resena_id
const remove = async (req, res) => {
  try {
    const { resena_id } = req.params;
    const [resena] = await pool.query('SELECT id_comercio FROM resena WHERE id = ?', [resena_id]);
    if (resena.length === 0) return res.status(404).json({ ok: false, msg: 'Reseña no encontrada' });

    await pool.query('DELETE FROM resena WHERE id = ?', [resena_id]);

    if (resena[0].id_comercio) await syncComercioCalificacion(resena[0].id_comercio);

    res.json({ ok: true, msg: 'Reseña eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { create, update, remove };
