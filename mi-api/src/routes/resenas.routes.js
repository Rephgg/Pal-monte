const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/resenas.controller');

// RESEÑAS
router.post('/resenas', ctrl.create);              // POST   /api/resenas
router.put('/resenas/:resena_id', ctrl.update);    // PUT    /api/resenas/:id
router.delete('/resenas/:resena_id', ctrl.remove); // DELETE /api/resenas/:id

module.exports = router;
