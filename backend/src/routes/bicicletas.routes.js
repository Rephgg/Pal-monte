const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bicicletas.controller');
const { verificarToken } = require('../middlewares/authMiddleware');

// BICICLETAS (requiere token: son datos del usuario logueado)
router.get('/bicicletas', verificarToken, ctrl.getByUsuario);                    // GET    /api/bicicletas?usuario_id=
router.get('/bicicletas/:bicicleta_id', verificarToken, ctrl.getById);           // GET    /api/bicicletas/:id
router.post('/bicicletas', verificarToken, ctrl.create);                         // POST   /api/bicicletas
router.put('/bicicletas/:bicicleta_id', verificarToken, ctrl.update);            // PUT    /api/bicicletas/:id
router.delete('/bicicletas/:bicicleta_id', verificarToken, ctrl.remove);         // DELETE /api/bicicletas/:id

module.exports = router;