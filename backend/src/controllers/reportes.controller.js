/**
 * ==============================================
 * REPORTES (moderación)
 * Endpoints:
 *  - GET    /api/reportes?estado=
 *  - POST   /api/reportes
 *  - PUT    /api/reportes/:reporte_id/estado
 *  - DELETE /api/reportes/:reporte_id
 * ==============================================
 */
const reportes = require('../models/reportes.model');

// GET /api/reportes?estado=
const getAll = async (req, res) => {
  try {
    const { estado } = req.query;
    const [rows] = await reportes.getAll(estado || null);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/reportes
const create = async (req, res) => {
  try {
    const { id_usuario_reporta, tipo, id_referencia, motivo } = req.body || {};
    if (!id_usuario_reporta || !tipo || !id_referencia || !motivo) {
      return res.status(400).json({ ok: false, msg: 'id_usuario_reporta, tipo, id_referencia y motivo son requeridos' });
    }

    const result = await reportes.create({ id_usuario_reporta, tipo, id_referencia, motivo });
    res.status(201).json({ ok: true, msg: 'Reporte enviado exitosamente', data: result });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// PUT /api/reportes/:reporte_id/estado
const cambiarEstado = async (req, res) => {
  try {
    const { reporte_id } = req.params;
    const { estado } = req.body || {};
    if (!estado) return res.status(400).json({ ok: false, msg: 'estado es requerido' });

    const affected = await reportes.cambiarEstado(reporte_id, estado);
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Reporte no encontrado' });

    res.json({ ok: true, msg: 'Estado del reporte actualizado' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/reportes/:reporte_id
const remove = async (req, res) => {
  try {
    const { reporte_id } = req.params;
    const affected = await reportes.remove(reporte_id);
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Reporte no encontrado' });

    res.json({ ok: true, msg: 'Reporte eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getAll, create, cambiarEstado, remove };