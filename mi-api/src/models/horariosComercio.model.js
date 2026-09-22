/**
 * Model HORARIOS DE COMERCIO (tabla `horario_comercio`)
 * Horarios de atención por día de la semana (1=Lunes, 7=Domingo).
 */
const pool = require('../db');

const getByComercio = async (id_comercio) => {
  const [rows] = await pool.query(
    'SELECT id, id_comercio, dia_semana, hora_apertura, hora_cierre, cerrado FROM horario_comercio WHERE id_comercio = ? ORDER BY dia_semana',
    [id_comercio]
  );
  return rows;
};

const create = async ({ id_comercio, dia_semana, hora_apertura = null, hora_cierre = null, cerrado = 0 }) => {
  const [result] = await pool.query(
    'INSERT INTO horario_comercio (id_comercio, dia_semana, hora_apertura, hora_cierre, cerrado) VALUES (?, ?, ?, ?, ?)',
    [id_comercio, dia_semana, hora_apertura, hora_cierre, cerrado]
  );
  return { id: result.insertId };
};

const update = async (id, { hora_apertura, hora_cierre, cerrado }) => {
  const fields = [];
  const values = [];
  if (hora_apertura !== undefined) { fields.push('hora_apertura = ?'); values.push(hora_apertura); }
  if (hora_cierre !== undefined) { fields.push('hora_cierre = ?'); values.push(hora_cierre); }
  if (cerrado !== undefined) { fields.push('cerrado = ?'); values.push(cerrado); }
  if (fields.length === 0) return 0;
  values.push(id);
  const [result] = await pool.query(`UPDATE horario_comercio SET ${fields.join(', ')} WHERE id = ?`, values);
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM horario_comercio WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getByComercio, create, update, remove };