const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const sslConfig = process.env.DB_SSL_CA
  ? { ca: fs.readFileSync(process.env.DB_SSL_CA) }
  : process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false;

// createPool: reutiliza conexiones automaticamente
const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset:  'utf8mb4',
  connectionLimit: process.env.DB_POOL_LIMIT || 10,
  waitForConnections: true,
  ssl: sslConfig,
});

// Verificar conexion al iniciar
pool.getConnection()
  .then(conn => {
    console.log('MySQL conectado');
    conn.release(); // devolver al pool
  })
  .catch(err => {
    console.warn('AVISO MySQL no disponible:', err.message);
    console.warn('El servidor arranca igual; la BD se reconectara cuando este disponible.');
  });

module.exports = pool;
