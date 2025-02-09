import type { ModelPrice } from './pricing';

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
  /** Context window information */
  context: ModelContext;
}

export interface ModelCollection {
  /** All available models */
  all: Model[];
  /** List of all creators */
  creators: string[];
  /** List of all providers */
  providers: string[];
  /** Get models from a specific creator */
  fromCreator(creator: string): Model[];
  /** Get models from a specific provider */
  fromProvider(provider: string): Model[];
  /** Find a specific model by ID */
  find(id: string): Model | undefined;
  /** Filter models by one or more capabilities (all must be present) */
  can(...capabilities: string[]): Model[];
  /** Filter models by minimum context window */
  withMinContext(tokens: number): Model[];
  /** Get pricing for a model from a specific provider */
  getPrice(modelId: string, provider: string): ModelPrice | undefined;
}
