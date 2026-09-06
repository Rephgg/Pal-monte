/**
 * ==============================================
 * MIEMBRO 2 — PARTE 2: COMERCIOS
 * Endpoints:
 *  - GET    /api/comercios (?tipo=)
 *  - GET    /api/comercios/:comercio_id
 *  - POST   /api/admin/comercios
 *  - PUT    /api/admin/comercios/:comercio_id
 *  - DELETE /api/admin/comercios/:comercio_id
 * ==============================================
 */
const pool = require('../db');

const COLUMNS = `id, nombre, tipo, direccion, coordenadas, telefono, horario, foto, calificacion`;

// GET /api/comercios
const getAll = async (req, res) => {
  try {
    const { tipo } = req.query;
    let rows;

    if (tipo && tipo !== 'todos') {
      [rows] = await pool.query(`SELECT ${COLUMNS} FROM comercio WHERE tipo = ? ORDER BY nombre`, [tipo]);
    } else {
      [rows] = await pool.query(`SELECT ${COLUMNS} FROM comercio ORDER BY nombre`);
    }

    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// GET /api/comercios/:comercio_id
const getById = async (req, res) => {
  try {
    const { comercio_id } = req.params;

    const [rows] = await pool.query(`SELECT ${COLUMNS}, verificado FROM comercio WHERE id = ?`, [comercio_id]);
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, msg: 'Comercio no encontrado' });
    }

    const [resenas] = await pool.query(
      `SELECT r.id, r.calificacion, r.comentario, r.fecha, u.nombre as usuario
       FROM resena r JOIN usuario u ON r.id_usuario = u.id
       WHERE r.id_comercio = ? ORDER BY r.fecha DESC`,
      [comercio_id]
    );

    const [prom] = await pool.query('SELECT AVG(calificacion) as promedio FROM resena WHERE id_comercio = ?', [comercio_id]);

    res.json({
      ok: true,
      data: { ...rows[0], resenas, promedio_calificacion: prom[0].promedio || 0 },
    });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/admin/comercios
const create = async (req, res) => {
  try {
    const { nombre, tipo, direccion, coordenadas, telefono, horario } = req.body || {};

    if (!nombre || !tipo) {
      return res.status(400).json({ ok: false, msg: 'nombre y tipo son requeridos' });
    }

    const [result] = await pool.query(
      `INSERT INTO comercio (nombre, tipo, direccion, coordenadas, telefono, horario)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, tipo, direccion, coordenadas, telefono, horario]
    );

    res.status(201).json({ ok: true, msg: 'Comercio creado exitosamente', id: result.insertId });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// PUT /api/admin/comercios/:comercio_id
const update = async (req, res) => {
  try {
    const { comercio_id } = req.params;
    const { nombre, tipo, direccion, coordenadas, telefono, horario } = req.body || {};

    const [result] = await pool.query(
      `UPDATE comercio SET nombre=?, tipo=?, direccion=?, coordenadas=?, telefono=?, horario=?
       WHERE id=?`,
      [nombre, tipo, direccion, coordenadas, telefono, horario, comercio_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, msg: 'Comercio no encontrado' });
    }

    res.json({ ok: true, msg: 'Comercio actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/admin/comercios/:comercio_id
const remove = async (req, res) => {
  try {
    const { comercio_id } = req.params;
    const [result] = await pool.query('DELETE FROM comercio WHERE id = ?', [comercio_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, msg: 'Comercio no encontrado' });
    }

    res.json({ ok: true, msg: 'Comercio eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
