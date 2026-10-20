/**
 * ==============================================
 * HORARIOS DE COMERCIO
 * Endpoints:
 *  - GET    /api/comercios/:comercio_id/horarios
 *  - POST   /api/comercios/:comercio_id/horarios
 *  - PUT    /api/horarios/:horario_id
 *  - DELETE /api/horarios/:horario_id
 * Nota: dia_semana 1=Lunes ... 7=Domingo.
 * ==============================================
 */
const horarios = require('../models/horariosComercio.model');

// GET /api/comercios/:comercio_id/horarios
const getByComercio = async (req, res) => {
  try {
    const { comercio_id } = req.params;
    const rows = await horarios.getByComercio(comercio_id);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/comercios/:comercio_id/horarios
const create = async (req, res) => {
  try {
    const { comercio_id } = req.params;
    const { dia_semana, hora_apertura = null, hora_cierre = null, cerrado = 0 } = req.body || {};
    if (dia_semana === undefined) return res.status(400).json({ ok: false, msg: 'dia_semana es requerido (1-7)' });

    const result = await horarios.create({ id_comercio: comercio_id, dia_semana, hora_apertura, hora_cierre, cerrado });
    res.status(201).json({ ok: true, msg: 'Horario creado correctamente', data: result });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ ok: false, msg: 'Ya existe un horario para ese día' });
    }
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// PUT /api/horarios/:horario_id
const update = async (req, res) => {
  try {
    const { horario_id } = req.params;
    const affected = await horarios.update(horario_id, req.body || {});
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Horario no encontrado' });

    res.json({ ok: true, msg: 'Horario actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/horarios/:horario_id
const remove = async (req, res) => {
  try {
    const { horario_id } = req.params;
    const affected = await horarios.remove(horario_id);
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Horario no encontrado' });

    res.json({ ok: true, msg: 'Horario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getByComercio, create, update, remove };