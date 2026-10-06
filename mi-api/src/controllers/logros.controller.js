/**
 * ==============================================
 * LOGROS Y LOGROS DEL USUARIO
 * Endpoints:
 *  - GET    /api/logros
 *  - POST   /api/admin/logros
 *  - PUT    /api/admin/logros/:logro_id
 *  - DELETE /api/admin/logros/:logro_id
 *  - GET    /api/logros-usuario?usuario_id=
 *  - POST   /api/logros-usuario
 * ==============================================
 */
const logros = require('../models/logros.model');

// GET /api/logros
const getAll = async (req, res) => {
  try {
    const rows = await logros.getAll();
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/admin/logros
const create = async (req, res) => {
  try {
    const { nombre, descripcion = null, tipo_criterio = 'km', valor_requerido = 0, icono } = req.body || {};
    if (!nombre) return res.status(400).json({ ok: false, msg: 'nombre es requerido' });

    const result = await logros.create({ nombre, descripcion, tipo_criterio, valor_requerido, icono });
    res.status(201).json({ ok: true, msg: 'Logro creado exitosamente', data: result });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ ok: false, msg: 'Ya existe un logro con ese nombre' });
    }
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// PUT /api/admin/logros/:logro_id
const update = async (req, res) => {
  try {
    const { logro_id } = req.params;
    const affected = await logros.update(logro_id, req.body || {});
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Logro no encontrado' });

    res.json({ ok: true, msg: 'Logro actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/admin/logros/:logro_id
const remove = async (req, res) => {
  try {
    const { logro_id } = req.params;
    const affected = await logros.remove(logro_id);
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Logro no encontrado' });

    res.json({ ok: true, msg: 'Logro eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// GET /api/logros-usuario?usuario_id=
const getLogrosByUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.query;
    if (!usuario_id) return res.status(400).json({ ok: false, msg: 'usuario_id es requerido' });

    const rows = await logros.logrosByUsuario(usuario_id);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/logros-usuario
const desbloquear = async (req, res) => {
  try {
    const { id_usuario, id_logro } = req.body || {};
    if (!id_usuario || !id_logro) {
      return res.status(400).json({ ok: false, msg: 'id_usuario e id_logro son requeridos' });
    }

    const yaTiene = await logros.tieneLogro(id_usuario, id_logro);
    if (yaTiene) return res.status(400).json({ ok: false, msg: 'Logro ya desbloqueado por este usuario' });

    const logro = await logros.findById(id_logro);
    if (!logro) return res.status(404).json({ ok: false, msg: 'Logro no encontrado' });

    await logros.desbloquear(id_usuario, id_logro);

    const notificaciones = require('../models/notificaciones.model');
    await notificaciones.create({
      id_usuario,
      tipo: 'logro',
      texto: `¡Logro desbloqueado: ${logro.nombre}!`,
      id_referencia: id_logro,
    });

    res.status(201).json({ ok: true, msg: `¡Logro desbloqueado: ${logro.nombre}!` });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, create, update, remove, getLogrosByUsuario, desbloquear };