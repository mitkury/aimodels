import type { ModelPrice } from './pricing.ts';
import type { Capability } from './capabilities.ts';

export class ModelCollection extends Array<Model> {
  constructor(models: Model[]) {
    super(...models);
    Object.setPrototypeOf(this, ModelCollection.prototype);
  }

  can(...capabilities: Capability[]): ModelCollection {
    return new ModelCollection(
      this.filter(model => capabilities.every(cap => model.can.includes(cap)))
    );
  }

  know(...languages: string[]): ModelCollection {
    return new ModelCollection(
      this.filter(model => languages.every(lang => model.languages?.includes(lang)))
    );
  }

  // Override array methods to return ModelCollection
  override filter(predicate: (value: Model, index: number, array: Model[]) => boolean): ModelCollection {
    return new ModelCollection(super.filter(predicate));
  }

  override slice(start?: number, end?: number): ModelCollection {
    return new ModelCollection(super.slice(start, end));
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
