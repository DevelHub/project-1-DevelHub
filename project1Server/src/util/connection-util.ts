import { Pool, Client } from 'pg';

export const connectionPool = new Pool({
  user: process.env["1808_DB_USERNAME"],
  host: process.env['1808_DB_HOST'],
  database: 'postgres',
  password: process.env["1808_DB_PASSWORD"],
  port: 5432,
  max: 2
})
