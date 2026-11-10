/**
 * ==============================================
 * PATROCINADORES
 * Endpoints:
 *  - GET    /api/patrocinadores
 *  - POST   /api/admin/patrocinadores
 *  - PUT    /api/admin/patrocinadores/:patrocinador_id
 *  - DELETE /api/admin/patrocinadores/:patrocinador_id
 *  - GET    /api/eventos/:evento_id/patrocinadores
 *  - POST   /api/eventos/:evento_id/patrocinadores
 *  - DELETE /api/eventos/:evento_id/patrocinadores?patrocinador_id=
 * ==============================================
 */
const patrocinadores = require('../models/patrocinadores.model');

// GET /api/patrocinadores
const getAll = async (req, res) => {
  try {
    const rows = await patrocinadores.getAll();
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/admin/patrocinadores
const create = async (req, res) => {
  try {
    const { nombre, descripcion = null, logo, web = null } = req.body || {};
    if (!nombre) return res.status(400).json({ ok: false, msg: 'nombre es requerido' });

    const result = await patrocinadores.create({ nombre, descripcion, logo, web });
    res.status(201).json({ ok: true, msg: 'Patrocinador creado exitosamente', data: result });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// PUT /api/admin/patrocinadores/:patrocinador_id
const update = async (req, res) => {
  try {
    const { patrocinador_id } = req.params;
    const affected = await patrocinadores.update(patrocinador_id, req.body || {});
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Patrocinador no encontrado' });

    res.json({ ok: true, msg: 'Patrocinador actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/admin/patrocinadores/:patrocinador_id
const remove = async (req, res) => {
  try {
    const { patrocinador_id } = req.params;
    const affected = await patrocinadores.remove(patrocinador_id);
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Patrocinador no encontrado' });

    res.json({ ok: true, msg: 'Patrocinador eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

/* ---------------- VINCULACIÓN CON EVENTOS ---------------- */

// GET /api/eventos/:evento_id/patrocinadores
const getByEvento = async (req, res) => {
  try {
    const { evento_id } = req.params;
    const rows = await patrocinadores.byEvento(evento_id);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/eventos/:evento_id/patrocinadores
const vincular = async (req, res) => {
  try {
    const { evento_id } = req.params;
    const { id_patrocinador, aporte = null } = req.body || {};
    if (!id_patrocinador) return res.status(400).json({ ok: false, msg: 'id_patrocinador es requerido' });

    await patrocinadores.vincular(evento_id, id_patrocinador, aporte);
    res.status(201).json({ ok: true, msg: 'Patrocinador vinculado al evento' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ ok: false, msg: 'El patrocinador ya está vinculado a este evento' });
    }
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/eventos/:evento_id/patrocinadores?patrocinador_id=
const desvincular = async (req, res) => {
  try {
    const { evento_id } = req.params;
    const { patrocinador_id } = req.query;
    if (!patrocinador_id) return res.status(400).json({ ok: false, msg: 'patrocinador_id es requerido' });

    const affected = await patrocinadores.desvincular(evento_id, patrocinador_id);
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Vínculo no encontrado' });

    res.json({ ok: true, msg: 'Patrocinador desvinculado del evento' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, create, update, remove, getByEvento, vincular, desvincular };