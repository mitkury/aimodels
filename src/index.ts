import type { ModelSpec, ModelsCollection } from './types';
import modelData from './data/models.json';

export * from './types';

const allModels = modelData as ModelSpec[];

export const models: ModelsCollection = {
  all: allModels,

  get providers(): string[] {
    return [...new Set(allModels.map(model => model.provider))];
  },

  from(provider: string): ModelSpec[] {
    return allModels.filter(model => model.provider === provider);
  },

  find(id: string): ModelSpec | undefined {
    return allModels.find(model => model.id === id);
  },

  withCapability(capability: string): ModelSpec[] {
    return allModels.filter(model => model.capabilities.includes(capability));
  },

  withMinContext(tokens: number): ModelSpec[] {
    return allModels.filter(model => model.contextWindow >= tokens);
  },

  withMaxPrice(price: number): ModelSpec[] {
    return allModels.filter(model => 
      model.pricing.input <= price && 
      model.pricing.output <= price
    );
  },
};
