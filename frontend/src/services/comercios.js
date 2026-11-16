import api from '../api/axios';

export const getComercios = (tipo = 'todos') =>
  api.get('/comercios', { params: { tipo } }).then((r) => r.data.data || r.data);

export const getComercioById = (comercio_id) =>
  api.get(`/comercios/${comercio_id}`).then((r) => r.data.data || r.data);

export const crearResena = (datos) =>
  api.post('/resenas', datos).then((r) => r.data);
