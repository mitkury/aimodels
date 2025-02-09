import type { Model, ModelsAPI, ModelPrice, CreatorsData, Provider, Capability } from './types/index.ts';
import { ModelCollection } from './types/models.ts';


// Import builders and metadata
import { buildAllModels } from './builders/models.ts';
import { buildProvidersData } from './builders/providers.ts';
import creators from './data/creators.json' with { type: 'json' };

// Build data once
const allModels = buildAllModels();
const providersData = buildProvidersData();

export const models: ModelsAPI = {
  all: new ModelCollection(allModels),

  get creators(): string[] {
    return Object.keys((creators as CreatorsData).creators);
  },

  get providers(): string[] {
    return providersData.providers.map((p: Provider) => p.id);
  },

  fromCreator(creator: string): ModelCollection {
    return new ModelCollection(
      allModels.filter(model => 
        model.license.startsWith(creator) || // For open source models
        providersData.providers.find((p: Provider) => p.id === creator)?.models[model.id] // For proprietary models
      )
    );
  },

  fromProvider(provider: string): ModelCollection {
    return new ModelCollection(
      allModels.filter(model => model.providers.includes(provider))
    );
  },

  find(id: string): Model | undefined {
    return allModels.find(model => model.id === id);
  },

  can(...capabilities: Capability[]): ModelCollection {
    return new ModelCollection(
      allModels.filter(model => 
        capabilities.every(capability => model.can.includes(capability))
      )
    );
  },

  withMinContext(tokens: number): ModelCollection {
    return new ModelCollection(
      allModels.filter(model => model.context.total >= tokens)
    );
  },

  getPrice(modelId: string, provider: string): ModelPrice | undefined {
    const providerData = providersData.providers.find((p: Provider) => p.id === provider);
    const price = providerData?.models[modelId];
    return price?.type === 'token' ? price : undefined;
  }
};

export { creators };

