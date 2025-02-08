export interface ModelPricing {
  input: number;
  output: number;
}

export interface ModelSpec {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  capabilities: string[];
  pricing: ModelPricing;
  released: string;
  license?: string;
  trainingData?: string[];
  parameters?: number;
}

export interface ModelsCollection {
  /** All available models */
  all: ModelSpec[];
  /** List of all unique providers */
  providers: string[];
  /** Get models from a specific provider */
  from(provider: string): ModelSpec[];
  /** Find a specific model by ID */
  find(id: string): ModelSpec | undefined;
  /** Filter models by capability */
  withCapability(capability: string): ModelSpec[];
  /** Filter models by minimum context window */
  withMinContext(tokens: number): ModelSpec[];
  /** Filter models by maximum price (per 1K tokens) */
  withMaxPrice(price: number): ModelSpec[];
}
