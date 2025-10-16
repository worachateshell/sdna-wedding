import 'dotenv/config';

function requireEnv(name: string, def?: string) {
  const v = process.env[name] ?? def;
  if (v === undefined || v === '') {
    throw new Error(`Missing required env: ${name}`);
  }
  return v;
}

export const env = {
  PORT: Number(process.env.PORT ?? 8080),
  SERVICE_BEARER: process.env.SERVICE_BEARER,
  POSTGREST_BASE_URL: requireEnv('POSTGREST_BASE_URL'),
  POSTGREST_TABLE: requireEnv('POSTGREST_TABLE'),
  POSTGREST_TOKEN: requireEnv('POSTGREST_TOKEN'),
  POSTGREST_ON_CONFLICT: requireEnv('POSTGREST_ON_CONFLICT', 'signature'),
  POSTGREST_TIMEOUT_MS: Number(process.env.POSTGREST_TIMEOUT_MS ?? 5000)
};
