import type { ModelSpec, ModelsCollection } from './types';
import modelData from './data/models.json';

export * from './types';

const aimodels = modelData as ModelSpec[];

export const models: ModelsCollection = {
  all: aimodels,

  get providers(): string[] {
    return [...new Set(aimodels.map(model => model.provider))];
  },

  from(provider: string): ModelSpec[] {
    return aimodels.filter(model => model.provider === provider);
  },

  find(id: string): ModelSpec | undefined {
    return aimodels.find(model => model.id === id);
  },

  withCapability(capability: string): ModelSpec[] {
    return aimodels.filter(model => model.capabilities.includes(capability));
  },

  withMinContext(tokens: number): ModelSpec[] {
    return aimodels.filter(model => model.contextWindow >= tokens);
  },

  withMaxPrice(price: number): ModelSpec[] {
    return aimodels.filter(model => 
      model.pricing.input <= price && 
      model.pricing.output <= price
    );
  },
};
