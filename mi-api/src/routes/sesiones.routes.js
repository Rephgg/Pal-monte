const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sesiones.controller');

// SESIONES / AUTENTICACIÓN
router.post('/sesiones', ctrl.create);                                  // POST   /api/sesiones
router.get('/sesiones', ctrl.getByUsuario);                             // GET    /api/sesiones?usuario_id=
router.get('/sesiones/validar', ctrl.validar);                          // GET    /api/sesiones/validar?token=
router.delete('/sesiones/cerrar', ctrl.cerrar);                         // DELETE /api/sesiones/cerrar?token=

module.exports = router;