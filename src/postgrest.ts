import axios from 'axios';
import { env } from './env.js';
import type { AspenToken } from './schema.js';

const client = axios.create({
  baseURL: env.POSTGREST_BASE_URL.replace(/\/+$/, ''),
  timeout: env.POSTGREST_TIMEOUT_MS
});

function tableUrl() {
  return `/${encodeURIComponent(env.POSTGREST_TABLE)}?on_conflict=${encodeURIComponent(env.POSTGREST_ON_CONFLICT)}`;
}

export async function upsertOne(row: AspenToken) {
  const { data } = await client.post(
    tableUrl(),
    row,
    {
      headers: {
        'Authorization': `Bearer ${env.POSTGREST_TOKEN}`,
        'Prefer': 'return=representation,resolution=merge-duplicates',
        'Content-Type': 'application/json'
      }
    }
  );
  return data;
}

export async function upsertMany(rows: AspenToken[]) {
  const { data } = await client.post(
    tableUrl(),
    rows,
    {
      headers: {
        'Authorization': `Bearer ${env.POSTGREST_TOKEN}`,
        'Prefer': 'return=representation,resolution=merge-duplicates',
        'Content-Type': 'application/json'
      }
    }
  );
  return data;
}
