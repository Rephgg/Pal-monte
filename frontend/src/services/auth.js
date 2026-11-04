import api from '../api/axios';

export const registro = (datos) =>
  api.post('/registro', datos).then((r) => r.data);

export const login = (email, password) =>
  api.post('/login', { email, password }).then((r) => r.data);

export const getPerfil = (usuario_id) =>
  api.get(`/perfil/${usuario_id}`).then((r) => r.data);

export const updatePerfil = (usuario_id, datos) =>
  api.put(`/perfil/${usuario_id}`, datos).then((r) => r.data);

export const updatePassword = (usuario_id, datos) =>
  api.put(`/perfil/${usuario_id}/password`, datos).then((r) => r.data);