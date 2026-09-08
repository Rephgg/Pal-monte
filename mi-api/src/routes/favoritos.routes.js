const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/favoritos.controller');

// FAVORITOS
router.get('/favoritos', ctrl.getByUsuario);            // GET    /api/favoritos?usuario_id=
router.post('/favoritos', ctrl.add);                    // POST   /api/favoritos?usuario_id=&ruta_id=
router.delete('/favoritos', ctrl.remove);               // DELETE /api/favoritos?usuario_id=&ruta_id=

module.exports = router;
