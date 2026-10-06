const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportes.controller');

// REPORTES (moderación)
router.get('/reportes', ctrl.getAll);                        // GET    /api/reportes?estado=
router.post('/reportes', ctrl.create);                       // POST   /api/reportes
router.put('/reportes/:reporte_id/estado', ctrl.cambiarEstado); // PUT /api/reportes/:id/estado
router.delete('/reportes/:reporte_id', ctrl.remove);         // DELETE /api/reportes/:id

module.exports = router;