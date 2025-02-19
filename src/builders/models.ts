import type { Model, ModelsData } from '../types/index.ts';
import type { Capability } from '../types/capabilities.ts';

// Import model data
import openaiModels from '../data/models/openai-models.json' with { type: 'json' };
import anthropicModels from '../data/models/anthropic-models.json' with { type: 'json' };
import metaModels from '../data/models/meta-models.json' with { type: 'json' };
import mistralModels from '../data/models/mistral-models.json' with { type: 'json' };
import googleModels from '../data/models/google-models.json' with { type: 'json' };
import deepseekModels from '../data/models/deepseek-models.json' with { type: 'json' };
import xaiModels from '../data/models/xai-models.json' with { type: 'json' };
import cohereModels from '../data/models/cohere-models.json' with { type: 'json' };

export function validateModel(raw: unknown): Model {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Model data must be an object');
  }

  const model = raw as Record<string, unknown>;

  // Validate required string fields
  const stringFields = ['id', 'name', 'creator', 'license'];
  for (const field of stringFields) {
    if (typeof model[field] !== 'string') {
      throw new Error(`Model ${field} must be a string`);
    }
  }

  // Validate providers array
  if (!Array.isArray(model.providers)) {
    throw new Error('Model providers must be an array');
  }
  if (!model.providers.every(p => typeof p === 'string')) {
    throw new Error('Model providers must be strings');
  }

  // Validate capabilities array
  if (!Array.isArray(model.can)) {
    throw new Error('Model capabilities must be an array');
  }
  const validCapabilities: Capability[] = [
    'chat', 'reason', 'text-in', 'text-out', 'img-in', 'img-out',
    'sound-in', 'sound-out', 'json-out', 'function-out', 'vectors-out'
  ];
  if (!model.can.every(c => validCapabilities.includes(c as Capability))) {
    throw new Error(`Model has invalid capabilities: ${model.can.join(', ')}`);
  }

  // Validate aliases if present
  if (model.aliases !== undefined) {
    if (!Array.isArray(model.aliases)) {
      throw new Error('Model aliases must be an array');
    }
    if (!model.aliases.every(a => typeof a === 'string')) {
      throw new Error('Model aliases must be strings');
    }
  }

  // Validate context object
  if (typeof model.context !== 'object' || model.context === null) {
    throw new Error('Model context must be an object');
  }
  const context = model.context as Record<string, unknown>;

  // Check if it's an image model context
  if (Array.isArray(context.sizes) && Array.isArray(context.qualities)) {
    if (typeof context.maxOutput !== 'number') {
      throw new Error('Image model context.maxOutput must be a number');
    }
  } else {
    // Token model context
    if (typeof context.total !== 'number' && context.total !== null) {
      throw new Error('Token model context.total must be a number or null');
    }
    if (typeof context.maxOutput !== 'number' && context.maxOutput !== null) {
      throw new Error('Token model context.maxOutput must be a number or null');
    }
  }

  // At this point we've verified all required fields
  return {
    id: model.id as string,
    name: model.name as string,
    creator: model.creator as string,
    license: model.license as string,
    providers: model.providers as string[],
    can: model.can as Capability[],
    context: model.context as Model['context'],
    ...(model.languages ? { languages: model.languages as string[] } : {}),
    ...(model.aliases ? { aliases: model.aliases as string[] } : {})
  };
}

/**
 * Builds a combined list of all available models from all providers.
 * This is a single source of truth for model data.
 */
export function buildAllModels(): Model[] {
  const allModelData = [
    openaiModels,
    anthropicModels,
    metaModels,
    mistralModels,
    googleModels,
    deepseekModels,
    xaiModels,
    cohereModels
  ] as ModelsData[];

  const allModels = allModelData.flatMap(data => 
    data.models.map(model => ({
      ...model,
      creator: data.creator
    }))
  );

  // Validate each model
  return allModels.map(model => validateModel(model));
}
