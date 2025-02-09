import type { ModelPrice } from './pricing.ts';

export interface ModelCollection extends Array<Model> {
  // Chainable filters
  can(...capabilities: string[]): ModelCollection;
  know(...languages: string[]): ModelCollection;
  
  // Original array methods should return ModelCollection
  filter(predicate: (value: Model, index: number, array: Model[]) => boolean): ModelCollection;
  map<U>(callbackfn: (value: Model, index: number, array: Model[]) => U): U[];
  slice(start?: number, end?: number): ModelCollection;
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
  can: string[];
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
