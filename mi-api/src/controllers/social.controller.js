/**
 * ==============================================
 * SOCIAL — SEGUIDORES, PUBLICACIONES, COMENTARIOS Y ME GUSTA
 * Endpoints:
 *  - POST   /api/seguidores
 *  - DELETE /api/seguidores?seguidor_id=&seguido_id=
 *  - GET    /api/seguidores?usuario_id=&tipo=seguidos|seguidores
 *  - GET    /api/publicaciones
 *  - GET    /api/publicaciones/usuario?usuario_id=
 *  - GET    /api/publicaciones/:publicacion_id
 *  - POST   /api/publicaciones
 *  - DELETE /api/publicaciones/:publicacion_id
 *  - GET    /api/publicaciones/:publicacion_id/comentarios
 *  - POST   /api/comentarios
 *  - DELETE /api/comentarios/:comentario_id
 *  - POST   /api/publicaciones/:publicacion_id/me-gusta
 *  - DELETE /api/publicaciones/:publicacion_id/me-gusta?usuario_id=
 *  - GET    /api/publicaciones/:publicacion_id/me-gusta
 * ==============================================
 */
const social = require('../models/social.model');
const notificaciones = require('../models/notificaciones.model');

/* ---------------- SEGUIDORES ---------------- */

// POST /api/seguidores
const seguir = async (req, res) => {
  try {
    const { id_seguidor, id_seguido } = req.body || {};
    if (!id_seguidor || !id_seguido) {
      return res.status(400).json({ ok: false, msg: 'id_seguidor e id_seguido son requeridos' });
    }
    if (id_seguidor === id_seguido) {
      return res.status(400).json({ ok: false, msg: 'No puedes seguirte a ti mismo' });
    }

    await social.seguir(id_seguidor, id_seguido);
    await notificaciones.create({
      id_usuario: id_seguido,
      tipo: 'seguidor',
      texto: 'Un nuevo ciclista te sigue',
      id_referencia: id_seguidor,
    });
    res.status(201).json({ ok: true, msg: 'Ahora sigues a este usuario' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ ok: false, msg: 'Ya sigues a este usuario' });
    }
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/seguidores?seguidor_id=&seguido_id=
const dejarDeSeguir = async (req, res) => {
  try {
    const { seguidor_id, seguido_id } = req.query;
    if (!seguidor_id || !seguido_id) {
      return res.status(400).json({ ok: false, msg: 'seguidor_id y seguido_id son requeridos' });
    }

    const affected = await social.dejarDeSeguir(seguidor_id, seguido_id);
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'No sigues a este usuario' });

    res.json({ ok: true, msg: 'Dejaste de seguir al usuario' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// GET /api/seguidores?usuario_id=&tipo=
const getSeguidores = async (req, res) => {
  try {
    const { usuario_id, tipo = 'seguidos' } = req.query;
    if (!usuario_id) return res.status(400).json({ ok: false, msg: 'usuario_id es requerido' });

    const rows = tipo === 'seguidores'
      ? await social.seguidoresByUsuario(usuario_id)
      : await social.seguidosByUsuario(usuario_id);

    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

/* ---------------- PUBLICACIONES ---------------- */

// GET /api/publicaciones (feed) | GET /api/publicaciones/usuario?usuario_id=
const getPublicaciones = async (req, res) => {
  try {
    const { usuario_id } = req.query;
    const rows = usuario_id ? await social.publicacionesByUsuario(usuario_id) : await social.getAllPublicaciones();
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// GET /api/publicaciones/:publicacion_id
const getPublicacionById = async (req, res) => {
  try {
    const { publicacion_id } = req.params;
    const publicacion = await social.findPublicacion(publicacion_id);
    if (!publicacion) return res.status(404).json({ ok: false, msg: 'Publicación no encontrada' });

    const comentarios = await social.comentariosByPublicacion(publicacion_id);
    const me_gusta = await social.meGustaByPublicacion(publicacion_id);
    res.json({ ok: true, data: { ...publicacion, comentarios, me_gusta } });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/publicaciones
const createPublicacion = async (req, res) => {
  try {
    const { id_usuario, texto, imagen } = req.body || {};
    if (!id_usuario || !texto) {
      return res.status(400).json({ ok: false, msg: 'id_usuario y texto son requeridos' });
    }

    const result = await social.createPublicacion({ id_usuario, texto, imagen });
    res.status(201).json({ ok: true, msg: 'Publicación creada exitosamente', data: result });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/publicaciones/:publicacion_id
const removePublicacion = async (req, res) => {
  try {
    const { publicacion_id } = req.params;
    const affected = await social.removePublicacion(publicacion_id);
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Publicación no encontrada' });

    res.json({ ok: true, msg: 'Publicación eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

/* ---------------- COMENTARIOS ---------------- */

// GET /api/publicaciones/:publicacion_id/comentarios
const getComentarios = async (req, res) => {
  try {
    const { publicacion_id } = req.params;
    const rows = await social.comentariosByPublicacion(publicacion_id);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// POST /api/comentarios
const addComentario = async (req, res) => {
  try {
    const { id_publicacion, id_usuario, texto } = req.body || {};
    if (!id_publicacion || !id_usuario || !texto) {
      return res.status(400).json({ ok: false, msg: 'id_publicacion, id_usuario y texto son requeridos' });
    }

    const result = await social.addComentario({ id_publicacion, id_usuario, texto });

    const [dueño] = await require('../db').query('SELECT id_usuario FROM publicacion WHERE id = ?', [id_publicacion]);
    if (dueño.length > 0 && dueño[0].id_usuario !== id_usuario) {
      await notificaciones.create({
        id_usuario: dueño[0].id_usuario,
        tipo: 'comentario',
        texto: 'Nuevo comentario en tu publicación',
        id_referencia: id_publicacion,
      });
    }

    res.status(201).json({ ok: true, msg: 'Comentario agregado exitosamente', data: result });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/comentarios/:comentario_id
const removeComentario = async (req, res) => {
  try {
    const { comentario_id } = req.params;
    const affected = await social.removeComentario(comentario_id);
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Comentario no encontrado' });

    res.json({ ok: true, msg: 'Comentario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

/* ---------------- ME GUSTA ---------------- */

// POST /api/publicaciones/:publicacion_id/me-gusta
const darMeGusta = async (req, res) => {
  try {
    const { publicacion_id } = req.params;
    const { id_usuario } = req.body || {};
    if (!id_usuario) return res.status(400).json({ ok: false, msg: 'id_usuario es requerido' });

    await social.darMeGusta(publicacion_id, id_usuario);

    const [dueño] = await require('../db').query('SELECT id_usuario FROM publicacion WHERE id = ?', [publicacion_id]);
    if (dueño.length > 0 && dueño[0].id_usuario !== id_usuario) {
      await notificaciones.create({
        id_usuario: dueño[0].id_usuario,
        tipo: 'me_gusta',
        texto: 'A alguien le gustó tu publicación',
        id_referencia: publicacion_id,
      });
    }

    res.status(201).json({ ok: true, msg: 'Me gusta agregado' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ ok: false, msg: 'Ya diste me gusta a esta publicación' });
    }
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// DELETE /api/publicaciones/:publicacion_id/me-gusta?usuario_id=
const quitarMeGusta = async (req, res) => {
  try {
    const { publicacion_id } = req.params;
    const { usuario_id } = req.query;
    if (!usuario_id) return res.status(400).json({ ok: false, msg: 'usuario_id es requerido' });

    const affected = await social.quitarMeGusta(publicacion_id, usuario_id);
    if (affected === 0) return res.status(404).json({ ok: false, msg: 'Me gusta no encontrado' });

    res.json({ ok: true, msg: 'Me gusta eliminado' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

// GET /api/publicaciones/:publicacion_id/me-gusta
const getMeGusta = async (req, res) => {
  try {
    const { publicacion_id } = req.params;
    const rows = await social.meGustaByPublicacion(publicacion_id);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, msg: 'Error de conexión', error: err.message });
  }
};

module.exports = {
  seguir, dejarDeSeguir, getSeguidores,
  getPublicaciones, getPublicacionById, createPublicacion, removePublicacion,
  getComentarios, addComentario, removeComentario,
  darMeGusta, quitarMeGusta, getMeGusta,
};