const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sesiones.controller');
const { verificarToken } = require('../middlewares/authMiddleware');

// SESIONES / AUTENTICACIÓN
// crear/validar: flujo de login (sin token aún). getByUsuario y cerrar requieren token.
router.post('/sesiones', ctrl.create);                                  // POST   /api/sesiones (tras login)
router.get('/sesiones', verificarToken, ctrl.getByUsuario);                             // GET    /api/sesiones?usuario_id=
router.get('/sesiones/validar', ctrl.validar);                          // GET    /api/sesiones/validar?token=
router.delete('/sesiones/cerrar', verificarToken, ctrl.cerrar);                         // DELETE /api/sesiones/cerrar?token=

module.exports = router;