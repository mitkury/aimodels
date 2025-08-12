import { z } from 'zod';

export const TokenBasedPricePerMillionTokensSchema = z.object({
  type: z.literal('token'),
  input: z.number(),
  output: z.number(),
  // Some providers include cached input pricing
  input_cached: z.number().optional(),
}).passthrough();

export const ImagePriceSchema = z.object({
  type: z.literal('image'),
  price: z.number(),
  size: z.string().optional(),
  unit: z.string().optional(),
}).passthrough();

export const PricingEntrySchema = z.union([
  TokenBasedPricePerMillionTokensSchema,
  ImagePriceSchema,
  // Fallback generic structure as seen in schema enum; allow other measured units
  z.object({
    type: z.enum(['character', 'request', 'second', 'minute', 'call']).or(z.string()),
  }).passthrough(),
]);

export type TokenBasedPricePerMillionTokens = z.infer<typeof TokenBasedPricePerMillionTokensSchema>;
export type ImagePrice = z.infer<typeof ImagePriceSchema>;