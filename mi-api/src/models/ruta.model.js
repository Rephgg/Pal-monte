/**
 * Model RUTA (tabla `ruta`)
 * Mismo patrón que tu ejemplo productos: ? placeholders, devuelve datos.
 */
const pool = require('../db');
// ? = placeholder seguro (evita SQL Injection)

const COLUMNS = `id, nombre, descripcion, distancia_km, dificultad, tipo_bici,
                 tiempo_estimado, coordenadas, zona, elevacion, superficie, imagen`;

const getAll = async (dificultad) => {
  if (dificultad && dificultad !== 'todas') {
    const [rows] = await pool.query(
      `SELECT ${COLUMNS} FROM ruta WHERE dificultad = ? ORDER BY distancia_km`,
      [dificultad]
    );
    return rows;
  }
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM ruta ORDER BY distancia_km`
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM ruta WHERE id = ?`,
    [id]
  );
  return rows[0]; // undefined si no existe
};

const getResenasByRuta = async (ruta_id) => {
  const [rows] = await pool.query(
    `SELECT r.id, r.calificacion, r.comentario, r.fecha, u.nombre as usuario
     FROM resena r JOIN usuario u ON r.id_usuario = u.id
     WHERE r.id_ruta = ? ORDER BY r.fecha DESC`,
    [ruta_id]
  );
  return rows;
};

const getPromedio = async (ruta_id) => {
  const [rows] = await pool.query(
    'SELECT AVG(calificacion) as promedio FROM resena WHERE id_ruta = ?',
    [ruta_id]
  );
  return rows[0].promedio || 0;
};

const create = async ({ nombre, descripcion, distancia_km, dificultad, tipo_bici, tiempo_estimado, coordenadas, zona, elevacion, superficie = 'mixta' }) => {
  const [result] = await pool.query(
    `INSERT INTO ruta (nombre, descripcion, distancia_km, dificultad, tipo_bici, tiempo_estimado, coordenadas, zona, elevacion, superficie)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, descripcion, distancia_km, dificultad, tipo_bici, tiempo_estimado, coordenadas, zona, elevacion, superficie]
  );
  return { id: result.insertId, nombre, descripcion, distancia_km, dificultad };
};

const update = async (id, { nombre, descripcion, distancia_km, dificultad, tipo_bici, tiempo_estimado, coordenadas, zona, elevacion, superficie = 'mixta' }) => {
  const [result] = await pool.query(
    `UPDATE ruta SET nombre=?, descripcion=?, distancia_km=?, dificultad=?, tipo_bici=?,
            tiempo_estimado=?, coordenadas=?, zona=?, elevacion=?, superficie=?
     WHERE id=?`,
    [nombre, descripcion, distancia_km, dificultad, tipo_bici, tiempo_estimado, coordenadas, zona, elevacion, superficie, id]
  );
  return result.affectedRows; // 0 si no existe
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM ruta WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getAll, getById, getResenasByRuta, getPromedio, create, update, remove };
