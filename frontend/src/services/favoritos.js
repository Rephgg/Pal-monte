import api from '../api/axios';

export const getFavoritos = (usuario_id) =>
  api.get('/favoritos', { params: { usuario_id } }).then((r) => r.data.data || r.data);

export const agregarFavorito = (usuario_id, ruta_id) =>
  api.post('/favoritos', { usuario_id, ruta_id }).then((r) => r.data);

export const eliminarFavorito = (usuario_id, ruta_id) =>
  api.delete('/favoritos', { data: { usuario_id, ruta_id } }).then((r) => r.data);

export const getRutasRealizadas = (usuario_id) =>
  api.get('/rutas-realizadas', { params: { usuario_id } }).then((r) => r.data.data || r.data);

export const registrarRutaRealizada = (usuario_id, ruta_id, tiempo_real, observaciones) =>
  api.post('/rutas-realizadas', { usuario_id, ruta_id, tiempo_real, observaciones }).then((r) => r.data);
