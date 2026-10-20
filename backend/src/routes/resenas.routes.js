const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/resenas.controller');
const { verificarToken } = require('../middlewares/authMiddleware');

// RESEÑAS (requiere token: reseñar es accion de usuario autenticado)
router.post('/resenas', verificarToken, ctrl.create);              // POST   /api/resenas
router.put('/resenas/:resena_id', verificarToken, ctrl.update);    // PUT    /api/resenas/:id
router.delete('/resenas/:resena_id', verificarToken, ctrl.remove); // DELETE /api/resenas/:id

module.exports = router;
