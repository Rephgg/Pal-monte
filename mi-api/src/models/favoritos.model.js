/**
 * Model FAVORITOS (tabla `favorito`, PK compuesta id_usuario + id_ruta)
 * Mismo patrón que tu ejemplo productos: ? placeholders, devuelve datos.
 */
const pool = require('../db');
// ? = placeholder seguro (evita SQL Injection)

const getByUsuario = async (usuario_id) => {
  const [rows] = await pool.query(
    `SELECT r.id, r.nombre, r.distancia_km, r.dificultad, r.zona, f.fecha as fecha_favorito
     FROM favorito f JOIN ruta r ON f.id_ruta = r.id
     WHERE f.id_usuario = ? ORDER BY f.fecha DESC`,
    [usuario_id]
  );
  return rows;
};

const add = async (usuario_id, ruta_id) => {
  const [result] = await pool.query(
    'INSERT INTO favorito (id_usuario, id_ruta) VALUES (?, ?)',
    [usuario_id, ruta_id]
  );
  return result.affectedRows; // 1 si se insertó
};

const remove = async (usuario_id, ruta_id) => {
  const [result] = await pool.query(
    'DELETE FROM favorito WHERE id_usuario = ? AND id_ruta = ?',
    [usuario_id, ruta_id]
  );
  return result.affectedRows;
};

module.exports = { getByUsuario, add, remove };
