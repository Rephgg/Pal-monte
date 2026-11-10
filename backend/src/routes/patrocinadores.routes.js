const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/patrocinadores.controller');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// PATROCINADORES (catálogo público; CRUD solo admin)
router.get('/patrocinadores', ctrl.getAll);                              // GET    /api/patrocinadores
router.post('/admin/patrocinadores', ...soloAdmin, ctrl.create);                       // POST   /api/admin/patrocinadores
router.put('/admin/patrocinadores/:patrocinador_id', ...soloAdmin, ctrl.update);       // PUT    /api/admin/patrocinadores/:id
router.delete('/admin/patrocinadores/:patrocinador_id', ...soloAdmin, ctrl.remove);    // DELETE /api/admin/patrocinadores/:id

// PATROCINADORES POR EVENTO (consultar público; modificar requiere token)
router.get('/eventos/:evento_id/patrocinadores', ctrl.getByEvento);      // GET    /api/eventos/:id/patrocinadores
router.post('/eventos/:evento_id/patrocinadores', verificarToken, ctrl.vincular);        // POST   /api/eventos/:id/patrocinadores
router.delete('/eventos/:evento_id/patrocinadores', verificarToken, ctrl.desvincular);   // DELETE /api/eventos/:id/patrocinadores?patrocinador_id=

module.exports = router;