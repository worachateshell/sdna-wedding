import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { env } from './env.js';
import { AspenTokenSchema, BulkAspenTokenSchema } from './schema.js';
import { upsertOne, upsertMany } from './postgrest.js';

const app = express();
const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' });

app.use(pinoHttp({ logger }));
app.use(morgan('tiny'));
app.use(express.json({ limit: '2mb' }));

app.use((req, res, next) => {
  if (!env.SERVICE_BEARER) return next();
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (token !== env.SERVICE_BEARER) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

app.use(rateLimit({ windowMs: 60000, max: 120 }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'postgrest-proxy', table: env.POSTGREST_TABLE });
});

app.post('/upsert', async (req, res) => {
  try {
    const parsed = AspenTokenSchema.parse(req.body);
    const data = await upsertOne(parsed);
    res.json({ ok: true, data });
  } catch (e: any) {
    req.log.error(e);
    res.status(400).json({ ok: false, error: e?.message ?? 'Bad Request' });
  }
});

app.post('/bulk-upsert', async (req, res) => {
  try {
    const parsed = BulkAspenTokenSchema.parse(req.body);
    const data = await upsertMany(parsed);
    res.json({ ok: true, count: Array.isArray(data) ? data.length : undefined, data });
  } catch (e: any) {
    req.log.error(e);
    res.status(400).json({ ok: false, error: e?.message ?? 'Bad Request' });
  }
});

app.listen(env.PORT, () => {
  logger.info(`postgrest-proxy listening on :${env.PORT}`);
});
