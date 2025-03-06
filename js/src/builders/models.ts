import type { Model } from '../types/models';

interface ModelsData {
  creator: string;
  models: SourceModel[];
}

interface SourceModel {
  id: string;
  name: string;
  can?: string[];
  providers?: string[];
  license?: string;
  context?: {
    total?: number;
    maxOutput?: number;
    outputIsFixed?: number;
  };
}

// Validation function
function validateModel(model: SourceModel): boolean {
  if (!model.id || !model.name) {
    console.error(`Model with id "${model.id}" missing required fields`);
    return false;
  }
  return true;
}

export function buildAllModels(): Model[] {
  try {
    // Import will be resolved by esbuild plugin
    const openaiModels = require('@data/models/openai-models.json');
    const anthropicModels = require('@data/models/anthropic-models.json');
    const mistralModels = require('@data/models/mistral-models.json');
    const metaModels = require('@data/models/meta-models.json');
    const googleModels = require('@data/models/google-models.json');
    const deepseekModels = require('@data/models/deepseek-models.json');
    const xaiModels = require('@data/models/xai-models.json');
    const cohereModels = require('@data/models/cohere-models.json');

    // Combine all models
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

    // Process models
    return allModelData.flatMap(data => 
      data.models.map(model => ({
        id: model.id,
        name: model.name,
        can: model.can || [],
        providers: model.providers || [],
        creator: data.creator,
        license: model.license || data.creator || '',
        context: {
          total: model.context?.total || 0,
          maxOutput: model.context?.maxOutput || 0,
          ...(model.context?.outputIsFixed && { outputIsFixed: model.context.outputIsFixed })
        }
      }))
    );
  } catch (error) {
    console.error('Error building models:', error);
    return [];
  }
}
