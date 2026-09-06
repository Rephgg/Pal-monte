/**
 * ==============================================
 * MIEMBRO 2 — PARTE 1: RUTAS
 * Endpoints:
 *  - GET    /api/rutas (?dificultad=)
 *  - GET    /api/rutas/:ruta_id
 *  - POST   /api/admin/rutas
 *  - PUT    /api/admin/rutas/:ruta_id
 *  - DELETE /api/admin/rutas/:ruta_id
 * ==============================================
 */
const pool = require('../db');

const COLUMNS = `id, nombre, descripcion, distancia_km, dificultad, tipo_bici,
                 tiempo_estimado, coordenadas, zona, elevacion, superficie, imagen`;

// GET /api/rutas
const getAll = async (req, res) => {
  try {
    const { dificultad } = req.query;
    let rows;

    if (dificultad && dificultad !== 'todas') {
      [rows] = await pool.query(
        `SELECT ${COLUMNS} FROM ruta WHERE dificultad = ? ORDER BY distancia_km`,
        [dificultad]
      );
    } else {
      [rows] = await pool.query(`SELECT ${COLUMNS} FROM ruta ORDER BY distancia_km`);
    }

    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// GET /api/rutas/:ruta_id
const getById = async (req, res) => {
  try {
    const { ruta_id } = req.params;

    const [rows] = await pool.query(`SELECT ${COLUMNS} FROM ruta WHERE id = ?`, [ruta_id]);
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, msg: 'Ruta no encontrada' });
    }

    const [resenas] = await pool.query(
      `SELECT r.id, r.calificacion, r.comentario, r.fecha, u.nombre as usuario
       FROM resena r JOIN usuario u ON r.id_usuario = u.id
       WHERE r.id_ruta = ? ORDER BY r.fecha DESC`,
      [ruta_id]
    );

    const [prom] = await pool.query('SELECT AVG(calificacion) as promedio FROM resena WHERE id_ruta = ?', [ruta_id]);

    res.json({
      ok: true,
      data: { ...rows[0], resenas, promedio_calificacion: prom[0].promedio || 0 },
    });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/admin/rutas
const create = async (req, res) => {
  try {
    const { nombre, descripcion, distancia_km, dificultad, tipo_bici, tiempo_estimado, coordenadas, zona, elevacion, superficie = 'mixta' } = req.body || {};

    if (!nombre || distancia_km === undefined || !dificultad) {
      return res.status(400).json({ ok: false, msg: 'nombre, distancia_km y dificultad son requeridos' });
    }

    const [result] = await pool.query(
      `INSERT INTO ruta (nombre, descripcion, distancia_km, dificultad, tipo_bici, tiempo_estimado, coordenadas, zona, elevacion, superficie)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, distancia_km, dificultad, tipo_bici, tiempo_estimado, coordenadas, zona, elevacion, superficie]
    );

    res.status(201).json({ ok: true, msg: 'Ruta creada exitosamente', id: result.insertId });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// PUT /api/admin/rutas/:ruta_id
const update = async (req, res) => {
  try {
    const { ruta_id } = req.params;
    const { nombre, descripcion, distancia_km, dificultad, tipo_bici, tiempo_estimado, coordenadas, zona, elevacion, superficie = 'mixta' } = req.body || {};

    const [result] = await pool.query(
      `UPDATE ruta SET nombre=?, descripcion=?, distancia_km=?, dificultad=?, tipo_bici=?,
              tiempo_estimado=?, coordenadas=?, zona=?, elevacion=?, superficie=?
       WHERE id=?`,
      [nombre, descripcion, distancia_km, dificultad, tipo_bici, tiempo_estimado, coordenadas, zona, elevacion, superficie, ruta_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, msg: 'Ruta no encontrada' });
    }

    res.json({ ok: true, msg: 'Ruta actualizada exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/admin/rutas/:ruta_id
const remove = async (req, res) => {
  try {
    const { ruta_id } = req.params;
    const [result] = await pool.query('DELETE FROM ruta WHERE id = ?', [ruta_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, msg: 'Ruta no encontrada' });
    }

    res.json({ ok: true, msg: 'Ruta eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
