const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/eventos.controller');
const { verificarToken, verificarRol, soloAdmin } = require('../middlewares/authMiddleware');

// EVENTOS (público)
router.get('/eventos', ctrl.getAll);                       // GET    /api/eventos
router.get('/eventos/:evento_id', ctrl.getById);           // GET    /api/eventos/:id

// EVENTOS (requiere token: inscribed e interaccion son de un usuario autenticado)
router.post('/eventos', verificarToken, verificarRol('organizador', 'administrador'), ctrl.create); // POST /api/eventos?organizador_id=
router.post('/eventos/:evento_id/inscribir', verificarToken, ctrl.inscribir);  // POST /api/eventos/:id/inscribir
router.delete('/eventos/:evento_id/cancelar-inscripcion', verificarToken, ctrl.cancelarInscripcion); // DELETE /api/eventos/:id/cancelar-inscripcion
router.put('/eventos/:evento_id/cancelar', verificarToken, verificarRol('organizador', 'administrador'), ctrl.cancelarEvento); // PUT /api/eventos/:id/cancelar
router.put('/eventos/:evento_id/confirmar', verificarToken, ctrl.confirmar);     // PUT /api/eventos/:id/confirmar
router.put('/eventos/:evento_id/asistio', verificarToken, ctrl.asistio);          // PUT /api/eventos/:id/asistio

// ADMIN - EVENTOS (token + rol administrador)
router.get('/admin/eventos', ...soloAdmin, ctrl.getAllAdmin);            // GET    /api/admin/eventos
router.put('/admin/eventos/:evento_id', ...soloAdmin, ctrl.update);      // PUT    /api/admin/eventos/:id
router.delete('/admin/eventos/:evento_id', ...soloAdmin, ctrl.remove);   // DELETE /api/admin/eventos/:id

module.exports = router;
