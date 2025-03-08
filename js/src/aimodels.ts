import { Model } from './types/model';
import { ModelCollection } from './types/modelCollection';
import type { Provider } from './types/provider';
import type { Organization } from './types/organization';

/**
 * AIModels is a collection of AI models with associated metadata.
 * 
 * This class follows the singleton pattern with a private constructor and a static getter.
 * IMPORTANT: Do not instantiate this class directly. Instead, import the pre-configured
 * singleton instance from the package:
 * 
 * ```typescript
 * import { models } from 'aimodels';
 * ```
 * 
 * The singleton instance contains all the model data and is the recommended way to use this package.
 * If you need to access the class for type references, you can also import it:
 * 
 * ```typescript
 * import { AIModels, models } from 'aimodels';
 * ```
 */
export class AIModels extends ModelCollection {
  // Singleton instance
  private static _instance: AIModels | null = null;
  
  /**
   * @private
   * Private constructor used only by the static instance getter.
   * Users should import the pre-configured instance from the package.
   */
  private constructor() {
    super([]);
    // Ensure prototype methods are properly set
    Object.setPrototypeOf(this, AIModels.prototype);
  }
  
  public static get instance(): AIModels {
    if (!AIModels._instance) {
      AIModels._instance = new AIModels();
    }
    return AIModels._instance;
  }

  // Add data directly to the instance
  addData(data: {
    models?: Record<string, Model>;
    providers?: Record<string, Provider>;
    orgs?: Record<string, Organization>;
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
      ModelCollection.setOrgs(data.orgs);
    }
    
    return this;
  }
  
  get creators(): string[] {
    return Object.keys(this._orgs);
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
  override getCreators(): Organization[] {
    return Object.values(this._orgs);
  }
}

// Create and export the singleton instance
export const models = AIModels.instance;

