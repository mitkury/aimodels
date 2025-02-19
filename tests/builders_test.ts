import { assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";
import { buildAllModels } from "../src/builders/models.ts";
import { buildAllProviders } from "../src/builders/providers.ts";

Deno.test("buildAllModels returns all models", () => {
  const models = buildAllModels();
  
  // Basic structure tests
  assertEquals(Array.isArray(models), true, "Models should be an array");
  assertEquals(models.length > 0, true, "Should have at least one model");
  
  // Test a known model (GPT-4)
  const gpt4 = models.find(m => m.id === "gpt-4o");
  assertEquals(gpt4?.name, "GPT-4o", "Should find GPT-4o model");
  assertEquals(gpt4?.license, "proprietary", "GPT-4 should be proprietary");
  assertEquals(gpt4?.providers.includes("openai"), true, "GPT-4 should be provided by OpenAI");
  assertEquals(Array.isArray(gpt4?.can), true, "Model should have capabilities");
});

Deno.test("buildAllProviders returns all providers", () => {
  const providers = buildAllProviders();
  
  // Basic structure tests
  assertEquals(Array.isArray(providers), true, "Providers should be an array");
  assertEquals(providers.length > 0, true, "Should have at least one provider");
  
  // Test OpenAI provider
  const openai = providers.find(p => p.id === "openai");
  assertEquals(openai?.name, "OpenAI", "Should find OpenAI provider");
  assertEquals(openai?.websiteUrl, "https://openai.com/", "Should have correct website URL");
  assertEquals(typeof openai?.models, "object", "Should have models object");
  
  // Test a known model price
  const gpt4Price = openai?.models["gpt-4o"];
  assertEquals(gpt4Price?.type, "token", "GPT-4 should have token-based pricing");
  if (gpt4Price?.type === "token") {
    assertEquals(typeof gpt4Price.input, "number", "Should have input price");
    assertEquals(typeof gpt4Price.output, "number", "Should have output price");
  }
});
