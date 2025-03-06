import { describe, it, expect } from 'vitest';
// Import directly from the built distribution as a user would
import { models } from '../dist/index.js';

describe('aimodels package', () => {
  it('exports a models object with fluent API methods', () => {
    expect(models).toBeDefined();
    expect(typeof models).toBe('object');
    // Check for fluent API methods
    expect(typeof models.canChat).toBe('function');
    expect(typeof models.canSee).toBe('function');
    expect(typeof models.fromProvider).toBe('function');
    expect(typeof models.fromCreator).toBe('function');
    expect(typeof models.id).toBe('function');
  });

  it('has models loaded', () => {
    // Check how many models we have in total
    console.log('Total models:', models.length);
    expect(models.length).toBeGreaterThan(0);
    
    // Check what providers we have
    const uniqueProviders = new Set<string>();
    models.forEach((model: any) => {
      model.providers.forEach((provider: string) => uniqueProviders.add(provider));
    });
    console.log('Available providers:', [...uniqueProviders]);
  });

  it('filters models by capability', () => {
    const chatModels = models.canChat();
    expect(Array.isArray(chatModels)).toBe(true);
  });

  it('filters models by provider', () => {
    const openaiModels = models.fromProvider('openai');
    expect(Array.isArray(openaiModels)).toBe(true);
    // Check that we have at least one model from OpenAI
    expect(openaiModels.length).toBeGreaterThan(0);
    // Log the first model for debugging
    if (openaiModels.length > 0) {
      console.log('First OpenAI model:', openaiModels[0].id);
    }
  });

  it('filters models by creator', () => {
    const metaModels = models.fromCreator('meta');
    expect(Array.isArray(metaModels)).toBe(true);
  });

  it('filters models by context window', () => {
    const largeContextModels = models.withMinContext(8192);
    expect(Array.isArray(largeContextModels)).toBe(true);
  });

  it('supports method chaining for advanced filtering', () => {
    // This tests the fluent API chaining capability
    const chatModelsWithJson = models.canChat().can('json-out');
    expect(Array.isArray(chatModelsWithJson)).toBe(true);

    // Check that we have at least one model that supports JSON output
    expect(chatModelsWithJson.length).toBeGreaterThan(0);
    // Log the first model for debugging
    if (chatModelsWithJson.length > 0) {
      console.log('First model that supports JSON output:', chatModelsWithJson[0].id);
    }
  });
}); 