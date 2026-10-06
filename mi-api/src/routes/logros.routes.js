const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/logros.controller');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// LOGROS (catálogo público; CRUD solo admin)
router.get('/logros', ctrl.getAll);                              // GET    /api/logros
router.post('/admin/logros', ...soloAdmin, ctrl.create);                       // POST   /api/admin/logros
router.put('/admin/logros/:logro_id', ...soloAdmin, ctrl.update);              // PUT    /api/admin/logros/:id
router.delete('/admin/logros/:logro_id', ...soloAdmin, ctrl.remove);           // DELETE /api/admin/logros/:id

// LOGROS DEL USUARIO (requiere token: son datos personales)
router.get('/logros-usuario', verificarToken, ctrl.getLogrosByUsuario);          // GET    /api/logros-usuario?usuario_id=
router.post('/logros-usuario', verificarToken, ctrl.desbloquear);                // POST   /api/logros-usuario

module.exports = router;