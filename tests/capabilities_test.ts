import { assertEquals, assertExists } from "https://deno.land/std@0.220.1/assert/mod.ts";
import { models } from "../src/index.ts";
import type { Capability } from "../src/types/capabilities.ts";

// List of all valid capabilities
const validCapabilities: Capability[] = [
  "chat",
  "reason",
  "text-in",
  "text-out",
  "img-in",
  "img-out",
  "sound-in",
  "sound-out",
  "json-out",
  "function-out",
  "vectors-out"
];

Deno.test("models have valid capabilities", () => {
  // Check each model
  models.all.forEach(model => {
    assertExists(model.can, `${model.id} should have capabilities defined`);
    assertEquals(Array.isArray(model.can), true, `${model.id} capabilities should be an array`);
    
    // Check each capability
    model.can.forEach(capability => {
      assertEquals(
        validCapabilities.includes(capability as Capability),
        true,
        `${model.id} has invalid capability: ${capability}`
      );
    });
  });
});
