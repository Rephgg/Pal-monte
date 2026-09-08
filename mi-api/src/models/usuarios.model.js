/**
 * Model USUARIOS + PERFIL (tablas `usuario` y `perfil`)
 * Mismo patrón que tu ejemplo productos: ? placeholders, devuelve datos.
 */
const pool = require('../db');
// ? = placeholder seguro (evita SQL Injection)

const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT id FROM usuario WHERE email = ?', [email]);
  return rows[0]; // undefined si no existe
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM usuario WHERE id = ?', [id]);
  return rows[0];
};

const findLogin = async (email) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.nombre, u.email, u.password, p.nivel_ciclista as nivel, p.rol
     FROM usuario u JOIN perfil p ON u.id = p.id_usuario
     WHERE u.email = ? AND u.activo = 1`,
    [email]
  );
  return rows[0];
};

const create = async ({ nombre, email, hash, telefono = null }) => {
  const [result] = await pool.query(
    'INSERT INTO usuario (nombre, email, password, telefono) VALUES (?, ?, ?, ?)',
    [nombre, email, hash, telefono]
  );
  return { id: result.insertId, nombre, email };
};

const createPerfil = async (user_id, nivel = 'principiante') => {
  await pool.query('INSERT INTO perfil (id_usuario, nivel_ciclista) VALUES (?, ?)', [user_id, nivel]);
  return { id_usuario: user_id, nivel_ciclista: nivel };
};

const getPerfil = async (usuario_id) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.nombre, u.email, u.telefono, u.fecha_registro,
            p.foto, p.km_recorridos, p.nivel_ciclista, p.rol
     FROM usuario u JOIN perfil p ON u.id = p.id_usuario
     WHERE u.id = ?`,
    [usuario_id]
  );
  return rows[0];
};

const getFavoritosByUsuario = async (usuario_id) => {
  const [rows] = await pool.query(
    `SELECT r.id, r.nombre, r.distancia_km, r.dificultad
     FROM favorito f JOIN ruta r ON f.id_ruta = r.id
     WHERE f.id_usuario = ?`,
    [usuario_id]
  );
  return rows;
};

const getHistorialByUsuario = async (usuario_id) => {
  const [rows] = await pool.query(
    `SELECT r.id, r.nombre, r.distancia_km, rr.fecha, rr.tiempo_real
     FROM ruta_realizada rr JOIN ruta r ON rr.id_ruta = r.id
     WHERE rr.id_usuario = ? ORDER BY rr.fecha DESC`,
    [usuario_id]
  );
  return rows;
};

const getAll = async () => {
  const [rows] = await pool.query(
    `SELECT u.id, u.nombre, u.email, u.telefono, u.fecha_registro, u.activo,
            p.nivel_ciclista, p.rol
     FROM usuario u JOIN perfil p ON u.id = p.id_usuario`
  );
  return rows;
};

const updateUsuario = async (id, { nombre, email, telefono, activo }) => {
  const fields = [];
  const values = [];
  if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
  if (email !== undefined) { fields.push('email = ?'); values.push(email); }
  if (telefono !== undefined) { fields.push('telefono = ?'); values.push(telefono); }
  if (activo !== undefined) { fields.push('activo = ?'); values.push(activo); }
  if (fields.length === 0) return 0;
  values.push(id);
  const [result] = await pool.query(`UPDATE usuario SET ${fields.join(', ')} WHERE id = ?`, values);
  return result.affectedRows;
};

const updatePerfil = async (id, { nivel, foto, rol }) => {
  const fields = [];
  const values = [];
  if (nivel !== undefined) { fields.push('nivel_ciclista = ?'); values.push(nivel); }
  if (foto !== undefined) { fields.push('foto = ?'); values.push(foto); }
  if (rol !== undefined) { fields.push('rol = ?'); values.push(rol); }
  if (fields.length === 0) return 0;
  values.push(id);
  const [result] = await pool.query(`UPDATE perfil SET ${fields.join(', ')} WHERE id_usuario = ?`, values);
  return result.affectedRows;
};

const updatePassword = async (id, hash) => {
  const [result] = await pool.query('UPDATE usuario SET password = ? WHERE id = ?', [hash, id]);
  return result.affectedRows;
};

const deactivate = async (id) => {
  const [result] = await pool.query('UPDATE usuario SET activo = 0 WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = {
  findByEmail, findById, findLogin, create, createPerfil,
  getPerfil, getFavoritosByUsuario, getHistorialByUsuario, getAll,
  updateUsuario, updatePerfil, updatePassword, deactivate,
};
