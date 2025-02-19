import { assertEquals, assertGreater, assertThrows } from "https://deno.land/std@0.220.1/assert/mod.ts";
import { models } from "../src/index.ts";
import type { Model, TokenModelContext } from "../src/types/index.ts";
import { ModelCollection } from "../src/types/models.ts";
import { buildAllModels, validateModel } from "../src/builders/models.ts";

Deno.test("models.can filters by single capability", () => {
  // Get all chat models
  const chatModels = models.can("chat");
  assertGreater(chatModels.length, 0, "Should have chat models");
  
  // Verify each model has chat capability
  chatModels.forEach((model: Model) => {
    assertEquals(model.can.includes("chat"), true, `${model.name} should have chat capability`);
  });
});

Deno.test("models.can filters by multiple capabilities", () => {
  // Get models that can both chat and output functions
  const chatWithFunctions = models.can("chat", "function-out");
  assertGreater(chatWithFunctions.length, 0, "Should have models with chat and function-out");
  
  // Verify each model has both capabilities
  chatWithFunctions.forEach((model: Model) => {
    assertEquals(
      model.can.includes("chat") && model.can.includes("function-out"), 
      true, 
      `${model.name} should have both chat and function-out capabilities`
    );
  });
});

Deno.test("models.id returns model for existing id", () => {
  const model = models.id("o1");
  assertEquals(model?.id, "o1", "Should find model with id 'o1'");
  assertEquals(model?.name, "OpenAI O1", "Should have correct name");
});

Deno.test("models.fromProvider finds model in provider", () => {
  const model = models.fromProvider("openai").id("gpt-4o");
  assertEquals(model?.id, "gpt-4o", "Should find model with id 'gpt-4o'");
  assertEquals(model?.providers.includes("openai"), true, "Should be available from OpenAI provider");
});

Deno.test("models.id returns undefined for non-existent model", () => {
  const model = models.id("non-existent-model-id");
  assertEquals(model, undefined, "Should return undefined for non-existent model");
});

Deno.test("models.fromProvider returns undefined for non-existent model", () => {
  const model = models.fromProvider("non-existent-provider").id("gpt-4o");
  assertEquals(model, undefined, "Should return undefined for non-existent model in provider");
});

Deno.test("models.can filters by vision capabilities", () => {
  // Get models that can chat and understand images
  const visionModels = models.can("chat", "img-in");
  assertGreater(visionModels.length, 0, "Should have vision models");

  // Verify each model has both capabilities
  visionModels.forEach((model: Model) => {
    assertEquals(
      model.can.includes("chat") && model.can.includes("img-in"), 
      true, 
      `${model.name} should have both chat and img-in capabilities`
    );
  });
});

Deno.test("model validation catches invalid data", () => {
  // Missing required fields
  assertThrows(
    () => validateModel({
      // Missing id, name, creator, etc.
    }),
    Error,
    "Model id must be a string"
  );

  // Invalid capability
  assertThrows(
    () => validateModel({
      id: "test",
      name: "Test",
      creator: "Test",
      license: "mit",
      providers: ["test"],
      can: ["invalid-capability"],
      context: { total: 1000, maxOutput: 100 }
    }),
    Error,
    "Model has invalid capabilities"
  );

  // Invalid context structure
  assertThrows(
    () => validateModel({
      id: "test",
      name: "Test",
      creator: "Test",
      license: "mit",
      providers: ["test"],
      can: ["chat"],
      context: "invalid"
    }),
    Error,
    "Model context must be an object"
  );
});

Deno.test("model validation accepts valid data", () => {
  const validModel = {
    id: "test-model",
    name: "Test Model",
    creator: "Test Creator",
    license: "mit",
    providers: ["test-provider"],
    can: ["chat", "text-in", "text-out"],
    context: {
      total: 4096,
      maxOutput: 1024
    }
  };

  // Should not throw when validating a proper model
  const result = validateModel(validModel);
  assertEquals(result.id, validModel.id, "Should preserve id");
  assertEquals(result.name, validModel.name, "Should preserve name");
  assertEquals(result.creator, validModel.creator, "Should preserve creator");
  assertEquals(result.license, validModel.license, "Should preserve license");
  assertEquals(result.providers, validModel.providers, "Should preserve providers");
  assertEquals(result.can, validModel.can, "Should preserve capabilities");
  assertEquals(result.context, validModel.context, "Should preserve context");

  // Verify actual models load
  const models = buildAllModels();
  assertEquals(Array.isArray(models), true, "Should return an array of models");
  assertGreater(models.length, 0, "Should have at least one model");
});

Deno.test("model validation accepts image model context", () => {
  const imageModel = {
    id: "test-image-model",
    name: "Test Image Model",
    creator: "Test Creator",
    license: "mit",
    providers: ["test-provider"],
    can: ["img-out"],
    context: {
      maxOutput: 1,
      sizes: ["1024x1024", "512x512"],
      qualities: ["standard", "hd"]
    }
  };

  const result = validateModel(imageModel);
  assertEquals(result.context, imageModel.context, "Should preserve image model context");
});

Deno.test("models.know filters by language support", () => {
  const model = {
    id: "test-multilingual",
    name: "Test Multilingual",
    creator: "Test",
    license: "mit",
    providers: ["test"],
    can: ["chat"],
    languages: ["en", "es", "fr"],
    context: { total: 1000, maxOutput: 100 }
  };

  const result = validateModel(model);
  assertEquals(result.languages, model.languages, "Should preserve language support");
});

Deno.test("withMinContext handles edge cases", () => {
  // Test with image models (should be filtered out)
  const imageModels = models.can("img-out");
  const largeContextImageModels = imageModels.withMinContext(1000);
  assertEquals(largeContextImageModels.length, 0, "Image models should be filtered out by context");

  // Test with null context
  const whisperModels = models.id("whisper-large-v3");
  const whisperContext = whisperModels?.context as TokenModelContext;
  assertEquals(whisperContext.total, null, "Whisper should have null context");
  const nullContextModels = models.filter(m => {
    if (!('total' in m.context)) return false;
    return m.context.total === null;
  });
  const largeContextNullModels = nullContextModels.withMinContext(1000);
  assertEquals(largeContextNullModels.length, 0, "Models with null context should be filtered out");

  // Test with valid context
  const chatModels = models.can("chat");
  const largeContextChatModels = chatModels.withMinContext(100000);
  assertGreater(largeContextChatModels.length, 0, "Should find models with large context");
  largeContextChatModels.forEach(model => {
    const context = model.context as TokenModelContext;
    assertEquals(
      context.total !== null && context.total >= 100000,
      true,
      `${model.name} should have context >= 100000`
    );
  });
});

Deno.test("ModelCollection preserves array operations", () => {
  const allModels = models;
  
  // Test slice
  const firstFive = allModels.slice(0, 5);
  assertEquals(firstFive.length, 5, "Slice should return 5 models");
  assertEquals(firstFive instanceof ModelCollection, true, "Slice should return ModelCollection");

  // Test filter
  const filteredModels = allModels.filter((m: Model) => m.license === "mit");
  assertEquals(filteredModels instanceof ModelCollection, true, "Filter should return ModelCollection");

  // Test chaining
  const result = allModels
    .can("chat")
    .filter((m: Model) => m.providers.includes("openai"))
    .withMinContext(100000);
  assertEquals(result instanceof ModelCollection, true, "Chained operations should return ModelCollection");
});

Deno.test("model validation handles optional fields", () => {
  // Test with minimal valid model (no optional fields)
  const minimalModel = {
    id: "minimal-model",
    name: "Minimal Model",
    creator: "Test",
    license: "mit",
    providers: ["test"],
    can: ["chat"],
    context: { total: 1000, maxOutput: 100 }
  };

  const result = validateModel(minimalModel);
  assertEquals(result.languages, undefined, "Should not add undefined optional fields");

  // Test with all optional fields
  const fullModel = {
    ...minimalModel,
    languages: ["en"],
    aliases: ["minimal", "min"]
  };

  const fullResult = validateModel(fullModel);
  assertEquals(fullResult.languages?.length, 1, "Should preserve optional languages");
});

Deno.test("model validation handles aliases", () => {
  // Test with minimal valid model (no aliases)
  const minimalModel = {
    id: "test-model",
    name: "Test Model",
    creator: "Test",
    license: "mit",
    providers: ["test"],
    can: ["chat"],
    context: { total: 1000, maxOutput: 100 }
  };

  const result = validateModel(minimalModel);
  assertEquals(result.aliases, undefined, "Should not add undefined aliases");

  // Test with aliases
  const modelWithAliases = {
    ...minimalModel,
    aliases: ["test", "test-v1"]
  };

  const resultWithAliases = validateModel(modelWithAliases);
  assertEquals(resultWithAliases.aliases, modelWithAliases.aliases, "Should preserve aliases");
});
