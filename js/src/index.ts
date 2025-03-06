import type { TokenBasedPricePerMillionTokens, Provider } from './types/index.ts';
import type { Model } from './types/models.ts';
import type { Creator } from './types/creators.ts';
import { ModelCollection, prebuiltModels, prebuiltProviders, prebuiltOrgs } from './types/models.ts';

// Re-export types that users will need
export type { Model, ModelContext } from './types/models.ts';
export type { Capability } from './types/capabilities.ts';
export type { TokenBasedPricePerMillionTokens } from './types/pricing.ts';
export type { Provider } from './types/providers.ts';
export type { Creator } from './types/creators.ts';
export { ModelCollection } from './types/models.ts';

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

  /**
   * Static method to add model, provider, and organization data
   * This allows separating the API from the data and injecting it later
   */
  static addData(
    modelData: Record<string, Model>, 
    providerData: Record<string, Provider>, 
    orgData: Record<string, Creator>
  ): void {
    // Populate the prebuilt data containers
    Object.assign(prebuiltModels, modelData);
    Object.assign(prebuiltProviders, providerData);
    Object.assign(prebuiltOrgs, orgData);
  }
}

export const models = new AIModels();

export { prebuiltOrgs as creators };

