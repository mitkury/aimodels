import type { Model, ModelsData } from '../types/index';

// Import model data
import openaiModels from '../data/models/openai.json' assert { type: 'json' };
import anthropicModels from '../data/models/anthropic.json' assert { type: 'json' };
import metaModels from '../data/models/meta.json' assert { type: 'json' };
import mistralModels from '../data/models/mistral.json' assert { type: 'json' };

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
