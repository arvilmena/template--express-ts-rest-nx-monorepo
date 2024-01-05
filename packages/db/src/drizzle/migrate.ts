import { migrate } from 'drizzle-orm/libsql/migrator';
import * as path from 'path';
import { db } from './index';

const CURRENT_DIRECTORY = __dirname;
try {
  await migrate(db, {
    migrationsFolder: path.join(CURRENT_DIRECTORY, 'migrations'),
  });
} catch (error) {
  if ((error as { code: string })?.code !== 'SQL_NO_STATEMENT') {
    console.log({ error });
    throw error;
  }
  console.log({ error });
  throw error;
}
