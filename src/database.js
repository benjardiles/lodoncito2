const { Pool } = require('pg');

// Configuración de la conexión a la base de datos
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '1408',
  database: 'lodoncito'
});

// Manejador de eventos para verificar la conexión
pool.on('connect', () => {
  console.log('Connected to the database');
});

// Manejador de eventos para manejar errores de conexión
pool.on('error', (err) => {
  console.error('Error connecting to the database:', err.stack);
});

// Intentar conectarse explícitamente
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client:', err.stack);
  }
  console.log('Connected to the database via explicit connection');

  // Ejecutar una consulta de prueba para verificar la conexión
  client.query('SELECT NOW()', (err, result) => {
    release(); // Liberar el cliente después de usarlo
    if (err) {
      return console.error('Error executing query:', err.stack);
    }
    console.log('Query result:', result.rows);
  });
});
