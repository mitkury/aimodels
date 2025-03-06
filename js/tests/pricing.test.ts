import { describe, it, expect } from 'vitest';
import { models } from '../dist/index.js';
import type { TokenBasedPricePerMillionTokens, ImagePrice } from '../src/types/pricing';

describe('AI Model Pricing Tests', () => {
  // Collect model information
  const modelsWithMultipleProviders = models.filter(model => model.providers.length > 1);
  
  describe('Pricing Data Exploration', () => {
    it('explores available pricing information', () => {
      // Get a sample of providers
      const uniqueProviderIds = new Set<string>();
      models.forEach(model => {
        model.providers.forEach(provider => uniqueProviderIds.add(provider));
      });
      const providerIds = Array.from(uniqueProviderIds).slice(0, 5); // Sample 5 providers
      
      console.log('Checking pricing data for providers:', providerIds);
      
      // Go through each provider and check what pricing data is available
      let providersWithPricing = 0;
      
      providerIds.forEach(providerId => {
        const provider = models.getProvider(providerId);
        console.log(`Provider ${providerId}:`);
        
        if (provider) {
          // Check if pricing data exists
          if (provider.pricing && Object.keys(provider.pricing).length > 0) {
            providersWithPricing++;
            console.log(`- Has pricing data for ${Object.keys(provider.pricing).length} models`);
            
            // Sample a model for detailed inspection
            const sampleModelId = Object.keys(provider.pricing)[0];
            const pricing = provider.pricing[sampleModelId];
            console.log(`- Sample pricing for ${sampleModelId}:`, pricing);
            
            // Log pricing types
            const pricingTypes = new Set<string>();
            Object.values(provider.pricing).forEach(p => {
              if (p && typeof p === 'object' && 'type' in p) {
                pricingTypes.add(p.type);
              }
            });
            
            console.log(`- Pricing types: ${Array.from(pricingTypes).join(', ')}`);
          } else {
            console.log('- No pricing data available');
          }
        } else {
          console.log('- Provider information not available');
        }
      });
      
      // This is an informational test, so we only log the results
      console.log(`Providers with pricing data: ${providersWithPricing} out of ${providerIds.length}`);
    });
  });

  describe('Cross-Provider Pricing', () => {
    it('compares prices for models available on multiple providers when data is available', () => {
      if (modelsWithMultipleProviders.length === 0) {
        console.log('No models available from multiple providers');
        return;
      }
      
      // Take a few sample models
      const sampleModels = modelsWithMultipleProviders.slice(0, 3);
      
      sampleModels.forEach(model => {
        console.log(`Model: ${model.name} (${model.id})`);
        console.log(`Available from: ${model.providers.join(', ')}`);
        
        // Try to find pricing from different providers
        const pricingByProvider: Record<string, any> = {};
        
        model.providers.forEach(providerId => {
          const provider = models.getProvider(providerId);
          if (provider && provider.pricing && model.id in provider.pricing) {
            pricingByProvider[providerId] = provider.pricing[model.id];
          }
        });
        
        if (Object.keys(pricingByProvider).length > 0) {
          console.log('Pricing comparison:');
          Object.entries(pricingByProvider).forEach(([providerId, pricing]) => {
            console.log(`- ${providerId}:`, pricing);
          });
        } else {
          console.log('No pricing data available for this model');
        }
        
        console.log('---');
      });
      
      // This is mainly for exploration and doesn't have specific assertions
    });
  });

  describe('Pricing Data Structure', () => {
    it('verifies token-based pricing structure when available', () => {
      // Find all token-based pricing data
      const tokenPricingData: Array<{ provider: string; model: string; pricing: TokenBasedPricePerMillionTokens }> = [];
      
      // Gather all available token pricing data
      const providers = models.getProviders();
      providers.forEach(provider => {
        if (provider.pricing) {
          Object.entries(provider.pricing).forEach(([modelId, pricing]) => {
            if (pricing && typeof pricing === 'object' && 'type' in pricing && pricing.type === 'token' && 'input' in pricing && 'output' in pricing) {
              tokenPricingData.push({
                provider: provider.id,
                model: modelId,
                pricing: pricing as TokenBasedPricePerMillionTokens
              });
            }
          });
        }
      });
      
      console.log(`Found ${tokenPricingData.length} token-based pricing entries`);
      
      // Check structure of token-based pricing if we have any
      if (tokenPricingData.length > 0) {
        const sample = tokenPricingData[0];
        console.log('Sample token pricing data:');
        console.log(`- Provider: ${sample.provider}`);
        console.log(`- Model: ${sample.model}`);
        console.log(`- Input price: $${sample.pricing.input} per million tokens`);
        console.log(`- Output price: $${sample.pricing.output} per million tokens`);
        
        // Verify the structure but don't assert on specific values
        expect(sample.pricing.type).toBe('token');
        expect(typeof sample.pricing.input).toBe('number');
        expect(typeof sample.pricing.output).toBe('number');
      }
      
      // Similarly for image-based pricing 
      const imagePricingData: Array<{ provider: string; model: string; pricing: ImagePrice }> = [];
      
      providers.forEach(provider => {
        if (provider.pricing) {
          Object.entries(provider.pricing).forEach(([modelId, pricing]) => {
            if (pricing && typeof pricing === 'object' && 'type' in pricing && pricing.type === 'image' && 'price' in pricing) {
              imagePricingData.push({
                provider: provider.id,
                model: modelId,
                pricing: pricing as ImagePrice
              });
            }
          });
        }
      });
      
      console.log(`Found ${imagePricingData.length} image-based pricing entries`);
      
      // Check structure of image-based pricing if we have any
      if (imagePricingData.length > 0) {
        const sample = imagePricingData[0];
        console.log('Sample image pricing data:');
        console.log(`- Provider: ${sample.provider}`);
        console.log(`- Model: ${sample.model}`);
        console.log(`- Price: $${sample.pricing.price} per image`);
        if ('size' in sample.pricing && sample.pricing.size) {
          console.log(`- Size: ${sample.pricing.size}`);
        }
        
        // Verify the structure but don't assert on specific values
        expect(sample.pricing.type).toBe('image');
        expect(typeof sample.pricing.price).toBe('number');
      }
    });
  });
}); 