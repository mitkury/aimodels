import { describe, it, expect } from 'vitest';
// Import directly from the built distribution as a user would
import { models } from '../dist/index.js';

describe('aimodels package', () => {
  it('preserves organization IDs on public creator objects', () => {
    expect(models.id('gpt-5')?.creator?.id).toBe('openai');
    expect(models.orgs.find(org => org.id === 'openai')?.name).toBe('OpenAI');
    expect(models.getCreator('openai')?.id).toBe('openai');
    expect(models.getProvider('does-not-exist')).toBeUndefined();
    expect(models.creators.every(creator => models.fromCreator(creator.id).length > 0)).toBe(true);
    expect(models.activeProviders.every(provider => models.fromProvider(provider.id).length > 0)).toBe(
      true
    );
  });

  it('resolves canonical model IDs for each provider', () => {
    const model = models.id('gpt-5.1');

    expect(model?.idFor('openai')).toBe('gpt-5.1');
    expect(model?.idFor('openrouter')).toBe('openai/gpt-5.1');
    expect(models.resolveModelIdForProvider('gpt-5.1', 'openrouter')).toBe(
      'openai/gpt-5.1'
    );
    expect(models.fromProviderId('openrouter', 'openai/gpt-5.1')?.id).toBe('gpt-5.1');
    expect(model?.idFor('anthropic')).toBeUndefined();
    expect(models.id('gpt-realtime-2.1')?.idFor('openrouter')).toBeUndefined();
    expect(models.id('claude-sonnet-4-5-20250929')?.idFor('openrouter')).toBe(
      'anthropic/claude-sonnet-4.5'
    );
    expect(models.id('gemini-2.5-pro-preview-06-05')?.idFor('openrouter')).toBe(
      'google/gemini-2.5-pro-preview'
    );
    expect(models.id('lyria-3-pro-preview')?.idFor('openrouter')).toBe(
      'google/lyria-3-pro-preview'
    );
    expect(models.id('meta-models/Muse-Glimmer-30B')?.idFor('openrouter')).toBe(
      'meta/muse-glimmer-30b'
    );
    expect(models.id('nvidia/nemotron-3.5-lightning-30b-a3b')?.idFor('openrouter')).toBe(
      'nvidia/nemotron-3.5-lightning'
    );
    expect(models.id('Qwen/Qwen3.8-2.4T-A95B')?.idFor('openrouter')).toBe(
      'qwen/qwen3.8-2.4t-a95b'
    );
    expect(models.id('thinkingmachines/Inkling-Small')?.idFor('openrouter')).toBe(
      'thinkingmachines/inkling-small'
    );
    expect(models.id('grok-4.6')?.idFor('openrouter')).toBe('x-ai/grok-4.6');
    expect(models.id('muse-spark-1.2')?.idFor('meta')).toBe('muse-spark-1.2');
    expect(models.id('claude-opus-5')?.idFor('bedrock')).toBe('anthropic.claude-opus-5');
  });

  it('exposes release dates when the source publishes them', () => {
    expect(models.id('gpt-5.6-sol')?.releasedAt).toBe('2026-06-26');
  });

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
    expect(typeof models.providers).toBe('object');
    
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
    const model = models.id('gpt-5.1');
    
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
