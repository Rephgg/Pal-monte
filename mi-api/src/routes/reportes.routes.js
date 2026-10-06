const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportes.controller');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// REPORTES (moderación)
// GET público (lista, ya filtra por estado); crear reporte con token; gestionar moderación solo admin
router.get('/reportes', ctrl.getAll);                        // GET    /api/reportes?estado=
router.post('/reportes', verificarToken, ctrl.create);                       // POST   /api/reportes
router.put('/reportes/:reporte_id/estado', ...soloAdmin, ctrl.cambiarEstado); // PUT /api/reportes/:id/estado
router.delete('/reportes/:reporte_id', ...soloAdmin, ctrl.remove);         // DELETE /api/reportes/:id

module.exports = router;