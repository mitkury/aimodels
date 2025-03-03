import type { TokenBasedPricePerMillionTokens, CreatorsData, Provider } from './types/index.ts';
import type { Model } from './types/models.ts';
import { ModelCollection } from './types/models.ts';

// Re-export types that users will need
export type { Model, ModelContext } from './types/models.ts';
export type { Capability } from './types/capabilities.ts';
export type { TokenBasedPricePerMillionTokens } from './types/pricing.ts';
export type { Provider } from './types/providers.ts';
export { ModelCollection } from './types/models.ts';


// Import builders and metadata
import { buildAllModels } from './builders/models.ts';
import { buildProvidersData } from './builders/providers.ts';
import creators from '@data/creators.json' with { type: 'json' };

// Build data once
const allModels = buildAllModels();
const providersData = buildProvidersData();

export class AIModels extends ModelCollection {
  constructor(models: Model[] = []) {
    super(models);
    Object.setPrototypeOf(this, AIModels.prototype);
  }

  get creators(): string[] {
    return Object.keys((creators as CreatorsData).creators);
  }

  get providers(): string[] {
    return providersData.providers.map((p: Provider) => p.id);
  }

  getPrice(modelId: string, provider: string): TokenBasedPricePerMillionTokens | undefined {
    const providerData = providersData.providers.find((p: Provider) => p.id === provider);
    const price = providerData?.models[modelId];
    return price?.type === 'token' ? price : undefined;
  }

  /** Get provider information by ID */
  getProvider(providerId: string): Provider | undefined {
    return providersData.providers.find((p: Provider) => p.id === providerId);
  }

  /** Get all providers that can serve a specific model */
  getProvidersForModel(modelId: string): Provider[] {
    // First try to find the model by its ID
    let model = this.id(modelId);
    
    // If not found, try to find it by alias
    if (!model) {
      model = this.find(m => m.aliases?.includes(modelId));
    }
    
    if (!model) return [];
    
    return providersData.providers.filter((p: Provider) => 
      model!.providers.includes(p.id)
    );
  }
}

export const models = new AIModels(allModels);

export { creators };

