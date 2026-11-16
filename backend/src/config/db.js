const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

let sslConfig = false;
if (process.env.DB_SSL_CA) {
  const caPath = process.env.DB_SSL_CA.startsWith('/')
    ? process.env.DB_SSL_CA
    : require('path').resolve(process.env.DB_SSL_CA);
  sslConfig = { ca: fs.readFileSync(caPath) };
} else if (process.env.DB_SSL === 'true') {
  sslConfig = { rejectUnauthorized: false };
}

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
