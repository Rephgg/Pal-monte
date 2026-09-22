/**
 * Model NOTIFICACIONES (tabla `notificacion`)
 * Avisos por usuario: seguidores, me gusta, comentarios, eventos, logros y sistema.
 */
const pool = require('../db');

const getByUsuario = async (id_usuario) => {
  const [rows] = await pool.query(
    'SELECT id, id_usuario, tipo, texto, id_referencia, leida, fecha FROM notificacion WHERE id_usuario = ? ORDER BY fecha DESC',
    [id_usuario]
  );
  return rows;
};

const getNoLeidas = async (id_usuario) => {
  const [rows] = await pool.query(
    'SELECT id, id_usuario, tipo, texto, id_referencia, leida, fecha FROM notificacion WHERE id_usuario = ? AND leida = 0 ORDER BY fecha DESC',
    [id_usuario]
  );
  return rows;
};

const create = async ({ id_usuario, tipo, texto, id_referencia = null }) => {
  const [result] = await pool.query(
    'INSERT INTO notificacion (id_usuario, tipo, texto, id_referencia) VALUES (?, ?, ?, ?)',
    [id_usuario, tipo, texto, id_referencia]
  );
  return { id: result.insertId };
};

const marcarLeida = async (id) => {
  const [result] = await pool.query('UPDATE notificacion SET leida = 1 WHERE id = ?', [id]);
  return result.affectedRows;
};

const marcarTodasLeidas = async (id_usuario) => {
  const [result] = await pool.query('UPDATE notificacion SET leida = 1 WHERE id_usuario = ? AND leida = 0', [id_usuario]);
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM notificacion WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getByUsuario, getNoLeidas, create, marcarLeida, marcarTodasLeidas, remove };