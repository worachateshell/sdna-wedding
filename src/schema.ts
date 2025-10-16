import { z } from 'zod';

export const AspenTokenSchema = z.object({
  signature: z.string().min(8),
  rec_ver1: z.number().int().optional(),
  rec_ver2: z.number().int().optional(),
  token_b64: z.string().optional(),
  token_decoded: z.string().optional(),
  issue_time_str: z.string().optional(),
  issue_time_epoch: z.number().int(),
  issue_time_utc_iso: z.string().optional(),
  issue_time_local_iso: z.string().optional(),
  product: z.string(),
  major: z.number().int().optional(),
  minor: z.number().int().optional(),
  feature_id: z.number().int().optional(),
  product_version: z.string().optional(),
  seats_or_qty: z.number().int().optional(),
  customer_id: z.string().optional(),
  vendor_id: z.string().optional()
});

export type AspenToken = z.infer<typeof AspenTokenSchema>;
export const BulkAspenTokenSchema = z.array(AspenTokenSchema).min(1);
