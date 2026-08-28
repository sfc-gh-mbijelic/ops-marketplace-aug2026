import snowflake from 'snowflake-sdk';

let connection: any = null;

export async function getConnection() {
  if (connection) return connection;

  // In SPCS, credentials come from the service token
  const opts: any = {
    account: process.env.SNOWFLAKE_ACCOUNT || '',
    authenticator: 'SNOWFLAKE_JWT',
    token: process.env.SNOWFLAKE_TOKEN || '',
    warehouse: process.env.SNOWFLAKE_WAREHOUSE || 'COMPUTE_WH',
    database: 'ON_GOVERNANCE_RFS',
    schema: 'PUBLIC',
  };

  // SPCS service-to-Snowflake uses OAuth token from mounted file
  if (process.env.SNOWFLAKE_HOST) {
    opts.host = process.env.SNOWFLAKE_HOST;
    opts.account = process.env.SNOWFLAKE_ACCOUNT;
    const fs = await import('fs');
    try {
      opts.token = fs.readFileSync('/snowflake/session/token', 'utf-8').trim();
      opts.authenticator = 'OAUTH';
    } catch {}
  }

  return new Promise((resolve, reject) => {
    connection = snowflake.createConnection(opts);
    connection.connect((err: any) => {
      if (err) reject(err);
      else resolve(connection);
    });
  });
}

export async function executeQuery(sql: string, binds?: any[]): Promise<any[]> {
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    conn.execute({
      sqlText: sql,
      binds: binds || [],
      complete: (err: any, _stmt: any, rows: any[]) => {
        if (err) reject(err);
        else resolve(rows || []);
      },
    });
  });
}
