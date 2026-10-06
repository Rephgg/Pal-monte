const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { nombre, email, password, telefono, nivel } = req.body || {};

    if (!nombre || !email || !password) {
      return res.status(400).json({ ok: false, error: 'nombre, email y password son obligatorios' });
    }

    // 1. Verificar si el email ya existe
    const [rows] = await pool.query('SELECT id FROM usuario WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(409).json({ ok: false, error: 'Email ya registrado' });
    }

    // 2. Hashear contraseña
    const hash = await bcrypt.hash(password, 10);

    // 3. Crear usuario
    const [result] = await pool.query(
      'INSERT INTO usuario (nombre, email, password, telefono) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, telefono || null]
    );
    const userId = result.insertId;

    // 4. Crear perfil por defecto
    await pool.query(
      'INSERT INTO perfil (id_usuario, nivel_ciclista, rol) VALUES (?, ?, ?)',
      [userId, nivel || 'principiante', 'ciclista']
    );

    // 5. Generar token
    const token = jwt.sign(
      { id: userId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(201).json({
      ok: true,
      message: 'Usuario registrado exitosamente',
      token,
      usuario: { id: userId, nombre, email },
    });
  } catch (err) {
    console.error('Error register:', err);
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ ok: false, error: 'email y password son obligatorios' });
    }

    // 1. Buscar usuario activo + perfil
    const [rows] = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.password, u.activo, p.nivel_ciclista AS nivel, p.rol
       FROM usuario u
       JOIN perfil p ON u.id = p.id_usuario
       WHERE u.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });
    }

    const usuario = rows[0];

    if (usuario.activo === 0) {
      return res.status(401).json({ ok: false, error: 'Usuario desactivado' });
    }

    // 2. Comparar contraseña
    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) {
      return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });
    }

    // 3. Generar token
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    delete usuario.password;

    return res.json({
      ok: true,
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        nivel: usuario.nivel,
        rol: usuario.rol,
      },
    });
  } catch (err) {
    console.error('Error login:', err);
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' });
  }
};

module.exports = { register, login };
