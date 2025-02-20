import { assertEquals, assertNotEquals, assertExists } from "https://deno.land/std@0.220.1/assert/mod.ts";
import { models } from "../src/index.ts";
import type { Model, Provider } from "../src/types/index.ts";

Deno.test("providers list contains major providers", () => {
  // Get unique providers from all models
  const providersList = Array.from(new Set(
    models.flatMap(model => model.providers)
  ));
  
  // Check for major providers
  assertEquals(providersList.includes("openai"), true, "Should include OpenAI");
  assertEquals(providersList.includes("anthropic"), true, "Should include Anthropic");
  assertEquals(providersList.includes("mistral"), true, "Should include Mistral");
});

Deno.test("fromProvider returns correct models", () => {
  // Test OpenAI models
  const openaiModels = models.fromProvider("openai");
  assertNotEquals(openaiModels.length, 0, "Should have OpenAI models");
  openaiModels.forEach((model: Model) => {
    assertEquals(
      model.providers.includes("openai"), 
      true, 
      `${model.name} should be from OpenAI`
    );
  });

  // Test Anthropic models
  const anthropicModels = models.fromProvider("anthropic");
  assertNotEquals(anthropicModels.length, 0, "Should have Anthropic models");
  anthropicModels.forEach((model: Model) => {
    assertEquals(
      model.providers.includes("anthropic"), 
      true, 
      `${model.name} should be from Anthropic`
    );
  });
});

Deno.test("getPrice returns correct pricing", () => {
  // Test GPT-4 pricing
  const gpt4Model = models.id("gpt-4o");
  assertEquals(gpt4Model?.providers.includes("openai"), true, "GPT-4 should be available from OpenAI");
  
  // Test Claude pricing
  const claudeModel = models.id("claude-3-opus-20240229");
  assertEquals(claudeModel?.providers.includes("anthropic"), true, "Claude should be available from Anthropic");
  
  // Test non-existent model
  const nonExistentModel = models.id("non-existent");
  assertEquals(nonExistentModel, undefined, "Non-existent model should not exist");
});

Deno.test("provider websites are valid URLs", () => {
  // Get unique providers from all models
  const providers = Array.from(new Set(
    models.flatMap(model => model.providers)
  ));
  providers.forEach((providerId: string) => {
    const providerModels = models.fromProvider(providerId);
    if (providerModels.length > 0) {
      const model = providerModels[0];
      const provider = model.providers.find((p: string) => p === providerId);
      assertEquals(
        provider !== undefined,
        true,
        `Provider ${providerId} should exist`
      );
    }
  });
});

Deno.test("getProvider returns correct provider data", () => {
  // Test existing provider
  const openai = models.getProvider("openai");
  assertExists(openai, "OpenAI provider should exist");
  assertEquals(openai.id, "openai", "Provider ID should match");
  assertEquals(openai.name, "OpenAI", "Provider name should match");
  assertExists(openai.websiteUrl, "Provider should have website URL");
  assertExists(openai.apiUrl, "Provider should have API URL");
  assertExists(openai.models, "Provider should have models pricing");

  // Test non-existent provider
  const nonexistent = models.getProvider("nonexistent");
  assertEquals(nonexistent, undefined, "Non-existent provider should return undefined");
});

Deno.test("getProvidersForModel returns correct providers", () => {
  // Test model with multiple providers
  const gpt4Providers = models.getProvidersForModel("gpt-4o");
  assertExists(gpt4Providers, "Should return providers array");
  assertEquals(Array.isArray(gpt4Providers), true, "Should return an array");
  assertEquals(
    gpt4Providers.some((p: Provider) => p.id === "openai"), 
    true, 
    "GPT-4 should be available on OpenAI"
  );

  // Test non-existent model
  const nonexistentProviders = models.getProvidersForModel("nonexistent-model");
  assertEquals(nonexistentProviders.length, 0, "Non-existent model should return empty array");

  // Test models with latest aliases
  const claudeOpusProviders = models.getProvidersForModel("claude-3-opus-latest");
  assertEquals(claudeOpusProviders.length > 0, true, "Should find providers for Claude Opus");
  assertEquals(
    claudeOpusProviders.some((p: Provider) => p.id === "anthropic"),
    true,
    "Claude Opus should be available on Anthropic"
  );

  const claudeSonnetProviders = models.getProvidersForModel("claude-3-sonnet-latest");
  assertEquals(claudeSonnetProviders.length > 0, true, "Should find providers for Claude Sonnet");
  assertEquals(
    claudeSonnetProviders.some((p: Provider) => p.id === "anthropic"),
    true,
    "Claude Sonnet should be available on Anthropic"
  );
});
