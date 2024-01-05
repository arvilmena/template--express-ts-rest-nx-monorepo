import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { z } from 'zod';
import * as schema from './schema';

const DrizzleConfigSchema = z.object({
  url: z.string().min(1).url(),
  authToken: z.string().min(1),
});

export const DrizzleConfig = DrizzleConfigSchema.parse({
  url: process.env['TURSO_DB_URL'],
  authToken: process.env['TURSO_DB_AUTH_TOKEN'],
});

const client = createClient(DrizzleConfig);

export const db = drizzle(client, { schema, logger: false });
