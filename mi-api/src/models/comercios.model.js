/**
 * Model COMERCIOS (tabla `comercio`)
 * Mismo patrón que tu ejemplo productos: ? placeholders, devuelve datos.
 */
const pool = require('../db');
// ? = placeholder seguro (evita SQL Injection)

const COLUMNS = `id, nombre, tipo, direccion, coordenadas, telefono, horario, foto, calificacion`;

const getAll = async (tipo) => {
  if (tipo && tipo !== 'todos') {
    const [rows] = await pool.query(
      `SELECT ${COLUMNS} FROM comercio WHERE tipo = ? ORDER BY nombre`,
      [tipo]
    );
    return rows;
  }
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM comercio ORDER BY nombre`);
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(`SELECT ${COLUMNS}, verificado FROM comercio WHERE id = ?`, [id]);
  return rows[0]; // undefined si no existe
};

const getResenasByComercio = async (comercio_id) => {
  const [rows] = await pool.query(
    `SELECT r.id, r.calificacion, r.comentario, r.fecha, u.nombre as usuario
     FROM resena r JOIN usuario u ON r.id_usuario = u.id
     WHERE r.id_comercio = ? ORDER BY r.fecha DESC`,
    [comercio_id]
  );
  return rows;
};

const getPromedio = async (comercio_id) => {
  const [rows] = await pool.query(
    'SELECT AVG(calificacion) as promedio FROM resena WHERE id_comercio = ?',
    [comercio_id]
  );
  return rows[0].promedio || 0;
};

const create = async ({ nombre, tipo, direccion, coordenadas, telefono, horario }) => {
  const [result] = await pool.query(
    `INSERT INTO comercio (nombre, tipo, direccion, coordenadas, telefono, horario)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, tipo, direccion, coordenadas, telefono, horario]
  );
  return { id: result.insertId, nombre, tipo };
};

const update = async (id, { nombre, tipo, direccion, coordenadas, telefono, horario }) => {
  const [result] = await pool.query(
    `UPDATE comercio SET nombre=?, tipo=?, direccion=?, coordenadas=?, telefono=?, horario=?
     WHERE id=?`,
    [nombre, tipo, direccion, coordenadas, telefono, horario, id]
  );
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM comercio WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getAll, getById, getResenasByComercio, getPromedio, create, update, remove };
