import type { Provider } from './types/index';
import type { Model } from './types/models';
import type { Creator } from './types/creators';
import { ModelCollection } from './types/models';

// Re-export types that users will need
export type { Model, ModelContext } from './types/models';
export type { Capability } from './types/capabilities';
export type { TokenBasedPricePerMillionTokens } from './types/pricing';
export type { Provider } from './types/providers';
export type { Creator } from './types/creators';
export { ModelCollection } from './types/models';

export class AIModels extends ModelCollection {
  constructor() {
    super([]);
  }

  // Add data directly to the instance
  addData(data: {
    models?: Record<string, Model>;
    providers?: Record<string, Provider>;
    orgs?: Record<string, Creator>;
  }): this {
    // Add models to the array if provided
    if (data.models) {
      this.push(...Object.values(data.models));
    }
    
    // Store providers if provided
    if (data.providers) {
      ModelCollection.setProviders(data.providers);
    }
    
    // Store organizations if provided
    if (data.orgs) {
      ModelCollection.setCreators(data.orgs);
    }
    
    return this;
  }
  
  get creators(): string[] {
    return Object.keys(this._creators);
  }

  get providers(): string[] {
    return Object.keys(this._providers);
  }
  
  /** 
   * Override to return all providers directly without filtering through models.
   * We want to return all known providers here.
   */
  override getProviders(): Provider[] {
    return Object.values(this._providers);
  }
  
  /**
   * Override to return all creators directly without filtering through models.
   * We want to return all known creators here.
   */
  override getCreators(): Creator[] {
    return Object.values(this._creators);
  }
}

