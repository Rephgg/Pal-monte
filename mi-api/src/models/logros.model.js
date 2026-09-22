/**
 * Model LOGROS (tablas `logro` y `logro_usuario`)
 * Catálogo de logros y logros desbloqueados por cada usuario.
 */
const pool = require('../db');

/* ---------------- CATÁLOGO DE LOGROS ---------------- */

const getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM logro ORDER BY id');
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM logro WHERE id = ?', [id]);
  return rows[0];
};

const create = async ({ nombre, descripcion = null, tipo_criterio = 'km', valor_requerido = 0, icono = 'default_challenge.png' }) => {
  const [result] = await pool.query(
    'INSERT INTO logro (nombre, descripcion, tipo_criterio, valor_requerido, icono) VALUES (?, ?, ?, ?, ?)',
    [nombre, descripcion, tipo_criterio, valor_requerido, icono]
  );
  return { id: result.insertId };
};

const update = async (id, { nombre, descripcion, tipo_criterio, valor_requerido, icono }) => {
  const fields = [];
  const values = [];
  if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
  if (descripcion !== undefined) { fields.push('descripcion = ?'); values.push(descripcion); }
  if (tipo_criterio !== undefined) { fields.push('tipo_criterio = ?'); values.push(tipo_criterio); }
  if (valor_requerido !== undefined) { fields.push('valor_requerido = ?'); values.push(valor_requerido); }
  if (icono !== undefined) { fields.push('icono = ?'); values.push(icono); }
  if (fields.length === 0) return 0;
  values.push(id);
  const [result] = await pool.query(`UPDATE logro SET ${fields.join(', ')} WHERE id = ?`, values);
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM logro WHERE id = ?', [id]);
  return result.affectedRows;
};

/* ---------------- LOGROS DEL USUARIO ---------------- */

const logrosByUsuario = async (id_usuario) => {
  const [rows] = await pool.query(
    `SELECT l.id, l.nombre, l.descripcion, l.tipo_criterio, l.valor_requerido, l.icono,
            lu.fecha AS fecha_desbloqueo
     FROM logro l JOIN logro_usuario lu ON l.id = lu.id_logro
     WHERE lu.id_usuario = ? ORDER BY lu.fecha`,
    [id_usuario]
  );
  return rows;
};

const tieneLogro = async (id_usuario, id_logro) => {
  const [rows] = await pool.query(
    'SELECT * FROM logro_usuario WHERE id_usuario = ? AND id_logro = ?',
    [id_usuario, id_logro]
  );
  return rows.length > 0;
};

const desbloquear = async (id_usuario, id_logro) => {
  const [result] = await pool.query(
    'INSERT INTO logro_usuario (id_usuario, id_logro) VALUES (?, ?)',
    [id_usuario, id_logro]
  );
  return result.affectedRows;
};

module.exports = {
  getAll, findById, create, update, remove,
  logrosByUsuario, tieneLogro, desbloquear,
};