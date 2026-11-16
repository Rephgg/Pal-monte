
const geometria = require('../models/rutasGeometria.model');

const getPuntos = async (req, res) => {
  try {
    const { ruta_id } = req.params;
    const rows = await geometria.puntosByRuta(ruta_id);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const addPunto = async (req, res) => {
  try {
    const { ruta_id } = req.params;
    const { orden, lat, lng, altitud = null } = req.body || {};

    if (orden === undefined || lat === undefined || lng === undefined) {
      return res.status(400).json({ ok: false, msg: 'orden, lat y lng son requeridos' });
    }

    const result = await geometria.addPunto({ id_ruta: ruta_id, orden, lat, lng, altitud });
    res.status(201).json({ ok: true, msg: 'Punto agregado a la ruta', data: result });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const updatePunto = async (req, res) => {
  try {
    const { punto_id } = req.params;
    const affected = await geometria.updatePunto(punto_id, req.body || {});
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Punto no encontrado' });

    res.json({ ok: true, msg: 'Punto actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const removePunto = async (req, res) => {
  try {
    const { punto_id } = req.params;
    const affected = await geometria.removePunto(punto_id);
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Punto no encontrado' });

    res.json({ ok: true, msg: 'Punto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const getParadas = async (req, res) => {
  try {
    const { ruta_id } = req.params;
    const rows = await geometria.paradasByRuta(ruta_id);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const addParada = async (req, res) => {
  try {
    const { ruta_id } = req.params;
    const { nombre, tipo = 'descanso', lat = null, lng = null, descripcion = null } = req.body || {};

    if (!nombre) return res.status(400).json({ ok: false, msg: 'nombre es requerido' });

    const result = await geometria.addParada({ id_ruta: ruta_id, nombre, tipo, lat, lng, descripcion });
    res.status(201).json({ ok: true, msg: 'Parada agregada exitosamente', data: result });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

const removeParada = async (req, res) => {
  try {
    const { parada_id } = req.params;
    const affected = await geometria.removeParada(parada_id);
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Parada no encontrada' });

    res.json({ ok: true, msg: 'Parada eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getPuntos, addPunto, updatePunto, removePunto, getParadas, addParada, removeParada };