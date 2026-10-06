/**
 * ==============================================
 * NOTIFICACIONES
 * Endpoints:
 *  - GET    /api/notificaciones?usuario_id=
 *  - GET    /api/notificaciones/no-leidas?usuario_id=
 *  - POST   /api/notificaciones
 *  - PUT    /api/notificaciones/:notificacion_id/leida
 *  - PUT    /api/notificaciones/leidas?usuario_id=
 *  - DELETE /api/notificaciones/:notificacion_id
 * ==============================================
 */
const notificaciones = require('../models/notificaciones.model');

// GET /api/notificaciones?usuario_id=
const getByUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.query;
    if (!usuario_id) return res.status(400).json({ ok: false, msg: 'usuario_id es requerido' });

    const rows = await notificaciones.getByUsuario(usuario_id);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// GET /api/notificaciones/no-leidas?usuario_id=
const getNoLeidas = async (req, res) => {
  try {
    const { usuario_id } = req.query;
    if (!usuario_id) return res.status(400).json({ ok: false, msg: 'usuario_id es requerido' });

    const rows = await notificaciones.getNoLeidas(usuario_id);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/notificaciones
const create = async (req, res) => {
  try {
    const { id_usuario, tipo, texto, id_referencia = null } = req.body || {};
    if (!id_usuario || !tipo || !texto) {
      return res.status(400).json({ ok: false, msg: 'id_usuario, tipo y texto son requeridos' });
    }

    const result = await notificaciones.create({ id_usuario, tipo, texto, id_referencia });
    res.status(201).json({ ok: true, msg: 'Notificación creada', data: result });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// PUT /api/notificaciones/:notificacion_id/leida
const marcarLeida = async (req, res) => {
  try {
    const { notificacion_id } = req.params;
    const affected = await notificaciones.marcarLeida(notificacion_id);
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Notificación no encontrada' });

    res.json({ ok: true, msg: 'Notificación marcada como leída' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// PUT /api/notificaciones/leidas?usuario_id=
const marcarTodasLeidas = async (req, res) => {
  try {
    const { usuario_id } = req.query;
    if (!usuario_id) return res.status(400).json({ ok: false, msg: 'usuario_id es requerido' });

    const affected = await notificaciones.marcarTodasLeidas(usuario_id);
    res.json({ ok: true, msg: `Notificaciones marcadas como leídas`, data: { marcadas: affected } });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/notificaciones/:notificacion_id
const remove = async (req, res) => {
  try {
    const { notificacion_id } = req.params;
    const affected = await notificaciones.remove(notificacion_id);
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Notificación no encontrada' });

    res.json({ ok: true, msg: 'Notificación eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getByUsuario, getNoLeidas, create, marcarLeida, marcarTodasLeidas, remove };