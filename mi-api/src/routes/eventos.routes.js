const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/eventos.controller');

// EVENTOS (público)
router.get('/eventos', ctrl.getAll);                       // GET    /api/eventos
router.get('/eventos/:evento_id', ctrl.getById);           // GET    /api/eventos/:id
router.post('/eventos', ctrl.create);                      // POST   /api/eventos?organizador_id=
router.post('/eventos/:evento_id/inscribir', ctrl.inscribir);  // POST /api/eventos/:id/inscribir
router.delete('/eventos/:evento_id/cancelar-inscripcion', ctrl.cancelarInscripcion); // DELETE /api/eventos/:id/cancelar-inscripcion
router.put('/eventos/:evento_id/cancelar', ctrl.cancelarEvento); // PUT /api/eventos/:id/cancelar
router.put('/eventos/:evento_id/confirmar', ctrl.confirmar);     // PUT /api/eventos/:id/confirmar
router.put('/eventos/:evento_id/asistio', ctrl.asistio);          // PUT /api/eventos/:id/asistio

// ADMIN - EVENTOS
router.get('/admin/eventos', ctrl.getAllAdmin);            // GET    /api/admin/eventos
router.put('/admin/eventos/:evento_id', ctrl.update);      // PUT    /api/admin/eventos/:id
router.delete('/admin/eventos/:evento_id', ctrl.remove);   // DELETE /api/admin/eventos/:id

module.exports = router;
