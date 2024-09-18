// services/postgresService.ts
import { Pool } from 'pg';

const pool = new Pool({
  user: 'user', 
  host: 'localhost',
  database: 'database', 
  password: 'password', 
  port: 5432,
});


const checkConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Conexão com PostgreSQL bem-sucedida!');
    client.release(); 
  } catch (error) {
    console.error('Erro ao conectar ao PostgreSQL:', error.message);
  }
};

const query = async (text: string, params?: any[]) => {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Consulta executada', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Erro ao executar consulta:', error.message);
    throw error;
  }
};

checkConnection();

export default {
  query,
};