import { assertEquals, assertGreater } from "https://deno.land/std@0.220.1/assert/mod.ts";
import { models } from "../src/index.ts";

Deno.test("models.can filters by single capability", () => {
  // Get all chat models
  const chatModels = models.can("chat");
  assertGreater(chatModels.length, 0, "Should have chat models");
  
  // Verify each model has chat capability
  chatModels.forEach(model => {
    assertEquals(model.can.includes("chat"), true, `${model.name} should have chat capability`);
  });
});

Deno.test("models.can filters by multiple capabilities", () => {
  // Get models that can both chat and output functions
  const chatWithFunctions = models.can("chat", "function-out");
  assertGreater(chatWithFunctions.length, 0, "Should have models with chat and function-out");
  
  // Verify each model has both capabilities
  chatWithFunctions.forEach(model => {
    assertEquals(
      model.can.includes("chat") && model.can.includes("function-out"), 
      true, 
      `${model.name} should have both chat and function-out capabilities`
    );
  });
});

Deno.test("models.can filters by vision capabilities", () => {
  // Get models that can chat and understand images
  const visionModels = models.can("chat", "img-in");
  assertGreater(visionModels.length, 0, "Should have vision models");
  
  // Verify each model has both capabilities
  visionModels.forEach(model => {
    assertEquals(
      model.can.includes("chat") && model.can.includes("img-in"), 
      true, 
      `${model.name} should have both chat and img-in capabilities`
    );
  });
});
