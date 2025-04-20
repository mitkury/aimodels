# Proposal: Using Zod for Schema Definitions

## Overview

This document proposes adopting Zod as the primary schema definition tool for the aimodels library, replacing the current JSON Schema approach with a TypeScript-first methodology.

## Motivation

The aimodels library currently defines its schemas in JSON Schema format, which works but presents several limitations:

1. **Type Safety**: JSON Schema lacks native TypeScript integration, requiring manual type definitions
2. **Developer Experience**: No IDE autocompletion or type checking when working with schemas
3. **Maintenance**: Changes to schemas require updates in multiple places
4. **Validation**: Separate validation libraries are needed for runtime checking

## Proposed Solution

Use Zod to define all schemas in TypeScript, then export them to JSON Schema format for reference and compatibility with the Python package.

### Implementation Plan

1. Create TypeScript + Zod definitions for all current schemas in a new location (`js/src/schemas/`)
2. Use `zod-to-json-schema` to export compatible JSON Schema files to `/data/schemas/`
3. Update the JavaScript package to use Zod for validation
4. Maintain the exported JSON Schema for the Python package

## Benefits

- **Single Source of Truth**: Define schemas once in TypeScript/Zod
- **Type Safety**: Full TypeScript integration with inference
- **Runtime Validation**: Built-in validation with detailed error messages
- **Developer Experience**: IDE autocompletion and type checking
- **Compatibility**: Continue supporting JSON Schema for Python and other consumers
- **Future-Proofing**: Easier to extend and modify schemas

## Example Implementation

```typescript
// js/src/schemas/model.ts
import { z } from "zod";

// Define capability types with documentation
export const modelCapabilities = z.enum([
  "chat",
  "reason",
  "txt-in",
  "txt-out",
  "img-in",
  "img-out",
  "audio-in",
  "audio-out",
  "json-out",
  "fn-out",
  "vec-out",
]);

// Text model context schema
const textModelContext = z.object({
  type: z.literal("token"),
  total: z.union([z.number().int(), z.null()]).optional(),
  maxOutput: z.union([z.number().int(), z.null()]).optional(),
  outputIsFixed: z.union([z.number().int(), z.boolean()]).optional(),
  extended: z.record(z.string(), z.object({})).optional(),
}).describe("Text model context");

// Embedding model context schema
const embeddingModelContext = z.object({
  type: z.literal("embedding"),
  total: z.union([z.number().int(), z.null()]).optional(),
  unit: z.string().optional(),
  dimensions: z.number().int(),
  embeddingType: z.string().optional(),
  normalized: z.boolean().optional(),
}).describe("Embedding model context");

// Other context schemas...
const imageGenerationModelContext = z.object({
  maxOutput: z.number().int(),
  sizes: z.array(z.string()),
  qualities: z.array(z.string()).optional(),
}).describe("Image generation model context");

// Combined context schema using discriminated union
export const contextSchema = z.discriminatedUnion("type", [
  textModelContext,
  embeddingModelContext,
  // Other context types...
]).or(imageGenerationModelContext);

// Base model schema
export const modelSchema = z.object({
  id: z.string().describe("Unique identifier for the model"),
  name: z.string().describe("Human-readable name of the model").optional(),
  license: z.string().describe("License type of the model").optional(),
  providerIds: z.array(z.string()).describe("List of provider IDs that offer this model").optional(),
  aliases: z.array(z.string()).describe("Alternative identifiers for this model").optional(),
  capabilities: z.array(modelCapabilities).describe("List of capabilities this model supports").optional(),
  context: contextSchema.describe("Context window information").optional(),
  extends: z.string().describe("ID of the model this model extends").optional(),
  overrides: z.object({
    name: z.string().optional(),
    capabilities: z.array(z.string()).optional(),
    context: z.object({}).passthrough().optional(),
  }).describe("Properties that override the extended model's properties").optional(),
});

// Add conditional validation for base vs. extended models
export const validatedModelSchema = modelSchema.refine(
  (data) => {
    if (!data.extends) {
      return !!(data.name && data.providerIds && data.capabilities && data.context);
    }
    return true;
  },
  {
    message: "Base models (without 'extends') must include name, providerIds, capabilities, and context",
    path: ["extends"],
  }
);

// Model collection schema
export const modelCollectionSchema = z.object({
  creator: z.string().describe("The ID of the creator/organization that developed these models"),
  models: z.array(validatedModelSchema).describe("Array of model definitions"),
});

// Export types
export type ModelCapability = z.infer<typeof modelCapabilities>;
export type ModelContext = z.infer<typeof contextSchema>;
export type Model = z.infer<typeof validatedModelSchema>;
export type ModelCollection = z.infer<typeof modelCollectionSchema>;
```

## JSON Schema Export

```typescript
// js/src/schemas/export.ts
import { zodToJsonSchema } from "zod-to-json-schema";
import { modelCollectionSchema, providerSchema, organizationSchema } from "./index";
import * as fs from "fs";
import * as path from "path";

// Export model schema
const modelJsonSchema = zodToJsonSchema(modelCollectionSchema, {
  $refStrategy: "none",
  target: "json-schema-2019-09",
  basePath: ["ModelCollection"],
});

// Write to file
fs.writeFileSync(
  path.resolve(__dirname, "../../../data/schemas/model.json"),
  JSON.stringify(modelJsonSchema, null, 2)
);

// Similar exports for other schemas...
```

## Compatibility Considerations

- The exported JSON Schema will have slight structural differences from the current schema
- All validation logic will remain the same
- A comprehensive test suite will ensure behavior equivalence
- Documentation will be updated to reflect the new schema source

## Next Steps

1. Implement Zod schemas for all existing schema files
2. Create export mechanism for JSON Schema
3. Update validation in JS package to use Zod
4. Add tests to ensure equivalence
5. Document the new approach

## Conclusion

Moving to Zod for schema definitions provides significant benefits for the aimodels library, improving type safety, developer experience, and maintainability while preserving compatibility with existing consumers through JSON Schema exports. 