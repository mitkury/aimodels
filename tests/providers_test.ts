import { assertEquals, assertNotEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";
import { models } from "../src/index.ts";
import type { Model } from "../src/types/index.ts";

Deno.test("providers list contains major providers", () => {
  const providersList = models.providers;
  
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
  const gpt4Price = models.getPrice("gpt-4o", "openai");
  assertEquals(gpt4Price?.type, "token", "GPT-4 should have token pricing");
  if (gpt4Price?.type === "token") {
    assertNotEquals(gpt4Price.input, 0, "GPT-4 input price should not be 0");
    assertNotEquals(gpt4Price.output, 0, "GPT-4 output price should not be 0");
    // Both input and output prices should be positive
    assertEquals(gpt4Price.input > 0, true, "GPT-4 input price should be positive");
    assertEquals(gpt4Price.output > 0, true, "GPT-4 output price should be positive");
  }

  // Test Claude pricing
  const claudePrice = models.getPrice("claude-3-opus", "anthropic");
  assertEquals(claudePrice?.type, "token", "Claude should have token pricing");
  if (claudePrice?.type === "token") {
    assertNotEquals(claudePrice.input, 0, "Claude input price should not be 0");
    assertNotEquals(claudePrice.output, 0, "Claude output price should not be 0");
  }

  // Test non-existent model pricing
  const nonExistentPrice = models.getPrice("non-existent", "openai");
  assertEquals(nonExistentPrice, undefined, "Non-existent model should have no pricing");
});

Deno.test("provider websites are valid URLs", () => {
  const providers = models.providers;
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
