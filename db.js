  const { Pool } = require('pg');

  const pool = new Pool({
      user: 'postgres',
      password: 'sagore',
      host: 'localhost',
      port: 5432,
      database: 'task_manager'
  });

  module.exports = pool;