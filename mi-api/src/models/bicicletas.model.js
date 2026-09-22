/**
 * Model BICICLETAS (tabla `bicicleta`)
 * Bicicletas que registra cada usuario.
 */
const pool = require('../db');

const getByUsuario = async (id_usuario) => {
  const [rows] = await pool.query(
    'SELECT id, marca, modelo, tipo_bici, rodada, color, foto, fecha_registro FROM bicicleta WHERE id_usuario = ? ORDER BY fecha_registro DESC',
    [id_usuario]
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM bicicleta WHERE id = ?', [id]);
  return rows[0];
};

const create = async ({ id_usuario, marca, modelo, tipo_bici, rodada, color, foto = 'default_bike.png' }) => {
  const [result] = await pool.query(
    'INSERT INTO bicicleta (id_usuario, marca, modelo, tipo_bici, rodada, color, foto) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id_usuario, marca, modelo, tipo_bici, rodada, color, foto]
  );
  return { id: result.insertId };
};

const update = async (id, { marca, modelo, tipo_bici, rodada, color, foto }) => {
  const fields = [];
  const values = [];
  if (marca !== undefined) { fields.push('marca = ?'); values.push(marca); }
  if (modelo !== undefined) { fields.push('modelo = ?'); values.push(modelo); }
  if (tipo_bici !== undefined) { fields.push('tipo_bici = ?'); values.push(tipo_bici); }
  if (rodada !== undefined) { fields.push('rodada = ?'); values.push(rodada); }
  if (color !== undefined) { fields.push('color = ?'); values.push(color); }
  if (foto !== undefined) { fields.push('foto = ?'); values.push(foto); }
  if (fields.length === 0) return 0;
  values.push(id);
  const [result] = await pool.query(`UPDATE bicicleta SET ${fields.join(', ')} WHERE id = ?`, values);
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM bicicleta WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getByUsuario, findById, create, update, remove };