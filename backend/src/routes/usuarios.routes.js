const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const ctrl = require('../controllers/usuarios.controller');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '10', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, msg: 'Demasiados intentos, espera unos minutos' },
});

router.post('/registro', authLimiter, ctrl.registro);   
router.post('/login', authLimiter, ctrl.login);         

router.get('/perfil/:usuario_id', verificarToken, ctrl.getPerfil);        
router.put('/perfil/:usuario_id', verificarToken, ctrl.updatePerfil);     
router.put('/perfil/:usuario_id/password', verificarToken, ctrl.updatePassword); 

router.get('/admin/usuarios', ...soloAdmin, ctrl.getAllUsuarios);       
router.put('/admin/usuarios/:usuario_id/rol', ...soloAdmin, ctrl.updateRol);  
router.put('/admin/usuarios/:usuario_id', ...soloAdmin, ctrl.updateUsuarioAdmin); 
router.delete('/admin/usuarios/:usuario_id', ...soloAdmin, ctrl.deleteUsuario);  

module.exports = router;
