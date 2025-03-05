import type { TokenBasedPricePerMillionTokens, Provider } from './types/index.ts';
import type { Model } from './types/models.ts';
import type { Creator } from './types/creators.ts';
import { ModelCollection } from './types/models.ts';

// Re-export types that users will need
export type { Model, ModelContext } from './types/models.ts';
export type { Capability } from './types/capabilities.ts';
export type { TokenBasedPricePerMillionTokens } from './types/pricing.ts';
export type { Provider } from './types/providers.ts';
export type { Creator } from './types/creators.ts';
export { ModelCollection } from './types/models.ts';

// Import pre-built data
import { models as prebuiltModels, providers as prebuiltProviders, organizations as prebuiltOrgs } from '../dist/data';

export class AIModels extends ModelCollection {
  constructor(models: Model[] = Object.values(prebuiltModels)) {
    super(models);
    Object.setPrototypeOf(this, AIModels.prototype);
  }

  get creators(): string[] {
    return Object.keys(prebuiltOrgs);
  }

  get providers(): string[] {
    return Object.keys(prebuiltProviders);
  }

  getPrice(modelId: string, provider: string): TokenBasedPricePerMillionTokens | undefined {
    const providerData = prebuiltProviders[provider];
    const price = providerData?.pricing[modelId];
    return price?.type === 'token' ? price : undefined;
  }

  /** Get provider information by ID */
  override getProvider(providerId: string): Provider | undefined {
    return prebuiltProviders[providerId];
  }

  /** Get all providers that can serve a specific model */
  override getProvidersForModel(modelId: string): Provider[] {
    // First try to find the model by its ID
    let model = this.id(modelId);
    
    // If not found, try to find it by alias
    if (!model) {
      model = this.find(m => m.aliases?.includes(modelId));
    }
    
    if (!model) return [];
    
    return model.providers
      .map(id => prebuiltProviders[id])
      .filter((p): p is Provider => p !== undefined);
  }
}

export const models = new AIModels();

export { prebuiltOrgs as creators };

