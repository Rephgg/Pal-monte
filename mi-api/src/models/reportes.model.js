/**
 * Model REPORTES (tabla `reporte`)
 * Moderación: reportes de usuarios y contenido por parte de la comunidad.
 */
const pool = require('../db');

const getAll = async (estado = null) => {
  const sql = `SELECT r.id, r.id_usuario_reporta, u.nombre AS usuario_reporta, r.tipo, r.id_referencia,
                      r.motivo, r.fecha, r.estado
               FROM reporte r JOIN usuario u ON r.id_usuario_reporta = u.id
               ${estado ? 'WHERE r.estado = ? ' : ''}ORDER BY r.fecha DESC`;
  return await pool.query(sql, estado ? [estado] : []);
};

const create = async ({ id_usuario_reporta, tipo, id_referencia, motivo }) => {
  const [result] = await pool.query(
    'INSERT INTO reporte (id_usuario_reporta, tipo, id_referencia, motivo) VALUES (?, ?, ?, ?)',
    [id_usuario_reporta, tipo, id_referencia, motivo]
  );
  return { id: result.insertId };
};

const cambiarEstado = async (id, estado) => {
  const [result] = await pool.query('UPDATE reporte SET estado = ? WHERE id = ?', [estado, id]);
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM reporte WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getAll, create, cambiarEstado, remove };