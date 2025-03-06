import { describe, it, expect } from 'vitest';
// Import directly from the built distribution as a user would
import { models } from '../dist/index.js';

describe('aimodels package', () => {
  it('exports a models object with fluent API methods', () => {
    expect(models).toBeDefined();
    expect(typeof models).toBe('object');
    expect(models.length).toBeGreaterThan(0);
    
    // Check for the presence of all expected API methods
    // This verifies the public API contract
    
    // Core utilities
    expect(typeof models.id).toBe('function');
    expect(typeof models.fromProvider).toBe('function');
    expect(typeof models.fromCreator).toBe('function');
    expect(typeof models.withMinContext).toBe('function');
    expect(typeof models.can).toBe('function');
    expect(typeof models.getProvider).toBe('function');
    expect(typeof models.getProviders).toBe('function');
    
    // Fluent capability API methods
    expect(typeof models.canChat).toBe('function');
    expect(typeof models.canRead).toBe('function');
    expect(typeof models.canWrite).toBe('function');
    expect(typeof models.canReason).toBe('function');
    expect(typeof models.canSee).toBe('function');
    expect(typeof models.canGenerateImages).toBe('function');
    expect(typeof models.canHear).toBe('function');
    expect(typeof models.canSpeak).toBe('function');
    expect(typeof models.canOutputJSON).toBe('function');
    expect(typeof models.canCallFunctions).toBe('function');
    expect(typeof models.canGenerateEmbeddings).toBe('function');
    
    // Array-like methods
    expect(typeof models.filter).toBe('function');
    expect(typeof models.map).toBe('function');
    expect(typeof models.forEach).toBe('function');
    expect(typeof models.slice).toBe('function');
  });
  
  it('verifies API works as documented in README', () => {
    // Based on README examples - make sure the basic API works
    const chatModels = models.canChat();
    const multimodalModels = models.canChat().canSee();
    const openaiModels = models.fromProvider('openai');
    const model = models.id('gpt-4');
    
    // Just verify the calls return results in expected format
    expect(Array.isArray(chatModels)).toBe(true);
    expect(Array.isArray(multimodalModels)).toBe(true);
    expect(Array.isArray(openaiModels)).toBe(true);
    
    // Verify a specific model can be found
    if (model) {
      expect(typeof model.context).toBe('object');
      expect(Array.isArray(model.providers)).toBe(true);
    }
  });
}); 