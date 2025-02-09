import type { Model, ModelCollection, ModelPrice, ModelsData, CreatorsData, ProvidersData } from './types/index';

// Import model data
import openaiModels from './data/models/openai.json' assert { type: 'json' };
import anthropicModels from './data/models/anthropic.json' assert { type: 'json' };
import metaModels from './data/models/meta.json' assert { type: 'json' };
import mistralModels from './data/models/mistral.json' assert { type: 'json' };

// Import metadata
import creators from './data/creators.json' assert { type: 'json' };
import providers from './data/providers.json' assert { type: 'json' };

export * from './types';

// Combine all models
const allModels: Model[] = [
  ...(openaiModels as ModelsData).models,
  ...(anthropicModels as ModelsData).models,
  ...(metaModels as ModelsData).models,
  ...(mistralModels as ModelsData).models
];

export const models: ModelCollection = {
  all: allModels,

  get creators(): string[] {
    return Object.keys((creators as CreatorsData).creators);
  },

  get providers(): string[] {
    return (providers as ProvidersData).providers.map(p => p.id);
  },

  fromCreator(creator: string): Model[] {
    return allModels.filter(model => 
      model.license.startsWith(creator) || // For open source models
      (providers as ProvidersData).providers.find(p => p.id === creator)?.models[model.id] // For proprietary models
    );
  },

  fromProvider(provider: string): Model[] {
    return allModels.filter(model => model.providers.includes(provider));
  },

  find(id: string): Model | undefined {
    return allModels.find(model => model.id === id);
  },

  withCapability(capability: string): Model[] {
    return allModels.filter(model => model.can.includes(capability));
  },

  withMinContext(tokens: number): Model[] {
    return allModels.filter(model => model.context.total >= tokens);
  },

  getPrice(modelId: string, provider: string): ModelPrice | undefined {
    const providerData = (providers as ProvidersData).providers.find(p => p.id === provider);
    const price = providerData?.models[modelId];
    return price?.type === 'token' ? price : undefined;
  }
};

export { creators, providers };

