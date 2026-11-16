const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/social.controller');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/seguidores', verificarToken, ctrl.seguir);                            
router.delete('/seguidores', verificarToken, ctrl.dejarDeSeguir);                   
router.get('/seguidores', ctrl.getSeguidores);                      

router.get('/publicaciones', ctrl.getPublicaciones);                
router.get('/publicaciones/:publicacion_id', ctrl.getPublicacionById); 
router.post('/publicaciones', verificarToken, ctrl.createPublicacion);              
router.delete('/publicaciones/:publicacion_id', verificarToken, ctrl.removePublicacion); 

router.get('/publicaciones/:publicacion_id/comentarios', ctrl.getComentarios); 
router.post('/comentarios', verificarToken, ctrl.addComentario);                    
router.delete('/comentarios/:comentario_id', verificarToken, ctrl.removeComentario); 

router.post('/publicaciones/:publicacion_id/me-gusta', verificarToken, ctrl.darMeGusta); 
router.delete('/publicaciones/:publicacion_id/me-gusta', verificarToken, ctrl.quitarMeGusta); 
router.get('/publicaciones/:publicacion_id/me-gusta', ctrl.getMeGusta); 

module.exports = router;