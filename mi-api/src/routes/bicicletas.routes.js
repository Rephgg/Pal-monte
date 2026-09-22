const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bicicletas.controller');

// BICICLETAS
router.get('/bicicletas', ctrl.getByUsuario);                    // GET    /api/bicicletas?usuario_id=
router.get('/bicicletas/:bicicleta_id', ctrl.getById);           // GET    /api/bicicletas/:id
router.post('/bicicletas', ctrl.create);                         // POST   /api/bicicletas
router.put('/bicicletas/:bicicleta_id', ctrl.update);            // PUT    /api/bicicletas/:id
router.delete('/bicicletas/:bicicleta_id', ctrl.remove);         // DELETE /api/bicicletas/:id

module.exports = router;