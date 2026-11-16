import api from '../api/axios';

export const getEventos = () =>
  api.get('/eventos').then((r) => r.data.data || r.data);

export const getEventoById = (evento_id) =>
  api.get(`/eventos/${evento_id}`).then((r) => r.data.data || r.data);

export const inscribirEvento = (evento_id, usuario_id) =>
  api.post(`/eventos/${evento_id}/inscribir`, { usuario_id }).then((r) => r.data);

export const cancelarInscripcion = (evento_id, usuario_id) =>
  api.delete(`/eventos/${evento_id}/cancelar-inscripcion`, { data: { usuario_id } }).then((r) => r.data);
