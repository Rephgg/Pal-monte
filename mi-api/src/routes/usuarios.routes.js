const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const ctrl = require('../controllers/usuarios.controller');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// Limite estricto para autenticacion: frena fuerza bruta
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '10', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, msg: 'Demasiados intentos, espera unos minutos' },
});

// AUTENTICACIÓN (públicas, con límite de intentos)
router.post('/registro', authLimiter, ctrl.registro);   // POST   /api/registro
router.post('/login', authLimiter, ctrl.login);         // POST   /api/login

// PERFIL (requiere token)
router.get('/perfil/:usuario_id', verificarToken, ctrl.getPerfil);        // GET    /api/perfil/:id
router.put('/perfil/:usuario_id', verificarToken, ctrl.updatePerfil);     // PUT    /api/perfil/:id
router.put('/perfil/:usuario_id/password', verificarToken, ctrl.updatePassword); // PUT /api/perfil/:id/password

// ADMIN - USUARIOS (requiere token + rol administrador)
router.get('/admin/usuarios', ...soloAdmin, ctrl.getAllUsuarios);       // GET    /api/admin/usuarios
router.put('/admin/usuarios/:usuario_id/rol', ...soloAdmin, ctrl.updateRol);  // PUT  /api/admin/usuarios/:id/rol
router.put('/admin/usuarios/:usuario_id', ...soloAdmin, ctrl.updateUsuarioAdmin); // PUT /api/admin/usuarios/:id
router.delete('/admin/usuarios/:usuario_id', ...soloAdmin, ctrl.deleteUsuario);  // DELETE /api/admin/usuarios/:id

module.exports = router;
