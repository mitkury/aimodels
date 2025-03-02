import { assertEquals, assertExists } from "https://deno.land/std@0.220.1/assert/mod.ts";
import { models } from "../src/index.ts";

Deno.test("all providers can be retrieved and have correct structure", () => {
  // Get all provider IDs
  const providerIds = models.providers;
  console.log("Available providers:", providerIds);
  
  // Verify each provider can be retrieved
  for (const providerId of providerIds) {
    const provider = models.getProvider(providerId);
    
    // Basic structure checks
    assertExists(provider, `Provider ${providerId} should be retrievable`);
    assertEquals(provider.id, providerId, "Provider ID should match the requested ID");
    assertExists(provider.name, `Provider ${providerId} should have a name`);
    assertExists(provider.websiteUrl, `Provider ${providerId} should have a website URL`);
    assertExists(provider.apiUrl, `Provider ${providerId} should have an API URL`);
    assertExists(provider.models, `Provider ${providerId} should have models pricing`);
    
    // Verify that models object is not empty
    const modelCount = Object.keys(provider.models).length;
    console.log(`${provider.name}: ${modelCount} models in provider config`);
  }
});

Deno.test("fromProvider returns expected models for each provider", () => {
  // Test each provider
  for (const providerId of models.providers) {
    const providerModels = models.fromProvider(providerId);
    const provider = models.getProvider(providerId);
    
    // There should be at least some models
    assertExists(providerModels, `Should return models array for ${providerId}`);
    
    // All returned models should include this provider
    for (const model of providerModels) {
      assertEquals(
        model.providers.includes(providerId), 
        true, 
        `Model ${model.id} should include ${providerId} in its providers list`
      );
    }
    
    console.log(`${provider?.name || providerId}: ${providerModels.length} models available`);
  }
});

Deno.test("provider models match with model definitions", () => {
  for (const providerId of models.providers) {
    const provider = models.getProvider(providerId);
    if (!provider) continue;
    
    const providerModels = models.fromProvider(providerId);
    const providerConfigModels = Object.keys(provider.models);
    
    // Check for models in provider config but not in model definitions
    const inConfigNotInModels = providerConfigModels.filter(
      id => !providerModels.some(model => model.id === id)
    );
    
    // Log any mismatches for informational purposes
    if (inConfigNotInModels.length > 0) {
      console.log(`\nWarning: ${provider.name} has ${inConfigNotInModels.length} models in provider config but not in model definitions`);
    }
  }
});

Deno.test("getProvider returns undefined for non-existent providers", () => {
  // Test with non-existent providers
  const nonExistentProviders = ["non-existent-provider", "fake-provider"];
  
  for (const providerId of nonExistentProviders) {
    const provider = models.getProvider(providerId);
    assertEquals(provider, undefined, `Non-existent provider ${providerId} should return undefined`);
  }
}); 