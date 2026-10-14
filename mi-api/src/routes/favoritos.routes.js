const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/favoritos.controller');
const { verificarToken } = require('../middlewares/authMiddleware');

// FAVORITOS (requiere token: los favoritos son de un usuario autenticado)
router.get('/favoritos', verificarToken, ctrl.getByUsuario);            // GET    /api/favoritos?usuario_id=
router.post('/favoritos', verificarToken, ctrl.add);                    // POST   /api/favoritos?usuario_id=&ruta_id=
router.delete('/favoritos', verificarToken, ctrl.remove);               // DELETE /api/favoritos?usuario_id=&ruta_id=

module.exports = router;
