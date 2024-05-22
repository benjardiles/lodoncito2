const { Client } = require('pg');

const client = new Client({
  user: 'myuser',
  host: 'localhost',
  database: 'mydatabase',
  password: 'mypassword',
  port: 5432,
});

client.connect();

module.exports = client;
