/**
 * ==============================================
 * MIEMBRO 2 — PARTE 3: EVENTOS
 * Endpoints:
 *  - GET    /api/eventos
 *  - GET    /api/eventos/:evento_id
 *  - POST   /api/eventos?organizador_id=
 *  - POST   /api/eventos/:evento_id/inscribir
 *  - DELETE /api/eventos/:evento_id/cancelar-inscripcion
 *  - PUT    /api/eventos/:evento_id/cancelar
 *  - PUT    /api/eventos/:evento_id/confirmar
 *  - PUT    /api/eventos/:evento_id/asistio
 *  - GET    /api/admin/eventos
 *  - PUT    /api/admin/eventos/:evento_id
 *  - DELETE /api/admin/eventos/:evento_id
 * ==============================================
 */
const pool = require('../db');

// GET /api/eventos
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, titulo, descripcion, fecha, hora_inicio, lugar, cupo_max, cupo_actual, cancelado
       FROM evento WHERE fecha >= CURDATE() AND cancelado = 0 ORDER BY fecha ASC`
    );
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// GET /api/eventos/:evento_id
const getById = async (req, res) => {
  try {
    const { evento_id } = req.params;

    const [rows] = await pool.query(
      `SELECT e.id, e.titulo, e.descripcion, e.fecha, e.hora_inicio, e.lugar,
              e.cupo_max, e.cupo_actual, e.cancelado, u.nombre as organizador
       FROM evento e LEFT JOIN usuario u ON e.id_organizador = u.id
       WHERE e.id = ?`,
      [evento_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, msg: 'Evento no encontrado' });
    }

    const [asistentes] = await pool.query(
      `SELECT u.id, u.nombre FROM asistencia_evento a JOIN usuario u ON a.id_usuario = u.id
       WHERE a.id_evento = ?`,
      [evento_id]
    );

    res.json({ ok: true, data: { ...rows[0], asistentes } });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/eventos?organizador_id=
const create = async (req, res) => {
  try {
    const { organizador_id } = req.query;
    const { titulo, descripcion, fecha, hora_inicio, lugar, cupo_max } = req.body || {};

    if (!titulo || !fecha || !hora_inicio || !lugar || cupo_max === undefined) {
      return res.status(400).json({ ok: false, msg: 'titulo, fecha, hora_inicio, lugar y cupo_max son requeridos' });
    }
    if (!organizador_id) {
      return res.status(400).json({ ok: false, msg: 'organizador_id es requerido (query)' });
    }

    const [result] = await pool.query(
      `INSERT INTO evento (titulo, descripcion, fecha, hora_inicio, lugar, cupo_max, id_organizador)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [titulo, descripcion, fecha, hora_inicio, lugar, cupo_max, organizador_id]
    );

    res.status(201).json({ ok: true, msg: 'Evento creado exitosamente', id: result.insertId });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/eventos/:evento_id/inscribir
const inscribir = async (req, res) => {
  try {
    const { evento_id } = req.params;
    const { usuario_id } = req.body || {};

    if (!usuario_id) {
      return res.status(400).json({ ok: false, msg: 'usuario_id es requerido' });
    }

    const [ev] = await pool.query('SELECT cupo_actual, cupo_max, cancelado FROM evento WHERE id = ?', [evento_id]);
    if (ev.length === 0) return res.status(404).json({ ok: false, msg: 'Evento no encontrado' });
    if (ev[0].cancelado) return res.status(400).json({ ok: false, msg: 'Evento cancelado' });
    if (ev[0].cupo_actual >= ev[0].cupo_max) return res.status(400).json({ ok: false, msg: 'No hay cupos disponibles' });

    const [ya] = await pool.query('SELECT * FROM asistencia_evento WHERE id_usuario = ? AND id_evento = ?', [usuario_id, evento_id]);
    if (ya.length > 0) return res.status(400).json({ ok: false, msg: 'Ya estás inscrito' });

    await pool.query('INSERT INTO asistencia_evento (id_usuario, id_evento) VALUES (?, ?)', [usuario_id, evento_id]);
    await pool.query('UPDATE evento SET cupo_actual = cupo_actual + 1 WHERE id = ?', [evento_id]);

    res.status(201).json({ ok: true, msg: 'Inscripción exitosa' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/eventos/:evento_id/cancelar-inscripcion
const cancelarInscripcion = async (req, res) => {
  try {
    const { evento_id } = req.params;
    const { usuario_id } = req.body || {};

    if (!usuario_id) return res.status(400).json({ ok: false, msg: 'usuario_id es requerido' });

    const [existe] = await pool.query('SELECT * FROM asistencia_evento WHERE id_usuario = ? AND id_evento = ?', [usuario_id, evento_id]);
    if (existe.length === 0) return res.status(400).json({ ok: false, msg: 'No estás inscrito a este evento' });

    await pool.query('DELETE FROM asistencia_evento WHERE id_usuario = ? AND id_evento = ?', [usuario_id, evento_id]);
    await pool.query('UPDATE evento SET cupo_actual = cupo_actual - 1 WHERE id = ?', [evento_id]);

    res.json({ ok: true, msg: 'Inscripción cancelada exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// PUT /api/eventos/:evento_id/cancelar
const cancelarEvento = async (req, res) => {
  try {
    const { evento_id } = req.params;
    await pool.query('UPDATE evento SET cancelado = 1 WHERE id = ?', [evento_id]);
    res.json({ ok: true, msg: 'Evento cancelado' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// PUT /api/eventos/:evento_id/confirmar
const confirmar = async (req, res) => {
  try {
    const { evento_id } = req.params;
    const { usuario_id } = req.body || {};

    if (!usuario_id) return res.status(400).json({ ok: false, msg: 'usuario_id es requerido' });

    const [existe] = await pool.query('SELECT * FROM asistencia_evento WHERE id_usuario = ? AND id_evento = ?', [usuario_id, evento_id]);
    if (existe.length === 0) return res.status(400).json({ ok: false, msg: 'No estás inscrito a este evento' });

    await pool.query('UPDATE asistencia_evento SET confirmado = 1 WHERE id_usuario = ? AND id_evento = ?', [usuario_id, evento_id]);
    res.json({ ok: true, msg: 'Asistencia confirmada' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// PUT /api/eventos/:evento_id/asistio
const asistio = async (req, res) => {
  try {
    const { evento_id } = req.params;
    const { usuario_id } = req.body || {};

    if (!usuario_id) return res.status(400).json({ ok: false, msg: 'usuario_id es requerido' });

    const [existe] = await pool.query('SELECT * FROM asistencia_evento WHERE id_usuario = ? AND id_evento = ?', [usuario_id, evento_id]);
    if (existe.length === 0) return res.status(400).json({ ok: false, msg: 'No estás inscrito a este evento' });

    await pool.query('UPDATE asistencia_evento SET confirmado = 1, asistio = 1 WHERE id_usuario = ? AND id_evento = ?', [usuario_id, evento_id]);
    res.json({ ok: true, msg: 'Asistencia registrada' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// GET /api/admin/eventos
const getAllAdmin = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT e.id, e.titulo, e.descripcion, e.fecha, e.hora_inicio, e.lugar,
              e.cupo_max, e.cupo_actual, e.cancelado, u.nombre as organizador
       FROM evento e LEFT JOIN usuario u ON e.id_organizador = u.id
       ORDER BY e.fecha DESC`
    );
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// PUT /api/admin/eventos/:evento_id
const update = async (req, res) => {
  try {
    const { evento_id } = req.params;
    const { titulo, descripcion, fecha, hora_inicio, lugar, cupo_max } = req.body || {};

    const [result] = await pool.query(
      `UPDATE evento SET titulo=?, descripcion=?, fecha=?, hora_inicio=?, lugar=?, cupo_max=?
       WHERE id=?`,
      [titulo, descripcion, fecha, hora_inicio, lugar, cupo_max, evento_id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ ok: false, msg: 'Evento no encontrado' });

    res.json({ ok: true, msg: 'Evento actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/admin/eventos/:evento_id
const remove = async (req, res) => {
  try {
    const { evento_id } = req.params;
    const [result] = await pool.query('DELETE FROM evento WHERE id = ?', [evento_id]);

    if (result.affectedRows === 0) return res.status(404).json({ ok: false, msg: 'Evento no encontrado' });

    res.json({ ok: true, msg: 'Evento eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, getById, create, inscribir, cancelarInscripcion, cancelarEvento, confirmar, asistio, getAllAdmin, update, remove };
