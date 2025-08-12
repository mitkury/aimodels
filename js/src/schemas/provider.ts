import { z } from 'zod';
import { PricingEntrySchema } from './pricing';

export const ProviderSourceSchema = z.object({
  id: z.string(),
  apiUrl: z.string().url().or(z.string().length(0)).optional(),
  apiDocsUrl: z.string().url().optional(),
  pricing: z.record(z.string(), PricingEntrySchema).default({}),
});

export const ProviderSchema = ProviderSourceSchema.extend({
  name: z.string().optional(),
  isLocal: z.number().optional(),
});

export type Provider = z.infer<typeof ProviderSchema>;
export type ProviderSource = z.infer<typeof ProviderSourceSchema>;