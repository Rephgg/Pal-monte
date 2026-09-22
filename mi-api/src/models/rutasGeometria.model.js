/**
 * Model GEOMETRÍA DE RUTAS (tablas `punto_ruta` y `parada_ruta`)
 * Traza del recorrido (waypoints) y puntos de interés de cada ruta.
 */
const pool = require('../db');

/* ---------------- PUNTOS DE LA TRAZA ---------------- */

const puntosByRuta = async (id_ruta) => {
  const [rows] = await pool.query(
    'SELECT id, id_ruta, orden, lat, lng, altitud FROM punto_ruta WHERE id_ruta = ? ORDER BY orden',
    [id_ruta]
  );
  return rows;
};

const addPunto = async ({ id_ruta, orden, lat, lng, altitud = null }) => {
  const [result] = await pool.query(
    'INSERT INTO punto_ruta (id_ruta, orden, lat, lng, altitud) VALUES (?, ?, ?, ?, ?)',
    [id_ruta, orden, lat, lng, altitud]
  );
  return { id: result.insertId };
};

const updatePunto = async (id, { orden, lat, lng, altitud }) => {
  const fields = [];
  const values = [];
  if (orden !== undefined) { fields.push('orden = ?'); values.push(orden); }
  if (lat !== undefined) { fields.push('lat = ?'); values.push(lat); }
  if (lng !== undefined) { fields.push('lng = ?'); values.push(lng); }
  if (altitud !== undefined) { fields.push('altitud = ?'); values.push(altitud); }
  if (fields.length === 0) return 0;
  values.push(id);
  const [result] = await pool.query(`UPDATE punto_ruta SET ${fields.join(', ')} WHERE id = ?`, values);
  return result.affectedRows;
};

const removePunto = async (id) => {
  const [result] = await pool.query('DELETE FROM punto_ruta WHERE id = ?', [id]);
  return result.affectedRows;
};

/* ---------------- PARADAS / PUNTOS DE INTERÉS ---------------- */

const paradasByRuta = async (id_ruta) => {
  const [rows] = await pool.query(
    'SELECT id, id_ruta, nombre, tipo, lat, lng, descripcion FROM parada_ruta WHERE id_ruta = ? ORDER BY id',
    [id_ruta]
  );
  return rows;
};

const addParada = async ({ id_ruta, nombre, tipo = 'descanso', lat = null, lng = null, descripcion = null }) => {
  const [result] = await pool.query(
    'INSERT INTO parada_ruta (id_ruta, nombre, tipo, lat, lng, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
    [id_ruta, nombre, tipo, lat, lng, descripcion]
  );
  return { id: result.insertId };
};

const removeParada = async (id) => {
  const [result] = await pool.query('DELETE FROM parada_ruta WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = {
  puntosByRuta, addPunto, updatePunto, removePunto,
  paradasByRuta, addParada, removeParada,
};