import type { Model, ModelCollection } from '../types/models.ts';

export class ModelCollectionImpl extends Array<Model> implements ModelCollection {
  constructor(models: Model[]) {
    super(...models);
    Object.setPrototypeOf(this, ModelCollectionImpl.prototype);
  }

  can(...capabilities: string[]): ModelCollection {
    return new ModelCollectionImpl(
      this.filter(model => capabilities.every(cap => model.can.includes(cap)))
    );
  }

  know(...languages: string[]): ModelCollection {
    return new ModelCollectionImpl(
      this.filter(model => languages.every(lang => model.languages?.includes(lang)))
    );
  }

  // Override array methods to return ModelCollection
  override filter(predicate: (value: Model, index: number, array: Model[]) => boolean): ModelCollection {
    return new ModelCollectionImpl(super.filter(predicate));
  }

  override slice(start?: number, end?: number): ModelCollection {
    return new ModelCollectionImpl(super.slice(start, end));
  }
}
