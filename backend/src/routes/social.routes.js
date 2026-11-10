const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/social.controller');
const { verificarToken } = require('../middlewares/authMiddleware');

// SEGUIDORES (modificar requiere token; consultar público)
router.post('/seguidores', verificarToken, ctrl.seguir);                            // POST   /api/seguidores
router.delete('/seguidores', verificarToken, ctrl.dejarDeSeguir);                   // DELETE /api/seguidores?seguidor_id=&seguido_id=
router.get('/seguidores', ctrl.getSeguidores);                      // GET    /api/seguidores?usuario_id=&tipo=

// PUBLICACIONES (feed público; publicar/eliminar requiere token)
router.get('/publicaciones', ctrl.getPublicaciones);                // GET    /api/publicaciones  (?usuario_id=)
router.get('/publicaciones/:publicacion_id', ctrl.getPublicacionById); // GET  /api/publicaciones/:id
router.post('/publicaciones', verificarToken, ctrl.createPublicacion);              // POST   /api/publicaciones
router.delete('/publicaciones/:publicacion_id', verificarToken, ctrl.removePublicacion); // DELETE /api/publicaciones/:id

// COMENTARIOS (leer público; escribir requiere token)
router.get('/publicaciones/:publicacion_id/comentarios', ctrl.getComentarios); // GET /api/publicaciones/:id/comentarios
router.post('/comentarios', verificarToken, ctrl.addComentario);                    // POST   /api/comentarios
router.delete('/comentarios/:comentario_id', verificarToken, ctrl.removeComentario); // DELETE /api/comentarios/:id

// ME GUSTA (requiere token)
router.post('/publicaciones/:publicacion_id/me-gusta', verificarToken, ctrl.darMeGusta); // POST /api/publicaciones/:id/me-gusta
router.delete('/publicaciones/:publicacion_id/me-gusta', verificarToken, ctrl.quitarMeGusta); // DELETE /api/publicaciones/:id/me-gusta?usuario_id=
router.get('/publicaciones/:publicacion_id/me-gusta', ctrl.getMeGusta); // GET /api/publicaciones/:id/me-gusta

module.exports = router;