import { ModelCollection } from './types/modelCollection';
import type { Provider } from './types/provider';
import type { Organization } from './types/organization';
import { Model, ModelSource } from './types';

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
  private constructor(models: Model[]) {
    super(models);
    // Ensure prototype methods are properly set
    Object.setPrototypeOf(this, AIModels.prototype);
  }

  /**
 * Add data to the static data containers
 * @param data Object containing model sources, providers, and organizations to add
 */
  static addStaticData({
    models = {},
    providers = {},
    orgs = {}
  }: {
    models?: Record<string, ModelSource>;
    providers?: Record<string, Provider>;
    orgs?: Record<string, Organization>;
  }): void {
    // Add new models
    ModelCollection.modelSources = {
      ...ModelCollection.modelSources,
      ...models
    };

    // Update the array in the singleton instance
    AIModels.instance.length = 0; // Clear existing array
    AIModels.instance.push(...Object.values(ModelCollection.modelSources).map(source => new Model(source)));

    // Add new providers
    ModelCollection.providersData = {
      ...ModelCollection.providersData,
      ...providers
    };

    // Add new organizations
    ModelCollection.orgsData = {
      ...ModelCollection.orgsData,
      ...orgs
    };
  }


  public static get instance(): AIModels {
    if (!AIModels._instance) {
      // We pass an empty array because we will add models later from the 'addStaticData' method
      AIModels._instance = new AIModels([]);
    }
    return AIModels._instance;
  }

  /** 
   * Override to return all providers directly without filtering through models.
   * We want to return all known providers here.
   */
  override get providers(): Provider[] {
    return Object.values(ModelCollection.providersData);
  }

  /**
   * Override to return all creators directly without filtering through models.
   * We want to return all known creators here.
   */
  override get orgs(): Organization[] {
    return Object.values(ModelCollection.orgsData);
  }
}

// Create and export the singleton instance
export const models = AIModels.instance;

