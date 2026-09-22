/**
 * Model PATROCINADORES (tablas `patrocinador` y `patrocinador_evento`)
 * Empresas patrocinadoras y su relación N:M con eventos.
 */
const pool = require('../db');

/* ---------------- PATROCINADORES ---------------- */

const getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM patrocinador ORDER BY id');
  return rows;
};

const create = async ({ nombre, descripcion = null, logo = 'default_sponsor.png', web = null }) => {
  const [result] = await pool.query(
    'INSERT INTO patrocinador (nombre, descripcion, logo, web) VALUES (?, ?, ?, ?)',
    [nombre, descripcion, logo, web]
  );
  return { id: result.insertId };
};

const update = async (id, { nombre, descripcion, logo, web }) => {
  const fields = [];
  const values = [];
  if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
  if (descripcion !== undefined) { fields.push('descripcion = ?'); values.push(descripcion); }
  if (logo !== undefined) { fields.push('logo = ?'); values.push(logo); }
  if (web !== undefined) { fields.push('web = ?'); values.push(web); }
  if (fields.length === 0) return 0;
  values.push(id);
  const [result] = await pool.query(`UPDATE patrocinador SET ${fields.join(', ')} WHERE id = ?`, values);
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM patrocinador WHERE id = ?', [id]);
  return result.affectedRows;
};

/* ---------------- PATROCINADORES POR EVENTO ---------------- */

const byEvento = async (id_evento) => {
  const [rows] = await pool.query(
    `SELECT p.id, p.nombre, p.descripcion, p.logo, p.web, pe.aporte
     FROM patrocinador_evento pe JOIN patrocinador p ON pe.id_patrocinador = p.id
     WHERE pe.id_evento = ? ORDER BY p.id`,
    [id_evento]
  );
  return rows;
};

const vincular = async (id_evento, id_patrocinador, aporte = null) => {
  const [result] = await pool.query(
    'INSERT INTO patrocinador_evento (id_evento, id_patrocinador, aporte) VALUES (?, ?, ?)',
    [id_evento, id_patrocinador, aporte]
  );
  return result.affectedRows;
};

const desvincular = async (id_evento, id_patrocinador) => {
  const [result] = await pool.query(
    'DELETE FROM patrocinador_evento WHERE id_evento = ? AND id_patrocinador = ?',
    [id_evento, id_patrocinador]
  );
  return result.affectedRows;
};

module.exports = { getAll, create, update, remove, byEvento, vincular, desvincular };