/**
 * ==============================================
 * MIEMBRO 1 — USUARIOS, PERFIL Y AUTENTICACIÓN
 * Endpoints:
 *  - POST   /api/registro
 *  - POST   /api/login
 *  - GET    /api/perfil/:usuario_id
 *  - PUT    /api/perfil/:usuario_id
 *  - PUT    /api/perfil/:usuario_id/password
 *  - GET    /api/admin/usuarios
 *  - PUT    /api/admin/usuarios/:usuario_id/rol
 *  - PUT    /api/admin/usuarios/:usuario_id
 *  - DELETE /api/admin/usuarios/:usuario_id
 * ==============================================
 */
const bcrypt = require('bcryptjs');
const pool = require('../db');

// POST /api/registro
const registro = async (req, res) => {
  try {
    const { nombre, email, password, telefono = null, nivel = 'principiante' } = req.body || {};

    if (!nombre || !email || !password) {
      return res.status(400).json({ ok: false, msg: 'nombre, email y password son requeridos' });
    }

    const [existe] = await pool.query('SELECT id FROM usuario WHERE email = ?', [email]);
    if (existe.length > 0) {
      return res.status(400).json({ ok: false, msg: 'Email ya registrado' });
    }

    const hash = bcrypt.hashSync(password, 10);

    const [result] = await pool.query(
      'INSERT INTO usuario (nombre, email, password, telefono) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, telefono]
    );
    const user_id = result.insertId;

    await pool.query('INSERT INTO perfil (id_usuario, nivel_ciclista) VALUES (?, ?)', [user_id, nivel]);

    res.status(201).json({ ok: true, msg: 'Usuario registrado exitosamente', id: user_id });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ ok: false, msg: 'email y password son requeridos' });
    }

    const [rows] = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.password, p.nivel_ciclista as nivel, p.rol
       FROM usuario u JOIN perfil p ON u.id = p.id_usuario
       WHERE u.email = ? AND u.activo = 1`,
      [email]
    );

    if (rows.length === 0 || !bcrypt.compareSync(password, rows[0].password)) {
      return res.status(401).json({ ok: false, msg: 'Credenciales incorrectas' });
    }

    const u = rows[0];
    res.json({ ok: true, data: { id: u.id, nombre: u.nombre, email: u.email, nivel: u.nivel, rol: u.rol } });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// GET /api/perfil/:usuario_id
const getPerfil = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const [perfil] = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.telefono, u.fecha_registro,
              p.foto, p.km_recorridos, p.nivel_ciclista, p.rol
       FROM usuario u JOIN perfil p ON u.id = p.id_usuario
       WHERE u.id = ?`,
      [usuario_id]
    );

    if (perfil.length === 0) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    const [favoritos] = await pool.query(
      `SELECT r.id, r.nombre, r.distancia_km, r.dificultad
       FROM favorito f JOIN ruta r ON f.id_ruta = r.id
       WHERE f.id_usuario = ?`,
      [usuario_id]
    );

    const [historial] = await pool.query(
      `SELECT r.id, r.nombre, r.distancia_km, rr.fecha, rr.tiempo_real
       FROM ruta_realizada rr JOIN ruta r ON rr.id_ruta = r.id
       WHERE rr.id_usuario = ? ORDER BY rr.fecha DESC`,
      [usuario_id]
    );

    res.json({ ok: true, data: { ...perfil[0], favoritos, historial } });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// PUT /api/perfil/:usuario_id
const updatePerfil = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const { nombre, telefono = null, nivel = null, foto = null } = req.body || {};

    if (!nombre) {
      return res.status(400).json({ ok: false, msg: 'nombre es requerido' });
    }

    await pool.query('UPDATE usuario SET nombre = ?, telefono = ? WHERE id = ?', [nombre, telefono, usuario_id]);

    if (nivel) {
      await pool.query('UPDATE perfil SET nivel_ciclista = ? WHERE id_usuario = ?', [nivel, usuario_id]);
    }
    if (foto) {
      await pool.query('UPDATE perfil SET foto = ? WHERE id_usuario = ?', [foto, usuario_id]);
    }

    res.json({ ok: true, msg: 'Perfil actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// PUT /api/perfil/:usuario_id/password
const updatePassword = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const { password_actual, password_nueva } = req.body || {};

    if (!password_actual || !password_nueva) {
      return res.status(400).json({ ok: false, msg: 'password_actual y password_nueva son requeridos' });
    }

    const [rows] = await pool.query('SELECT password FROM usuario WHERE id = ?', [usuario_id]);
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    if (!bcrypt.compareSync(password_actual, rows[0].password)) {
      return res.status(401).json({ ok: false, msg: 'Contraseña actual incorrecta' });
    }

    const hash = bcrypt.hashSync(password_nueva, 10);
    await pool.query('UPDATE usuario SET password = ? WHERE id = ?', [hash, usuario_id]);

    res.json({ ok: true, msg: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// GET /api/admin/usuarios
const getAllUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.telefono, u.fecha_registro, u.activo,
              p.nivel_ciclista, p.rol
       FROM usuario u JOIN perfil p ON u.id = p.id_usuario`
    );
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// PUT /api/admin/usuarios/:usuario_id/rol
const updateRol = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const { rol } = req.body || {};

    if (!rol) {
      return res.status(400).json({ ok: false, msg: 'rol es requerido' });
    }

    await pool.query('UPDATE perfil SET rol = ? WHERE id_usuario = ?', [rol, usuario_id]);
    res.json({ ok: true, msg: 'Rol actualizado' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// PUT /api/admin/usuarios/:usuario_id
const updateUsuarioAdmin = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const { nombre, email, telefono, nivel, rol, activo } = req.body || {};

    const [rows] = await pool.query('SELECT id FROM usuario WHERE id = ?', [usuario_id]);
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    if (nombre !== undefined) {
      await pool.query('UPDATE usuario SET nombre = ? WHERE id = ?', [nombre, usuario_id]);
    }
    if (email !== undefined) {
      const [duplicado] = await pool.query('SELECT id FROM usuario WHERE email = ? AND id != ?', [email, usuario_id]);
      if (duplicado.length > 0) {
        return res.status(400).json({ ok: false, msg: 'Email ya registrado' });
      }
      await pool.query('UPDATE usuario SET email = ? WHERE id = ?', [email, usuario_id]);
    }
    if (telefono !== undefined) {
      await pool.query('UPDATE usuario SET telefono = ? WHERE id = ?', [telefono, usuario_id]);
    }
    if (nivel !== undefined) {
      await pool.query('UPDATE perfil SET nivel_ciclista = ? WHERE id_usuario = ?', [nivel, usuario_id]);
    }
    if (rol !== undefined) {
      await pool.query('UPDATE perfil SET rol = ? WHERE id_usuario = ?', [rol, usuario_id]);
    }
    if (activo !== undefined) {
      await pool.query('UPDATE usuario SET activo = ? WHERE id = ?', [activo, usuario_id]);
    }

    res.json({ ok: true, msg: 'Usuario actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/admin/usuarios/:usuario_id  (desactiva)
const deleteUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    await pool.query('UPDATE usuario SET activo = 0 WHERE id = ?', [usuario_id]);
    res.json({ ok: true, msg: 'Usuario desactivado' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = { registro, login, getPerfil, updatePerfil, updatePassword, getAllUsuarios, updateRol, updateUsuarioAdmin, deleteUsuario };
