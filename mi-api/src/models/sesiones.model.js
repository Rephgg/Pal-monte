/**
 * Model SESIONES (tabla `sesion`)
 * Sesiones y tokens de autenticación por usuario.
 */
const pool = require('../db');

const create = async ({ id_usuario, token, expira }) => {
  const [result] = await pool.query(
    'INSERT INTO sesion (id_usuario, token, expira) VALUES (?, ?, ?)',
    [id_usuario, token, expira]
  );
  return { id: result.insertId, id_usuario, token };
};

const findByToken = async (token) => {
  const [rows] = await pool.query(
    `SELECT s.id, s.id_usuario, s.token, s.expira, s.activo, u.nombre, u.email
     FROM sesion s JOIN usuario u ON s.id_usuario = u.id
     WHERE s.token = ?`,
    [token]
  );
  return rows[0];
};

const findByUsuario = async (id_usuario) => {
  const [rows] = await pool.query(
    'SELECT id, token, fecha_creacion, expira, activo FROM sesion WHERE id_usuario = ? ORDER BY fecha_creacion DESC',
    [id_usuario]
  );
  return rows;
};

const revoke = async (token) => {
  const [result] = await pool.query('UPDATE sesion SET activo = 0 WHERE token = ?', [token]);
  return result.affectedRows;
};

module.exports = { create, findByToken, findByUsuario, revoke };