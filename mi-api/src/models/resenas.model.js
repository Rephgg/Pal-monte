/**
 * Model RESEÑAS (tabla `resena`)
 * Una reseña es de ruta O de comercio (check chk_resena_tipo).
 * Mismo patrón que tu ejemplo productos: ? placeholders, devuelve datos.
 */
const pool = require('../db');
// ? = placeholder seguro (evita SQL Injection)

const findByUsuarioRuta = async (id_usuario, id_ruta) => {
  const [rows] = await pool.query(
    'SELECT * FROM resena WHERE id_usuario = ? AND id_ruta = ?',
    [id_usuario, id_ruta]
  );
  return rows[0];
};

const findByUsuarioComercio = async (id_usuario, id_comercio) => {
  const [rows] = await pool.query(
    'SELECT * FROM resena WHERE id_usuario = ? AND id_comercio = ?',
    [id_usuario, id_comercio]
  );
  return rows[0];
};

const createRuta = async ({ id_usuario, id_ruta, calificacion, comentario }) => {
  const [result] = await pool.query(
    'INSERT INTO resena (id_usuario, id_ruta, calificacion, comentario) VALUES (?, ?, ?, ?)',
    [id_usuario, id_ruta, calificacion, comentario]
  );
  return { id: result.insertId, id_usuario, id_ruta, calificacion };
};

const createComercio = async ({ id_usuario, id_comercio, calificacion, comentario }) => {
  const [result] = await pool.query(
    'INSERT INTO resena (id_usuario, id_comercio, calificacion, comentario) VALUES (?, ?, ?, ?)',
    [id_usuario, id_comercio, calificacion, comentario]
  );
  return { id: result.insertId, id_usuario, id_comercio, calificacion };
};

const update = async (id, { calificacion, comentario }) => {
  const [result] = await pool.query(
    'UPDATE resena SET calificacion = ?, comentario = ? WHERE id = ?',
    [calificacion, comentario, id]
  );
  return result.affectedRows; // 0 si no existe
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM resena WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { findByUsuarioRuta, findByUsuarioComercio, createRuta, createComercio, update, remove };
