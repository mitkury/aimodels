import type { ModelPrice, CreatorsData, Provider } from './types/index.ts';
import { ModelCollection } from './types/models.ts';

// Re-export types that users will need
export type { Model, ModelContext } from './types/models.ts';
export type { Capability } from './types/capabilities.ts';
export type { ModelPrice } from './types/pricing.ts';
export { ModelCollection } from './types/models.ts';


// Import builders and metadata
import { buildAllModels } from './builders/models.ts';
import { buildProvidersData } from './builders/providers.ts';
import creators from './data/creators.json' with { type: 'json' };

// Build data once
const allModels = buildAllModels();
const providersData = buildProvidersData();

class ModelsCollection extends ModelCollection {
  get creators(): string[] {
    return Object.keys((creators as CreatorsData).creators);
  }

  get providers(): string[] {
    return providersData.providers.map((p: Provider) => p.id);
  }

  fromCreator(creator: string): ModelCollection {
    return new ModelCollection(
      this.filter(model => 
        model.license.startsWith(creator) || // For open source models
        !!providersData.providers.find((p: Provider) => p.id === creator)?.models[model.id] // For proprietary models
      )
    );
  }

  getPrice(modelId: string, provider: string): ModelPrice | undefined {
    const providerData = providersData.providers.find((p: Provider) => p.id === provider);
    const price = providerData?.models[modelId];
    return price?.type === 'token' ? price : undefined;
  }
}

export const models = new ModelsCollection(allModels);

export { creators };

