# Enhanced Model System

## Overview

This specification proposes a new architecture for the model system that separates data storage from runtime functionality and automatically resolves inherited properties.

## Problem Statement

Current limitations:
- Model inheritance is not automatically resolved
- No direct access to related Provider and Organization objects
- Inconsistent property access between direct and inherited properties
- Limited API for common operations

## Proposed Solution

**Key innovation**: Split the model system into two parts:
1. `ModelSource`: Raw data interface matching JSON file structure
2. `Model`: Enhanced class that wraps a ModelSource and provides functionality

Benefits:
- Clean separation between data and functionality
- Transparent property inheritance resolution 
- Consistent property access via getters
- Direct access to related objects

## Implementation Details

### 1. ModelSource Interface

```typescript
/** Raw model data directly from source files */
export interface ModelSource {
  id: string;
  name?: string;
  can?: Capability[];
  providerIds?: string[];
  context?: ModelContext;
  creatorId?: string;
  license?: string;
  languages?: string[];
  aliases?: string[];
  extends?: string;
  overrides?: Partial<Omit<ModelSource, 'id' | 'extends' | 'overrides'>>;
}
```

### 2. Shared Data Store

```typescript
export class ModelCollection extends Array<Model> {
  // Shared data stores
  public static providersData: Record<string, Provider> = {};
  public static orgsData: Record<string, Organization> = {};
  public static modelSources: Record<string, ModelSource> = {};
  
  // Methods...
}
```

### 3. Enhanced Model Class

```typescript
export class Model {
  private source: ModelSource;
  
  constructor(source: ModelSource) {
    this.source = source;
    ModelCollection.modelSources[source.id] = source;
  }
  
  // Basic property getters
  get id(): string { return this.source.id; }
  get extends(): string | undefined { return this.source.extends; }
  
  // Property resolution with inheritance
  private resolveProperty<T>(propertyName: keyof ModelSource): T | undefined {
    // Check direct property
    if (this.source[propertyName] !== undefined) {
      return this.source[propertyName] as unknown as T;
    }
    
    // Check overrides
    if (this.source.overrides && this.source.overrides[propertyName] !== undefined) {
      return this.source.overrides[propertyName] as unknown as T;
    }
    
    // Check base model
    if (this.source.extends) {
      const baseSource = ModelCollection.modelSources[this.source.extends];
      if (baseSource) {
        return new Model(baseSource).resolveProperty<T>(propertyName);
      }
    }
    
    return undefined;
  }
  
  // Property getters with inheritance resolution
  get name(): string { return this.resolveProperty<string>('name') || this.id; }
  get can(): Capability[] { return this.resolveProperty<Capability[]>('can') || []; }
  get context(): ModelContext | undefined { return this.resolveProperty<ModelContext>('context'); }
  get license(): string | undefined { return this.resolveProperty<string>('license'); }
  get languages(): string[] | undefined { return this.resolveProperty<string[]>('languages'); }
  get aliases(): string[] | undefined { return this.resolveProperty<string[]>('aliases'); }
  
  // Related object getters
  get providerIds(): string[] { return this.resolveProperty<string[]>('providerIds') || []; }
  get providers(): Provider[] {
    return this.providerIds
      .map(id => ModelCollection.providersData[id])
      .filter(Boolean);
  }
  
  get creatorId(): string | undefined { return this.resolveProperty<string>('creatorId'); }
  get creator(): Organization | undefined {
    const id = this.creatorId;
    return id ? ModelCollection.orgsData[id] : undefined;
  }
}
```

### 4. Usage Example

```typescript
// Initialize system
const sources = loadModelSources();
ModelCollection.providersData = loadProviders();
ModelCollection.orgsData = loadOrganizations();

// Create model collection
const models = ModelCollection.fromSources(sources);

// Use the enhanced API
const gpt4 = models.id('gpt-4');
console.log(gpt4.name);         // Property with inheritance resolution
console.log(gpt4.providers);    // Related objects
console.log(gpt4.creator.name); // Nested related objects
```

## Benefits

- **Data/functionality separation**: ModelSource is pure data, Model adds behavior
- **Transparent inheritance**: All properties automatically resolve through inheritance
- **Consistent API**: All properties accessed via getters with consistent behavior
- **Original data preserved**: Source data remains unmodified

## Next Steps

1. Implement interfaces and base classes
2. Update existing code to use the new Model class
3. Create tests for inheritance resolution
4. Update documentation 