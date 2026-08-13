import 'dotenv/config';
import { Pool } from 'pg';

const databasePort = Number(process.env.DB_PORT);

if (Number.isNaN(databasePort)) {
  throw new Error('DB_PORT deve ser um número válido.');
}

export const database = new Pool({
  host: process.env.DB_HOST,
  port: databasePort,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export async function testDatabaseConnection(): Promise<void> {
  const client = await database.connect();

  try {
    await client.query('SELECT 1');
  } finally {
    client.release();
  }
}
