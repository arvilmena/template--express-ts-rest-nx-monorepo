import { z } from 'zod';

const configSchema = z.object({
  APP_ROOT_DIR_ABSPATH: z.string().min(1),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']),
  NODE_ENV: z.enum(['development', 'production']),
});

const config = {
  APP_ROOT_DIR_ABSPATH: process.env['APP_ROOT_DIR_ABSPATH'],
  LOG_LEVEL: process.env['LOG_LEVEL'],
  NODE_ENV: process.env['NODE_ENV'],
};

const parsedConfig = configSchema.safeParse(config);

if (!parsedConfig.success) {
  throw new Error(JSON.stringify(parsedConfig.error, null, 2));
}

export const StonkerConfig = parsedConfig.data;
