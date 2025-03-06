import type { Model, ModelContext } from '../types/models';
import type { Capability } from '../types/capabilities';

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

    // Process models, filtering out invalid models first
    return allModelData.flatMap(data => 
      data.models
        .filter(validateModel)
        .map(model => {
          // Create a properly typed context object
          const context: ModelContext = {
            type: 'token',
            total: model.context?.total || 0,
            maxOutput: model.context?.maxOutput || 0
          };
          
          // Add outputIsFixed only if it's exactly 1
          if (model.context?.outputIsFixed === 1) {
            (context as any).outputIsFixed = 1;
          }
          
          return {
            id: model.id,
            name: model.name,
            can: model.can as Capability[] || [],
            providers: model.providers || [],
            creator: data.creator,
            license: model.license || data.creator || '',
            context
          };
        })
    );
  } catch (error) {
    console.error('Error building models:', error);
    return [];
  }
}
