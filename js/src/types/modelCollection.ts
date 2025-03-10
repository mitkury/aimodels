import type { Provider, ProviderSource } from './provider';
import type { Organization } from './organization';
import { Model } from './model';
import { Capability } from './capabilities';
import { ModelSource } from './modelSource';

export class ModelCollection extends Array<Model> {
  // Static data stores - accessible from Model
  public static providersData: Record<string, ProviderSource> = {};
  public static orgsData: Record<string, Organization> = {};
  public static modelSources: Record<string, ModelSource> = {};

  /** Create a new ModelCollection from an array of models */
  constructor(
    models: Model[] = []
  ) {
    super();
    if (models.length > 0) {
      this.push(...models);
    }
    Object.setPrototypeOf(this, ModelCollection.prototype);
  }

  /** Set the shared providers data */
  static setProviders(providers: Record<string, Provider>): void {
    ModelCollection.providersData = providers;
  }

  /** Set the shared creators data */
  static setOrgs(orgs: Record<string, Organization>): void {
    ModelCollection.orgsData = orgs;
  }

  /** Filter models by one or more capabilities (all must be present) */
  can(...capabilities: Capability[]): ModelCollection {
    return this.filter(model => capabilities.every(cap => model.capabilities.includes(cap)));
  }

  /** 
   * Fluent capability filters for better readability 
   * Each method filters models by a specific capability
   */

  // Basic capabilities
  canChat(): ModelCollection {
    return this.can("chat");
  }

  canReason(): ModelCollection {
    return this.can("reason");
  }

  // Text capabilities
  canRead(): ModelCollection {
    return this.can("txt-in");
  }

  canWrite(): ModelCollection {
    return this.can("txt-out");
  }

  // Image capabilities
  canSee(): ModelCollection {
    return this.can("img-in");
  }

  canGenerateImages(): ModelCollection {
    return this.can("img-out");
  }

  // Audio capabilities
  canHear(): ModelCollection {
    return this.can("audio-in");
  }

  canSpeak(): ModelCollection {
    return this.can("audio-out");
  }

  // Output capabilities
  canOutputJSON(): ModelCollection {
    return this.can("json-out");
  }

  canCallFunctions(): ModelCollection {
    return this.can("fn-out");
  }

  canGenerateEmbeddings(): ModelCollection {
    return this.can("vec-out");
  }

  /** Filter models by one or more languages (all must be supported) */
  know(...languages: string[]): ModelCollection {
    return this.filter(model => languages.every(lang => model.languages?.includes(lang)));
  }

  /** Override array filter to return ModelCollection */
  override filter(predicate: (value: Model, index: number, array: Model[]) => boolean): ModelCollection {
    const filtered = Array.from(this).filter(predicate);
    return new ModelCollection(filtered);
  }

  /** Override array slice to return ModelCollection */
  override slice(start?: number, end?: number): ModelCollection {
    const sliced = Array.from(this).slice(start, end);
    return new ModelCollection(sliced);
  }

  /** Find a model by its ID or alias */
  id(modelId: string): Model | undefined {
    return this.find(model =>
      model.id === modelId ||
      model.aliases?.includes(modelId)
    );
  }

  /** Get models available from a specific provider */
  fromProvider(provider: string): ModelCollection {
    return this.filter(model => model.providerIds.includes(provider));
  }

  /** Get models available from a specific creator */
  fromCreator(creator: string): ModelCollection {
    return new ModelCollection(
      this.filter(model => model.creatorId === creator)
    );
  }

  /** Filter models by minimum context window size */
  withMinContext(tokens: number): ModelCollection {
    return this.filter(model => {
      const context = model.context;
      if (context?.type !== "token" && context?.type !== "character") {
        return false;
      }
      if (context.total === null) {
        return false;
      }
      return context.total >= tokens;
    });
  }

  /** Get all providers from all models in the collection deduplicated */
  get providers(): Provider[] {
    const providerIds = [...new Set(this.flatMap(model => model.providerIds))];

    const providers = []
    for (const id of providerIds) {
      const provider = ModelCollection.providersData[id];
      const organization = ModelCollection.orgsData[id];
      providers.push({
        ...organization,
        ...provider
      });
    }
    return providers;
  }

  /** Get all orgs from all models in the collection deduplicated */
  get orgs(): Organization[] {
    // Extract creator IDs and filter out undefined values
    const creatorIds = [...new Set(this.map(model => model.creatorId).filter((id): id is string => id !== undefined))];

    // Map to organizations and filter out any that aren't found
    return creatorIds
      .map(id => ModelCollection.orgsData[id])
      .filter((c): c is Organization => c !== undefined);
  }

  /** Get a specific provider by ID */
  getProvider(id: string): Provider | undefined {
    const provider = ModelCollection.providersData[id];
    const organization = ModelCollection.orgsData[id];
    return {
      ...organization,
      ...provider
    };
  }

  /** Get a specific creator by ID */
  getCreator(id: string): Organization | undefined {
    return ModelCollection.orgsData[id];
  }

  /** Get providers for a specific model */
  getProvidersForModel(modelId: string): Provider[] {
    const model = this.id(modelId);
    if (!model || !model.providerIds) return [];
    return model.providerIds
      .map(id => ModelCollection.providersData[id])
      .filter((p): p is Provider => p !== undefined);
  }

  /** Get creator for a specific model */
  getCreatorForModel(modelId: string): Organization | undefined {
    const model = this.id(modelId);
    if (!model || !model.creatorId) return undefined;
    return ModelCollection.orgsData[model.creatorId];
  }
}