import { describe, it, expect } from 'vitest';
import { models } from '../dist/index.js';
import type { TokenContext } from '../src/types/models';

describe('AI Models Specific Domain Tests', () => {
  // Test models by capability categories
  describe('Multimodal Models', () => {
    it('finds models with text, image, and audio capabilities', () => {
      // Multimodal models should support text and at least one other modality
      const visionModels = models.canChat().canSee();
      const audioCapableModels = models.canChat().canHear();
      const fullMultimodal = models.canChat().canSee().canHear();

      expect(visionModels.length).toBeGreaterThan(0);
      expect(audioCapableModels.length).toBeGreaterThan(0);
      
      console.log(`Vision-capable models: ${visionModels.length}`);
      console.log(`Audio-capable models: ${audioCapableModels.length}`);
      console.log(`Full multimodal models: ${fullMultimodal.length}`);
      
      if (visionModels.length > 0) {
        console.log('Top 3 vision-capable models:', visionModels.slice(0, 3).map(m => m.id));
      }
    });
  });

  describe('Reasoning Models', () => {
    it('finds models with reasoning capabilities', () => {
      const reasoningModels = models.canReason();
      expect(reasoningModels.length).toBeGreaterThan(0);
      
      console.log(`Models with reasoning capabilities: ${reasoningModels.length}`);
      if (reasoningModels.length > 0) {
        console.log('Top 3 reasoning models:', reasoningModels.slice(0, 3).map(m => m.id));
      }
    });

    it('finds advanced models with both reasoning and function calling', () => {
      const advancedModels = models.canReason().canCallFunctions();
      expect(advancedModels.length).toBeGreaterThan(0);
      
      console.log(`Models with reasoning and function calling: ${advancedModels.length}`);
    });
  });

  describe('Image Generation Models', () => {
    it('finds models that can generate images', () => {
      const imageGenerators = models.canGenerateImages();
      expect(imageGenerators.length).toBeGreaterThan(0);
      
      console.log(`Image generation models: ${imageGenerators.length}`);
      if (imageGenerators.length > 0) {
        console.log('Image generation models:', imageGenerators.slice(0, 3).map(m => m.id));
      }
    });
  });

  describe('Context Window Sizes', () => {
    it('identifies models with context window information', () => {
      // Find all models with token-based context windows
      const tokenBasedModels = models.filter(m => 
        m.context && 
        m.context.type === 'token'
      );
      
      // Log some models with their context window sizes
      console.log(`Models with token-based context window: ${tokenBasedModels.length}`);
      
      if (tokenBasedModels.length > 0) {
        const sampleModels = tokenBasedModels.slice(0, 3);
        sampleModels.forEach(model => {
          const tokenContext = model.context as TokenContext;
          console.log(`- ${model.id}: ${tokenContext.total || 'unknown'} tokens`);
        });
      }
      
      // Test passes as long as we have at least some information
      expect(tokenBasedModels.length).toBeGreaterThan(0);
      
      // More descriptive information about models without context data
      const modelsWithoutContext = models.filter(m => 
        !m.context || 
        !m.context.type ||
        (m.context.type === 'token' && (m.context as TokenContext).total === null)
      );
      
      if (modelsWithoutContext.length > 0) {
        console.log(`Models without complete context information: ${modelsWithoutContext.length}`);
        console.log(`Examples: ${modelsWithoutContext.slice(0, 3).map(m => m.id)}`);
      }
    });
  });

  describe('Specialized Models', () => {
    it('finds models that support structured output (JSON)', () => {
      const jsonModels = models.canOutputJSON();
      expect(jsonModels.length).toBeGreaterThan(0);
      
      console.log(`Models supporting JSON output: ${jsonModels.length}`);
    });

    it('finds embedding models', () => {
      const embeddingModels = models.canGenerateEmbeddings();
      expect(embeddingModels.length).toBeGreaterThan(0);
      
      console.log(`Embedding models: ${embeddingModels.length}`);
    });
  });

  describe('Cross Provider Tests', () => {
    it('finds equivalent models across different providers', () => {
      // Models that are available from multiple providers
      const multiProviderModels = models.filter(model => model.providers.length > 1);
      
      console.log(`Models available from multiple providers: ${multiProviderModels.length}`);
      if (multiProviderModels.length > 0) {
        console.log('Examples of multi-provider models:');
        multiProviderModels.slice(0, 3).forEach(model => {
          console.log(`- ${model.id} is available from: ${model.providerIds.join(', ')}`);
        });
      }
      
      expect(multiProviderModels.length).toBeGreaterThan(0);
    });
  });

  describe('Inherited Identity Metadata', () => {
    it('keeps release dates on the extending model', () => {
      expect(models.id('grok-imagine-video-1.5')?.releasedAt).toBe('2026-06-16');
    });

    it('does not inherit aliases from a base model', () => {
      expect(models.id('kimi-k2-thinking')?.aliases).toBeUndefined();
      expect(models.id('kimi-k2')?.id).toBe('kimi-k2-0905-preview');
    });

    it('has no ambiguous aliases', () => {
      const owners = new Map<string, string>();

      for (const model of models) {
        for (const alias of model.aliases ?? []) {
          expect(owners.get(alias), `alias '${alias}' is shared by multiple models`).toBeUndefined();
          owners.set(alias, model.id);
        }
      }
    });
  });
});
