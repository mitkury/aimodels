import { z } from 'zod';

const BaseContextSchema = z.object({
  type: z.string(),
});

export const TokenContextSchema = BaseContextSchema.extend({
  type: z.literal('token'),
  total: z.number().int().nullable().optional(),
  maxOutput: z.number().int().nullable().optional(),
  outputIsFixed: z.union([z.literal(1), z.number().int(), z.boolean()]).optional(),
  extended: z.record(z.string(), z.unknown()).optional(),
});

export const CharacterContextSchema = BaseContextSchema.extend({
  type: z.literal('character'),
  total: z.number().int().nullable().optional(),
  maxOutput: z.number().int().nullable().optional(),
});

// In data, image generation contexts are objects without a type but with fields
export const ImageGenerationContextSchema = z.object({
  maxOutput: z.number().int(),
  sizes: z.array(z.string()),
  qualities: z.array(z.string()).optional(),
});

// Audio contexts in data mimic token shape with explicit type and total/maxOutput
export const AudioInputContextSchema = BaseContextSchema.extend({
  type: z.literal('audio-in'),
  total: z.number().int().nullable().optional(),
  maxOutput: z.number().int().nullable().optional(),
});

export const AudioOutputContextSchema = BaseContextSchema.extend({
  type: z.literal('audio-out'),
  total: z.number().int().nullable().optional(),
  maxOutput: z.number().int().nullable().optional(),
});

export const EmbeddingContextSchema = BaseContextSchema.extend({
  type: z.literal('embedding'),
  total: z.number().int().nullable().optional(),
  unit: z.string().optional(),
  dimensions: z.number().int(),
  embeddingType: z.string().optional(),
  normalized: z.boolean().optional(),
});

export const ModelContextSchema = z.union([
  z.discriminatedUnion('type', [
    TokenContextSchema,
    CharacterContextSchema,
    AudioInputContextSchema,
    AudioOutputContextSchema,
    EmbeddingContextSchema,
  ]),
  ImageGenerationContextSchema,
]);

export type ModelContext = z.infer<typeof ModelContextSchema>;