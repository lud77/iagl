import { Pool } from 'pg';
import config from 'config';

console.log('Seeder starting...');

if (process.env.IAGL_DB_PASSWORD == null) process.exit(1);

const waitForDb = async (maxRetries = 10) => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await pool.query('select 1');
      return;
    } catch {
      retries++;
      await new Promise(res => setTimeout(res, 1000));
    }
  }

  throw new Error(`DB not ready after ${maxRetries} retries`);
};

const exitIfTableExists = async () => {
  const result = await pool.query(`
    select exists (
      select 1
      from pg_tables
      where
        schemaname = 'public' and
        tablename = 'ratesbyroute'
    )
  `);

  if (result.rows[0].exists) {
    console.log('Table `ratesByRoute` already exists. Exiting...');
    process.exit(0);
  }
};

const createTable = async () => {
  console.log('Creating table `ratesByRoute`...');

  await pool.query(`
    create table if not exists ratesByRoute (
      route text primary key,
      rate real not null
    )
  `);
};

const insertData = async (rates: Record<string, number>) => {
  console.log('Inserting data...');

  for (const [route, rate] of Object.entries(rates)) {
    await pool.query(`
      insert into ratesByRoute (route, rate)
        values ($1, $2)
        on conflict (route) do nothing
      `,
      [route, rate]
    );
  }
};

const pool = new Pool({
  host: 'db',
  database: 'iagl',
  user: 'api',
  password: process.env.IAGL_DB_PASSWORD,
  port: 5432,
});

async function seeder() {
  await waitForDb();
  await exitIfTableExists();
  await createTable();
  await insertData(config.get('RatesByRoute'));

  await pool.end();
}

seeder()
  .then(() => {
    console.log('Done.');
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
