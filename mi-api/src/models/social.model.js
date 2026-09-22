/**
 * Model SOCIAL (tablas `seguidor`, `publicacion`, `comentario`, `me_gusta`)
 * Comunidad: seguimiento entre ciclistas, publicaciones, comentarios y me gusta.
 */
const pool = require('../db');

/* ---------------- SEGUIDORES ---------------- */

const seguir = async (id_seguidor, id_seguido) => {
  const [result] = await pool.query(
    'INSERT INTO seguidor (id_seguidor, id_seguido) VALUES (?, ?)',
    [id_seguidor, id_seguido]
  );
  return result.affectedRows;
};

const dejarDeSeguir = async (id_seguidor, id_seguido) => {
  const [result] = await pool.query(
    'DELETE FROM seguidor WHERE id_seguidor = ? AND id_seguido = ?',
    [id_seguidor, id_seguido]
  );
  return result.affectedRows;
};

const seguidosByUsuario = async (id_usuario) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.nombre, u.email, s.fecha
     FROM seguidor s JOIN usuario u ON s.id_seguido = u.id
     WHERE s.id_seguidor = ? ORDER BY s.fecha DESC`,
    [id_usuario]
  );
  return rows;
};

const seguidoresByUsuario = async (id_usuario) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.nombre, u.email, s.fecha
     FROM seguidor s JOIN usuario u ON s.id_seguidor = u.id
     WHERE s.id_seguido = ? ORDER BY s.fecha DESC`,
    [id_usuario]
  );
  return rows;
};

/* ---------------- PUBLICACIONES ---------------- */

const getAllPublicaciones = async () => {
  const [rows] = await pool.query(
    `SELECT p.id, p.id_usuario, u.nombre AS autor, u.email AS autor_email,
            p.texto, p.imagen, p.fecha, p.activo,
            (SELECT COUNT(*) FROM me_gusta mg WHERE mg.id_publicacion = p.id) AS total_me_gusta,
            (SELECT COUNT(*) FROM comentario c WHERE c.id_publicacion = p.id) AS total_comentarios
     FROM publicacion p JOIN usuario u ON p.id_usuario = u.id
     WHERE p.activo = 1 ORDER BY p.fecha DESC`
  );
  return rows;
};

const publicacionesByUsuario = async (id_usuario) => {
  const [rows] = await pool.query(
    `SELECT p.id, p.id_usuario, p.texto, p.imagen, p.fecha, p.activo
     FROM publicacion p WHERE p.id_usuario = ? AND p.activo = 1 ORDER BY p.fecha DESC`,
    [id_usuario]
  );
  return rows;
};

const findPublicacion = async (id) => {
  const [rows] = await pool.query('SELECT * FROM publicacion WHERE id = ?', [id]);
  return rows[0];
};

const createPublicacion = async ({ id_usuario, texto, imagen = 'default_post.png' }) => {
  const [result] = await pool.query(
    'INSERT INTO publicacion (id_usuario, texto, imagen) VALUES (?, ?, ?)',
    [id_usuario, texto, imagen]
  );
  return { id: result.insertId };
};

const removePublicacion = async (id) => {
  const [result] = await pool.query('UPDATE publicacion SET activo = 0 WHERE id = ?', [id]);
  return result.affectedRows;
};

/* ---------------- COMENTARIOS ---------------- */

const comentariosByPublicacion = async (id_publicacion) => {
  const [rows] = await pool.query(
    `SELECT c.id, c.id_publicacion, c.id_usuario, u.nombre AS autor, c.texto, c.fecha
     FROM comentario c JOIN usuario u ON c.id_usuario = u.id
     WHERE c.id_publicacion = ? ORDER BY c.fecha ASC`,
    [id_publicacion]
  );
  return rows;
};

const addComentario = async ({ id_publicacion, id_usuario, texto }) => {
  const [result] = await pool.query(
    'INSERT INTO comentario (id_publicacion, id_usuario, texto) VALUES (?, ?, ?)',
    [id_publicacion, id_usuario, texto]
  );
  return { id: result.insertId };
};

const removeComentario = async (id) => {
  const [result] = await pool.query('DELETE FROM comentario WHERE id = ?', [id]);
  return result.affectedRows;
};

/* ---------------- ME GUSTA ---------------- */

const darMeGusta = async (id_publicacion, id_usuario) => {
  const [result] = await pool.query(
    'INSERT INTO me_gusta (id_publicacion, id_usuario) VALUES (?, ?)',
    [id_publicacion, id_usuario]
  );
  return result.affectedRows;
};

const quitarMeGusta = async (id_publicacion, id_usuario) => {
  const [result] = await pool.query(
    'DELETE FROM me_gusta WHERE id_publicacion = ? AND id_usuario = ?',
    [id_publicacion, id_usuario]
  );
  return result.affectedRows;
};

const meGustaByPublicacion = async (id_publicacion) => {
  const [rows] = await pool.query(
    `SELECT mg.id_publicacion, mg.id_usuario, u.nombre, mg.fecha
     FROM me_gusta mg JOIN usuario u ON mg.id_usuario = u.id
     WHERE mg.id_publicacion = ? ORDER BY mg.fecha`,
    [id_publicacion]
  );
  return rows;
};

module.exports = {
  seguir, dejarDeSeguir, seguidosByUsuario, seguidoresByUsuario,
  getAllPublicaciones, publicacionesByUsuario, findPublicacion,
  createPublicacion, removePublicacion,
  comentariosByPublicacion, addComentario, removeComentario,
  darMeGusta, quitarMeGusta, meGustaByPublicacion,
};