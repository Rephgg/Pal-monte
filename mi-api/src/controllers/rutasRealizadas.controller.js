/**
 * ==============================================
 * MIEMBRO 3 — PARTE 3: RUTAS REALIZADAS (Historial)
 * Endpoints:
 *  - GET    /api/rutas-realizadas?usuario_id=
 *  - POST   /api/rutas-realizadas?usuario_id=&ruta_id=&tiempo_real=&observaciones=
 * ==============================================
 */
const pool = require('../db');

// GET /api/rutas-realizadas?usuario_id=
const getByUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.query;

    if (!usuario_id) return res.status(400).json({ ok: false, msg: 'usuario_id es requerido' });

    const [rows] = await pool.query(
      `SELECT r.id, r.nombre, r.distancia_km, r.dificultad, r.zona,
              rr.fecha, rr.tiempo_real, rr.observaciones
       FROM ruta_realizada rr JOIN ruta r ON rr.id_ruta = r.id
       WHERE rr.id_usuario = ? ORDER BY rr.fecha DESC`,
      [usuario_id]
    );

    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/rutas-realizadas?usuario_id=&ruta_id=&tiempo_real=&observaciones=
const create = async (req, res) => {
  try {
    const { usuario_id, ruta_id, tiempo_real, observaciones = null } = req.query;

    if (!usuario_id || !ruta_id || tiempo_real === undefined) {
      return res.status(400).json({ ok: false, msg: 'usuario_id, ruta_id y tiempo_real son requeridos' });
    }

    const [yaHoy] = await pool.query(
      'SELECT * FROM ruta_realizada WHERE id_usuario = ? AND id_ruta = ? AND fecha = CURDATE()',
      [usuario_id, ruta_id]
    );
    if (yaHoy.length > 0) return res.status(400).json({ ok: false, msg: 'Ya registraste esta ruta hoy' });

    await pool.query(
      'INSERT INTO ruta_realizada (id_usuario, id_ruta, fecha, tiempo_real, observaciones) VALUES (?, ?, CURDATE(), ?, ?)',
      [usuario_id, ruta_id, tiempo_real, observaciones]
    );

    const [rutas] = await pool.query('SELECT distancia_km FROM ruta WHERE id = ?', [ruta_id]);
    const distancia_km = rutas.length > 0 ? rutas[0].distancia_km : 0;

    await pool.query('UPDATE perfil SET km_recorridos = km_recorridos + ? WHERE id_usuario = ?', [distancia_km, usuario_id]);

    res.status(201).json({ ok: true, msg: 'Ruta registrada como completada', km_agregados: distancia_km });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { getByUsuario, create };
