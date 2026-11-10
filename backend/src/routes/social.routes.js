const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/social.controller');

// SEGUIDORES
router.post('/seguidores', ctrl.seguir);                            // POST   /api/seguidores
router.delete('/seguidores', ctrl.dejarDeSeguir);                   // DELETE /api/seguidores?seguidor_id=&seguido_id=
router.get('/seguidores', ctrl.getSeguidores);                      // GET    /api/seguidores?usuario_id=&tipo=

// PUBLICACIONES
router.get('/publicaciones', ctrl.getPublicaciones);                // GET    /api/publicaciones  (?usuario_id=)
router.get('/publicaciones/:publicacion_id', ctrl.getPublicacionById); // GET  /api/publicaciones/:id
router.post('/publicaciones', ctrl.createPublicacion);              // POST   /api/publicaciones
router.delete('/publicaciones/:publicacion_id', ctrl.removePublicacion); // DELETE /api/publicaciones/:id

// COMENTARIOS
router.get('/publicaciones/:publicacion_id/comentarios', ctrl.getComentarios); // GET /api/publicaciones/:id/comentarios
router.post('/comentarios', ctrl.addComentario);                    // POST   /api/comentarios
router.delete('/comentarios/:comentario_id', ctrl.removeComentario); // DELETE /api/comentarios/:id

// ME GUSTA
router.post('/publicaciones/:publicacion_id/me-gusta', ctrl.darMeGusta); // POST /api/publicaciones/:id/me-gusta
router.delete('/publicaciones/:publicacion_id/me-gusta', ctrl.quitarMeGusta); // DELETE /api/publicaciones/:id/me-gusta?usuario_id=
router.get('/publicaciones/:publicacion_id/me-gusta', ctrl.getMeGusta); // GET /api/publicaciones/:id/me-gusta

module.exports = router;