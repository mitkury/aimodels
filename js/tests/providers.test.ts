import { describe, it, expect } from 'vitest';
import { models } from '../dist/index.js';

describe('AI Providers Specific Tests', () => {
  // Get all available providers
  const providers = (() => {
    const uniqueProviders = new Set<string>();
    models.forEach(model => {
      model.providers.forEach(provider => uniqueProviders.add(provider.id));
    });
    return Array.from(uniqueProviders);
  })();

  describe('Provider Availability', () => {
    it('has a variety of providers available', () => {
      console.log('Available providers:', providers);
      expect(providers.length).toBeGreaterThan(2); // Should have at least 3 providers
    });

    it('includes major providers', () => {
      const majorProviders = ['openai', 'anthropic', 'google'];
      const availableMajorProviders = majorProviders.filter(provider => 
        providers.includes(provider)
      );
      
      console.log('Available major providers:', availableMajorProviders);
      expect(availableMajorProviders.length).toBeGreaterThan(0);
    });
  });

  describe('Provider Model Offerings', () => {
    it('tests the number of models per provider', () => {
      // Create a map of provider -> number of models
      const providerModelCounts = providers.map(provider => {
        const providerModels = models.fromProvider(provider);
        return {
          provider,
          count: providerModels.length
        };
      }).sort((a, b) => b.count - a.count); // Sort by count desc
      
      console.log('Models per provider:');
      providerModelCounts.forEach(({ provider, count }) => {
        console.log(`- ${provider}: ${count} models`);
      });
      
      // Test that at least one provider has multiple models
      const providersWithMultipleModels = providerModelCounts.filter(p => p.count > 1);
      expect(providersWithMultipleModels.length).toBeGreaterThan(0);
    });
  });

  describe('Provider Capabilities', () => {
    it('identifies providers with multimodal capabilities', () => {
      // Find providers that offer multimodal models
      const modelsWithVision = models.canSee();
      const providersWithVision = [...new Set(modelsWithVision.flatMap(model => model.providerIds))];
      
      // Use fluent methods instead of manual filtering
      const modelsWithAudioIn = models.canHear();
      const modelsWithAudioOut = models.canSpeak();
      const providersWithAudio = [...new Set([
        ...modelsWithAudioIn.flatMap(model => model.providerIds),
        ...modelsWithAudioOut.flatMap(model => model.providerIds)
      ])];
      
      console.log('Providers with vision capabilities:', providersWithVision);
      console.log('Providers with audio capabilities:', providersWithAudio);
      
      expect(providersWithVision.length + providersWithAudio.length).toBeGreaterThan(0);
    });

    it('identifies providers with image generation capabilities', () => {
      // Use fluent method instead of manual filtering
      const modelsWithImageGen = models.canGenerateImages();
      const providersWithImageGen = [...new Set(modelsWithImageGen.flatMap(model => model.providerIds))];
      
      console.log('Providers with image generation capabilities:', providersWithImageGen);
      expect(providersWithImageGen.length).toBeGreaterThan(0);
    });
  });

  describe('Provider Information', () => {
    it('verifies basic provider data is available', () => {
      // Only verify that we can retrieve some provider information
      const providersData = providers.map(providerId => {
        const provider = models.getProvider(providerId);
        return { id: providerId, data: provider };
      });
      
      const providersWithData = providersData.filter(p => p.data !== undefined);
      console.log(`Providers with available data: ${providersWithData.length} out of ${providers.length}`);
      
      // Sample a few providers to inspect
      providersWithData.slice(0, 3).forEach(({ id, data }) => {
        if (data) {
          console.log(`Provider: ${data.name || id}`);
          // Only log what's available - no expectations on specific fields
          const fields = Object.keys(data);
          console.log(`- Available fields: ${fields.join(', ')}`);
          
          // Test that ID matches
          expect(data.id).toBe(id);
        }
      });
      
      // At least some providers should have data
      expect(providersWithData.length).toBeGreaterThan(0);
    });
  });

  describe('Local vs. Cloud Providers', () => {
    it('identifies local providers vs cloud providers', () => {
      // Local providers usually have the isLocal flag
      const localProviders = providers.filter(providerId => {
        const provider = models.getProvider(providerId);
        return provider && provider.isLocal === 1;
      });
      
      const cloudProviders = providers.filter(providerId => {
        const provider = models.getProvider(providerId);
        return provider && !provider.isLocal;
      });
      
      console.log('Local providers:', localProviders);
      console.log('Cloud providers:', cloudProviders);
      
      // We might not have any local providers, so just check that we have cloud ones
      expect(cloudProviders.length).toBeGreaterThan(0);
    });
  });
}); 