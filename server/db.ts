import pkg from "pg";
const { Pool } = pkg;
import "dotenv/config";

// Типизируем пул соединений
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_DATABASE,
});

export default pool;
