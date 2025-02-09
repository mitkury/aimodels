import type { Model, ModelsData } from '../types/index.ts';

// Import model data
import openaiModels from '../data/models/openai.json' with { type: 'json' };
import anthropicModels from '../data/models/anthropic.json' with { type: 'json' };
import metaModels from '../data/models/meta.json' with { type: 'json' };
import mistralModels from '../data/models/mistral.json' with { type: 'json' };

/**
 * Builds a combined list of all available models from all providers.
 * This is a single source of truth for model data.
 */
export function buildAllModels(): Model[] {
  return [
    ...(openaiModels as ModelsData).models,
    ...(anthropicModels as ModelsData).models,
    ...(metaModels as ModelsData).models,
    ...(mistralModels as ModelsData).models
  ];
}
