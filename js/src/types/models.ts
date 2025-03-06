import type { Capability } from './capabilities';
import type { Provider } from './providers';
import type { Organization } from './organizations';

// Empty default data structures for development
// These will be replaced at runtime with actual data
export const prebuiltModels: Record<string, Model> = {};
export const prebuiltProviders: Record<string, Provider> = {};
export const prebuiltOrgs: Record<string, Organization> = {};

export class ModelCollection extends Array<Model> {
  /** Create a new ModelCollection from an array of models */
  constructor(models: Model[] = Object.values(prebuiltModels)) {
    super();
    if (models.length > 0) {
      this.push(...models);
    }
    Object.setPrototypeOf(this, ModelCollection.prototype);
  }

  /** Filter models by one or more capabilities (all must be present) */
  can(...capabilities: Capability[]): ModelCollection {
    return this.filter(model => capabilities.every(cap => model.can.includes(cap)));
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
    return this.filter(model => model.providers.includes(provider));
  }

  /** Get models available from a specific creator */
  fromCreator(creator: string): ModelCollection {
    return new ModelCollection(
      this.filter(model => model.creator === creator)
    );
  }

  /** Filter models by minimum context window size */
  withMinContext(tokens: number): ModelCollection {
    return this.filter(model => {
      const context = model.context;
      if (context.type !== "token" && context.type !== "character") {
        return false;
      }
      if (context.total === null) {
        return false;
      }
      return context.total >= tokens;
    });
  }

  /** Get all providers from all models in the collection deduplicated */
  getProviders(): Provider[] {
    const providerIds = [...new Set(this.flatMap(model => model.providers))];
    return providerIds.map(id => prebuiltProviders[id]).filter(Boolean);
  }

  /** Get all creators from all models in the collection deduplicated */
  getCreators(): Organization[] {
    const creatorIds = [...new Set(this.map(model => model.creator))];
    return creatorIds.map(id => prebuiltOrgs[id]).filter(Boolean);
  }

  /** Get a specific provider by ID */
  getProvider(id: string): Provider | undefined {
    return prebuiltProviders[id];
  }

  /** Get a specific creator by ID */
  getCreator(id: string): Organization | undefined {
    return prebuiltOrgs[id];
  }

  /** Get providers for a specific model */
  getProvidersForModel(modelId: string): Provider[] {
    const model = this.id(modelId);
    if (!model) return [];
    return model.providers.map(id => prebuiltProviders[id]).filter(Boolean);
  }

  /** Get creator for a specific model */
  getCreatorForModel(modelId: string): Organization | undefined {
    const model = this.id(modelId);
    if (!model) return undefined;
    return prebuiltOrgs[model.creator];
  }
}

export interface BaseContext {
  /** The type discriminator */
  type: string;
}

export interface TokenContext extends BaseContext {
  type: "token";
  /** Maximum input tokens the model can accept */
  total: number | null;
  /** Maximum tokens the model can generate in response */
  maxOutput: number | null;
  /** 
   * When set to 1, indicates the model can generate up to maxOutput tokens
   * regardless of input size (as long as input is within total limit).
   * When not set, available output tokens may be reduced based on input size.
   */
  outputIsFixed?: 1;
  /**
   * Extended capabilities beyond the standard model behavior.
   * This is a flexible object that can contain any properties or nested objects
   * related to model-specific extensions (e.g., reasoning, experimental features).
   */
  extended?: Record<string, any>;
}

export interface CharacterContext extends BaseContext {
  type: "character";
  /** Maximum input characters the model can accept */
  total: number | null;
  /** Maximum characters the model can generate in response */
  maxOutput: number | null;
}

export interface ImageContext extends BaseContext {
  type: "image";
  /** Maximum outputs per request */
  maxOutput: number;
  /** Available image sizes (e.g. "1024x1024") */
  sizes: string[];
  /** Available quality settings (e.g. "standard", "hd") */
  qualities: string[];
}

export interface AudioInputContext extends BaseContext {
  type: "audio-in";
  /** Maximum duration in seconds, null if unlimited */
  maxDuration?: number | null;
  /** Supported input formats */
  formats?: string[];
  /** Maximum file size in bytes */
  maxSize?: number | null;
}

export interface AudioOutputContext extends BaseContext {
  type: "audio-out";
  /** Maximum text length that can be converted to speech */
  maxInput?: number | null;
  /** Supported output formats */
  formats?: string[];
  /** Available voices */
  voices?: string[];
  /** Available quality settings */
  qualities?: string[];
}

export interface EmbeddingContext extends BaseContext {
  type: "embedding";
  /** Maximum input size */
  total: number;
  /** Unit of measurement for input */
  unit: "tokens" | "characters";
  /** Size of output embedding vectors */
  dimensions: number;
  /** Type of embeddings produced */
  embeddingType?: "text" | "image" | "audio" | "multimodal";
  /** Normalization of output vectors */
  normalized?: boolean;
}

export type ModelContext = 
  | TokenContext 
  | CharacterContext 
  | ImageContext 
  | AudioInputContext 
  | AudioOutputContext 
  | EmbeddingContext;

export interface Model {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Model capabilities */
  can: Capability[];
  /** Available providers */
  providers: string[];
  /** Context window information */
  context: ModelContext;
  /** Organization that created this model */
  creator: string;
  /** License type (e.g., "proprietary", "apache-2.0", "llama-2-community") */
  license: string;
  /** Languages the model knows */
  languages?: string[];
  /** Alternative identifiers for this model */
  aliases?: string[];
  /** Base model ID this model extends */
  extends?: string;
  /** Properties that override the base model */
  overrides?: Partial<Omit<Model, 'id' | 'extends' | 'overrides'>>;
}
