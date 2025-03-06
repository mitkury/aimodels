import type { Model } from '../types/models';

// Import model data using ES module imports
import openaiModels from '@data/models/openai-models.json';
import anthropicModels from '@data/models/anthropic-models.json';
import mistralModels from '@data/models/mistral-models.json';
import metaModels from '@data/models/meta-models.json';
import googleModels from '@data/models/google-models.json';
import deepseekModels from '@data/models/deepseek-models.json';
import xaiModels from '@data/models/xai-models.json';
import cohereModels from '@data/models/cohere-models.json';

interface ModelsData {
  creator: string;
  models: Model[];
}

/**
 * Resolves a model's inheritance by merging with its base model
 */
function resolveModel(model: Model, allModels: Record<string, Model>, visited = new Set<string>()): Model {
  // No inheritance, return as is
  if (!model.extends) {
    return model;
  }

  // Check for circular dependencies
  if (visited.has(model.id)) {
    throw new Error(`Circular dependency detected for model ${model.id}`);
  }
  visited.add(model.id);

  // Find base model
  const baseModel = allModels[model.extends];
  if (!baseModel) {
    throw new Error(`Base model ${model.extends} not found for ${model.id}`);
  }

  // Recursively resolve the base model first
  const resolvedBase = resolveModel(baseModel, allModels, visited);

  // If no overrides, just inherit everything except id and extends
  if (!model.overrides) {
    return {
      ...resolvedBase,
      id: model.id,
      extends: model.extends
    };
  }

  // Merge with base model, giving priority to overrides
  const resolved = {
    ...resolvedBase,
    ...model.overrides,
    id: model.id,
    extends: model.extends
  };

  return resolved;
}

export function buildAllModels(): Model[] {
  try {
    // Combine all models - using the imports from the top of the file
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

    // First pass: collect all models with minimal defaults
    const allModels = allModelData.flatMap(data => 
      data.models.map(model => ({
        ...model,
        creator: data.creator,
        can: model.can || [],
        providers: model.providers || [],
        license: model.license || '',
        context: model.context || { type: 'token', total: 0, maxOutput: 0 }
      }))
    );

    // Create a map for easy lookup
    const modelMap = Object.fromEntries(
      allModels.map(model => [model.id, model])
    );

    // Second pass: resolve inheritance
    const resolvedModels = allModels.map(model => 
      resolveModel(model, modelMap)
    );

    return resolvedModels;
  } catch (error) {
    console.error('Error building models:', error);
    return [];
  }
}
