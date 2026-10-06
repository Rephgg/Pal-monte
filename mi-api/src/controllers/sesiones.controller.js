/**
 * ==============================================
 * SESIONES — AUTENTICACIÓN
 * Endpoints:
 *  - POST   /api/sesiones
 *  - GET    /api/sesiones?usuario_id=
 *  - GET    /api/sesiones/validar?token=
 *  - DELETE /api/sesiones/cerrar?token=
 * ==============================================
 */
const crypto = require('crypto');
const sesiones = require('../models/sesiones.model');

const HORAS_EXPIRACION = 8;

// POST /api/sesiones
const create = async (req, res) => {
  try {
    const { id_usuario } = req.body || {};
    if (!id_usuario) return res.status(400).json({ ok: false, msg: 'id_usuario es requerido' });

    const token = crypto.randomBytes(32).toString('hex');
    const expira = new Date(Date.now() + HORAS_EXPIRACION * 3600 * 1000);

    const sesion = await sesiones.create({ id_usuario, token, expira });
    res.status(201).json({ ok: true, msg: 'Sesión creada', data: sesion });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// GET /api/sesiones?usuario_id=
const getByUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.query;
    if (!usuario_id) return res.status(400).json({ ok: false, msg: 'usuario_id es requerido' });

    const rows = await sesiones.findByUsuario(usuario_id);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// GET /api/sesiones/validar?token=
const validar = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ ok: false, msg: 'token es requerido' });

    const sesion = await sesiones.findByToken(token);
    if (!sesion || sesion.activo !== 1) {
      return res.status(401).json({ ok: false, msg: 'Token inválido o sesión cerrada' });
    }
    if (new Date(sesion.expira) < new Date()) {
      return res.status(401).json({ ok: false, msg: 'Sesión expirada' });
    }

    res.json({ ok: true, data: { id_usuario: sesion.id_usuario, nombre: sesion.nombre, email: sesion.email } });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/sesiones/cerrar?token=
const cerrar = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ ok: false, msg: 'token es requerido' });

    const affected = await sesiones.revoke(token);
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Sesión no encontrada' });

    res.json({ ok: true, msg: 'Sesión cerrada correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { create, getByUsuario, validar, cerrar };