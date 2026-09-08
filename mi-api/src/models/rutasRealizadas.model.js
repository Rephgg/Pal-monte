/**
 * Model RUTAS REALIZADAS (tabla `ruta_realizada`, PK id_usuario + id_ruta + fecha)
 * Mismo patrón que tu ejemplo productos: ? placeholders, devuelve datos.
 */
const pool = require('../db');
// ? = placeholder seguro (evita SQL Injection)

const getByUsuario = async (usuario_id) => {
  const [rows] = await pool.query(
    `SELECT r.id, r.nombre, r.distancia_km, r.dificultad, r.zona,
            rr.fecha, rr.tiempo_real, rr.observaciones
     FROM ruta_realizada rr JOIN ruta r ON rr.id_ruta = r.id
     WHERE rr.id_usuario = ? ORDER BY rr.fecha DESC`,
    [usuario_id]
  );
  return rows;
};

const findHoy = async (usuario_id, ruta_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM ruta_realizada WHERE id_usuario = ? AND id_ruta = ? AND fecha = CURDATE()',
    [usuario_id, ruta_id]
  );
  return rows[0];
};

const create = async ({ usuario_id, ruta_id, tiempo_real, observaciones = null }) => {
  await pool.query(
    'INSERT INTO ruta_realizada (id_usuario, id_ruta, fecha, tiempo_real, observaciones) VALUES (?, ?, CURDATE(), ?, ?)',
    [usuario_id, ruta_id, tiempo_real, observaciones]
  );
  return { usuario_id, ruta_id, tiempo_real };
};

const getDistanciaRuta = async (ruta_id) => {
  const [rows] = await pool.query('SELECT distancia_km FROM ruta WHERE id = ?', [ruta_id]);
  return rows.length > 0 ? rows[0].distancia_km : 0;
};

const sumarKm = async (usuario_id, km) => {
  await pool.query('UPDATE perfil SET km_recorridos = km_recorridos + ? WHERE id_usuario = ?', [km, usuario_id]);
  return km;
};

module.exports = { getByUsuario, findHoy, create, getDistanciaRuta, sumarKm };
