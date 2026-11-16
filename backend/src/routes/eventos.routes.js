const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/eventos.controller');
const { verificarToken, verificarRol, soloAdmin } = require('../middlewares/authMiddleware');

router.get('/eventos', ctrl.getAll);                       
router.get('/eventos/:evento_id', ctrl.getById);           

router.post('/eventos', verificarToken, verificarRol('organizador', 'administrador'), ctrl.create); 
router.post('/eventos/:evento_id/inscribir', verificarToken, ctrl.inscribir);  
router.delete('/eventos/:evento_id/cancelar-inscripcion', verificarToken, ctrl.cancelarInscripcion); 
router.put('/eventos/:evento_id/cancelar', verificarToken, verificarRol('organizador', 'administrador'), ctrl.cancelarEvento); 
router.put('/eventos/:evento_id/confirmar', verificarToken, ctrl.confirmar);     
router.put('/eventos/:evento_id/asistio', verificarToken, ctrl.asistio);          

router.get('/admin/eventos', ...soloAdmin, ctrl.getAllAdmin);            
router.put('/admin/eventos/:evento_id', ...soloAdmin, ctrl.update);      
router.delete('/admin/eventos/:evento_id', ...soloAdmin, ctrl.remove);   

module.exports = router;
