import type { ModelPrice } from './pricing.ts';
import type { Capability } from './capabilities.ts';

export class ModelCollection extends Array<Model> {
  /** Create a new ModelCollection from an array of models */
  constructor(models: Model[] = []) {
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

  /** Find a model by its ID */
  id(modelId: string): Model | undefined {
    return this.find(model => model.id === modelId);
  }

  /** Get models available from a specific provider */
  fromProvider(provider: string): ModelCollection {
    return this.filter(model => model.providers.includes(provider));
  }

  /** Filter models by minimum context window size */
  withMinContext(tokens: number): ModelCollection {
    return this.filter(model => model.context.total >= tokens);
  }
}

export interface ModelContext {
  /** Maximum total tokens (input + output) */
  total: number;
  /** Maximum output tokens */
  maxOutput: number;
}

export interface Model {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** License type (e.g., "proprietary", "apache-2.0", "llama-2-community") */
  license: string;
  /** List of providers that can serve this model */
  providers: string[];
  /** Model capabilities */
  can: Capability[];
  /** Languages the model knows */
  languages?: string[];
  /** Context window information */
  context: ModelContext;
}

export interface ModelsAPI {
  /** All available models */
  all: ModelCollection;
  /** List of all creators */
  creators: string[];
  /** List of all providers */
  providers: string[];
  /** Get models from a specific creator */
  fromCreator(creator: string): ModelCollection;
  /** Get models from a specific provider */
  fromProvider(provider: string): ModelCollection;
  /** Find a specific model by ID */
  find(id: string): Model | undefined;
  /** Filter models by one or more capabilities (all must be present) */
  can(...capabilities: string[]): ModelCollection;
  /** Filter models by minimum context window */
  withMinContext(tokens: number): ModelCollection;
  /** Get pricing for a model from a specific provider */
  getPrice(modelId: string, provider: string): ModelPrice | undefined;
}
