import api from '../api/axios';

export const getRutas = (dificultad = 'todas') =>
  api.get('/rutas', { params: { dificultad } }).then((r) => r.data.data || r.data);

export const getRutaById = (ruta_id) =>
  api.get(`/rutas/${ruta_id}`).then((r) => r.data.data || r.data);

export const crearResena = (datos) =>
  api.post('/resenas', datos).then((r) => r.data);
