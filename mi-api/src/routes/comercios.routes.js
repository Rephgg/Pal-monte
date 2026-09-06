const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/comercios.controller');

// COMERCIOS (público)
router.get('/comercios', ctrl.getAll);                    // GET    /api/comercios?tipo=
router.get('/comercios/:comercio_id', ctrl.getById);      // GET    /api/comercios/:id

// ADMIN - COMERCIOS
router.post('/admin/comercios', ctrl.create);             // POST   /api/admin/comercios
router.put('/admin/comercios/:comercio_id', ctrl.update); // PUT    /api/admin/comercios/:id
router.delete('/admin/comercios/:comercio_id', ctrl.remove); // DELETE /api/admin/comercios/:id

module.exports = router;
