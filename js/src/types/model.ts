import { Capability } from "./capabilities";
import { ModelContext } from "./modelContext";
import { ModelSource } from "./modelSource";
import { ModelCollection } from "./modelCollection";
import { Provider } from "./provider";
import { Organization } from "./organization";

/**
 * Enhanced Model class that provides functionality on top of raw model data.
 * Handles inheritance resolution and provides access to related objects.
 */
export class Model {
  // Reference to the source data
  private source: ModelSource;
  
  constructor(source: ModelSource) {
    this.source = source;
    // Register this source in the global registry
    ModelCollection.modelSources[source.id] = source;
  }
  
  // Basic property getters (direct from source)
  get id(): string {
    return this.source.id;
  }
  
  get extends(): string | undefined {
    return this.source.extends;
  }
  
  get overrides(): Partial<ModelSource> | undefined {
    return this.source.overrides;
  }
  
  // Helper method to resolve a property through the inheritance chain
  private resolveProperty<T>(propertyName: keyof ModelSource): T | undefined {
    // Check if this model has the property directly
    if (this.source[propertyName] !== undefined) {
      return this.source[propertyName] as unknown as T;
    }
    
    // Check if it's in the overrides
    if (this.source.overrides && propertyName in this.source.overrides) {
      return this.source.overrides[propertyName as keyof typeof this.source.overrides] as unknown as T;
    }
    
    // If not, check if this model extends another
    if (this.source.extends) {
      const baseSource = ModelCollection.modelSources[this.source.extends];
      if (baseSource) {
        // Create a temporary Model to access the base model's properties
        const baseModel = new Model(baseSource);
        // Recursively resolve from the base model
        return baseModel.resolveProperty<T>(propertyName);
      }
    }
    
    return undefined;
  }
  
  // Enhanced property getters (with inheritance resolution)
  get name(): string {
    return this.resolveProperty<string>('name') || this.id;
  }
  
  get can(): Capability[] {
    return this.resolveProperty<Capability[]>('can') || [];
  }
  
  get context(): ModelContext | undefined {
    return this.resolveProperty<ModelContext>('context');
  }
  
  get license(): string | undefined {
    return this.resolveProperty<string>('license');
  }
  
  get languages(): string[] | undefined {
    return this.resolveProperty<string[]>('languages');
  }
  
  get aliases(): string[] | undefined {
    return this.resolveProperty<string[]>('aliases');
  }
  
  // Getters for related objects
  get providerIds(): string[] {
    return this.resolveProperty<string[]>('providerIds') || [];
  }
  
  get providers(): Provider[] {
    return this.providerIds
      .map(id => ModelCollection.providersData[id])
      .filter(Boolean);
  }
  
  get creatorId(): string | undefined {
    return this.resolveProperty<string>('creatorId');
  }
  
  get creator(): Organization | undefined {
    const id = this.creatorId;
    return id ? ModelCollection.orgsData[id] : undefined;
  }
}