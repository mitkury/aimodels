import type { Model, ModelsData } from '../types/index.ts';

// Import model data
import openaiModels from '../data/models/openai-models.json' with { type: 'json' };
import anthropicModels from '../data/models/anthropic-models.json' with { type: 'json' };
import metaModels from '../data/models/meta-models.json' with { type: 'json' };
import mistralModels from '../data/models/mistral-models.json' with { type: 'json' };
import googleModels from '../data/models/google-models.json' with { type: 'json' };
import deepseekModels from '../data/models/deepseek-models.json' with { type: 'json' };

/**
 * Builds a combined list of all available models from all providers.
 * This is a single source of truth for model data.
 */
export function buildAllModels(): Model[] {
  return [
    ...(openaiModels as ModelsData).models,
    ...(anthropicModels as ModelsData).models,
    ...(metaModels as ModelsData).models,
    ...(mistralModels as ModelsData).models,
    ...(googleModels as ModelsData).models,
    ...(deepseekModels as ModelsData).models
  ];
}
