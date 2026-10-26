import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function getConnectionString(): string {
  const connStr = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connStr) {
    throw new Error(
      "[Database Configuration Error]: Neither DATABASE_URL nor POSTGRES_URL environment variable is set."
    );
  }
  return connStr;
}

export function getDbPool(): Pool {
  if (!global.__pgPool) {
    global.__pgPool = new Pool({
      connectionString: getConnectionString(),
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return global.__pgPool;
}

export async function queryDb<T = any>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number | null }> {
  const pool = getDbPool();
  const res = await pool.query(text, params);
  return { rows: res.rows, rowCount: res.rowCount };
}
