import { z } from 'zod';
import { CapabilitySchema } from './capabilities';
import { ModelContextSchema } from './modelContext';

export const ModelSourceSchema = z.object({
  id: z.string().describe('Unique identifier for the model'),
  name: z.string().optional().describe("Human-readable name of the model"),
  license: z.string().optional().describe('License type of the model'),
  providerIds: z.array(z.string()).optional().describe('List of provider IDs that offer this model'),
  aliases: z.array(z.string()).optional().describe('Alternative identifiers for this model'),
  capabilities: z.array(CapabilitySchema).optional().describe('List of capabilities this model supports'),
  context: ModelContextSchema.optional().describe('Context window information'),
  extends: z.string().optional().describe("ID of the model this model extends"),
  overrides: z
    .object({
      name: z.string().optional(),
      capabilities: z.array(CapabilitySchema).optional(),
      context: z.unknown().optional(),
      license: z.string().optional(),
      providerIds: z.array(z.string()).optional(),
      aliases: z.array(z.string()).optional(),
      creatorId: z.string().optional(),
      languages: z.array(z.string()).optional(),
    })
    .partial()
    .optional()
    .describe("Properties that override the extended model's properties"),
  creatorId: z.string().optional(),
  languages: z.array(z.string()).optional(),
});

export const ValidatedModelSchema = ModelSourceSchema.refine(
  (data) => {
    if (!data.extends) {
      return Boolean(data.name && data.providerIds && data.capabilities && data.context);
    }
    return true;
  },
  {
    message: "Base models (without 'extends') must include name, providerIds, capabilities, and context",
    path: ['extends'],
  }
);

export const ModelCollectionSchema = z.object({
  creator: z.string().describe('The ID of the creator/organization that developed these models'),
  models: z.array(ValidatedModelSchema).describe('Array of model definitions'),
});

export type Model = z.infer<typeof ValidatedModelSchema>;
export type ModelCollection = z.infer<typeof ModelCollectionSchema>;