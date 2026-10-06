const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/logros.controller');

// LOGROS
router.get('/logros', ctrl.getAll);                              // GET    /api/logros
router.post('/admin/logros', ctrl.create);                       // POST   /api/admin/logros
router.put('/admin/logros/:logro_id', ctrl.update);              // PUT    /api/admin/logros/:id
router.delete('/admin/logros/:logro_id', ctrl.remove);           // DELETE /api/admin/logros/:id

// LOGROS DEL USUARIO
router.get('/logros-usuario', ctrl.getLogrosByUsuario);          // GET    /api/logros-usuario?usuario_id=
router.post('/logros-usuario', ctrl.desbloquear);                // POST   /api/logros-usuario

module.exports = router;