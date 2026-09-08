/**
 * Model EVENTOS (tablas `evento` y `asistencia_evento`)
 * Mismo patrón que tu ejemplo productos: ? placeholders, devuelve datos.
 */
const pool = require('../db');
// ? = placeholder seguro (evita SQL Injection)

const COLUMNS = `id, titulo, descripcion, fecha, hora_inicio, lugar, cupo_max, cupo_actual, cancelado`;

const getAll = async () => {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM evento WHERE fecha >= CURDATE() AND cancelado = 0 ORDER BY fecha ASC`
  );
  return rows;
};

const getAllAdmin = async () => {
  const [rows] = await pool.query(
    `SELECT e.id, e.titulo, e.descripcion, e.fecha, e.hora_inicio, e.lugar,
            e.cupo_max, e.cupo_actual, e.cancelado, u.nombre as organizador
     FROM evento e LEFT JOIN usuario u ON e.id_organizador = u.id
     ORDER BY e.fecha DESC`
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    `SELECT e.id, e.titulo, e.descripcion, e.fecha, e.hora_inicio, e.lugar,
            e.cupo_max, e.cupo_actual, e.cancelado, u.nombre as organizador
     FROM evento e LEFT JOIN usuario u ON e.id_organizador = u.id
     WHERE e.id = ?`,
    [id]
  );
  return rows[0]; // undefined si no existe
};

const getAsistentes = async (evento_id) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.nombre FROM asistencia_evento a JOIN usuario u ON a.id_usuario = u.id
     WHERE a.id_evento = ?`,
    [evento_id]
  );
  return rows;
};

const create = async ({ titulo, descripcion, fecha, hora_inicio, lugar, cupo_max, organizador_id }) => {
  const [result] = await pool.query(
    `INSERT INTO evento (titulo, descripcion, fecha, hora_inicio, lugar, cupo_max, id_organizador)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [titulo, descripcion, fecha, hora_inicio, lugar, cupo_max, organizador_id]
  );
  return { id: result.insertId, titulo, fecha };
};

const update = async (id, { titulo, descripcion, fecha, hora_inicio, lugar, cupo_max }) => {
  const [result] = await pool.query(
    `UPDATE evento SET titulo=?, descripcion=?, fecha=?, hora_inicio=?, lugar=?, cupo_max=?
     WHERE id=?`,
    [titulo, descripcion, fecha, hora_inicio, lugar, cupo_max, id]
  );
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM evento WHERE id = ?', [id]);
  return result.affectedRows;
};

const findAsistencia = async (usuario_id, evento_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM asistencia_evento WHERE id_usuario = ? AND id_evento = ?',
    [usuario_id, evento_id]
  );
  return rows[0];
};

const inscribir = async (usuario_id, evento_id) => {
  await pool.query('INSERT INTO asistencia_evento (id_usuario, id_evento) VALUES (?, ?)', [usuario_id, evento_id]);
  await pool.query('UPDATE evento SET cupo_actual = cupo_actual + 1 WHERE id = ?', [evento_id]);
  return true;
};

const cancelarInscripcion = async (usuario_id, evento_id) => {
  await pool.query('DELETE FROM asistencia_evento WHERE id_usuario = ? AND id_evento = ?', [usuario_id, evento_id]);
  await pool.query('UPDATE evento SET cupo_actual = cupo_actual - 1 WHERE id = ?', [evento_id]);
  return true;
};

const cancelarEvento = async (evento_id) => {
  const [result] = await pool.query('UPDATE evento SET cancelado = 1 WHERE id = ?', [evento_id]);
  return result.affectedRows;
};

const confirmar = async (usuario_id, evento_id) => {
  const [result] = await pool.query(
    'UPDATE asistencia_evento SET confirmado = 1 WHERE id_usuario = ? AND id_evento = ?',
    [usuario_id, evento_id]
  );
  return result.affectedRows;
};

const marcarAsistio = async (usuario_id, evento_id) => {
  const [result] = await pool.query(
    'UPDATE asistencia_evento SET confirmado = 1, asistio = 1 WHERE id_usuario = ? AND id_evento = ?',
    [usuario_id, evento_id]
  );
  return result.affectedRows;
};

module.exports = {
  getAll, getAllAdmin, getById, getAsistentes, create, update, remove,
  findAsistencia, inscribir, cancelarInscripcion, cancelarEvento, confirmar, marcarAsistio,
};
