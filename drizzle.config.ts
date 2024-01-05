import "dotenv/config";
import type { Config } from "drizzle-kit";
import { DrizzleConfig } from "./packages/db/src/drizzle/index.ts";

export default {
  schema: "./packages/db/src/drizzle/schema.ts",
  out: "./packages/db/src/drizzle/migrations",
  driver: "turso", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: DrizzleConfig,
} satisfies Config;
