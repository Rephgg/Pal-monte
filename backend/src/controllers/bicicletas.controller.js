/**
 * ==============================================
 * BICICLETAS
 * Endpoints:
 *  - GET    /api/bicicletas?usuario_id=
 *  - GET    /api/bicicletas/:bicicleta_id
 *  - POST   /api/bicicletas
 *  - PUT    /api/bicicletas/:bicicleta_id
 *  - DELETE /api/bicicletas/:bicicleta_id
 * ==============================================
 */
const bicicletas = require('../models/bicicletas.model');

// GET /api/bicicletas?usuario_id=
const getByUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.query;
    if (!usuario_id) return res.status(400).json({ ok: false, msg: 'usuario_id es requerido' });

    const rows = await bicicletas.getByUsuario(usuario_id);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// GET /api/bicicletas/:bicicleta_id
const getById = async (req, res) => {
  try {
    const { bicicleta_id } = req.params;
    const bicicleta = await bicicletas.findById(bicicleta_id);
    if (!bicicleta) return res.status(404).json({ ok: false, msg: 'Bicicleta no encontrada' });

    res.json({ ok: true, data: bicicleta });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/bicicletas
const create = async (req, res) => {
  try {
    const { id_usuario, marca = null, modelo = null, tipo_bici = null, rodada = null, color = null, foto } = req.body || {};
    if (!id_usuario) return res.status(400).json({ ok: false, msg: 'id_usuario es requerido' });

    const result = await bicicletas.create({ id_usuario, marca, modelo, tipo_bici, rodada, color, foto });
    res.status(201).json({ ok: true, msg: 'Bicicleta registrada exitosamente', data: result });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// PUT /api/bicicletas/:bicicleta_id
const update = async (req, res) => {
  try {
    const { bicicleta_id } = req.params;
    const affected = await bicicletas.update(bicicleta_id, req.body || {});
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Bicicleta no encontrada' });

    res.json({ ok: true, msg: 'Bicicleta actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/bicicletas/:bicicleta_id
const remove = async (req, res) => {
  try {
    const { bicicleta_id } = req.params;
    const affected = await bicicletas.remove(bicicleta_id);
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Bicicleta no encontrada' });

    res.json({ ok: true, msg: 'Bicicleta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getByUsuario, getById, create, update, remove };