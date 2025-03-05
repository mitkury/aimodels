import { describe, it, expect } from 'vitest';
import { models } from "../src/index.ts";
import type { Model, TokenContext, AudioInputContext, Provider } from "../src/types/index.ts";
import { ModelCollection } from "../src/types/models.ts";
import { buildAllModels, validateModel } from "../src/builders/models.ts";
import { models as prebuiltModels, providers as prebuiltProviders, organizations as prebuiltOrgs } from '../../dist/data';

describe('models', () => {
  it('filters by single capability', () => {
    // Get all chat models
    const chatModels = models.can("chat");
    expect(chatModels.length).toBeGreaterThan(0);
    
    // Verify each model has chat capability
    chatModels.forEach((model: Model) => {
      expect(model.can.includes("chat")).toBe(true);
    });
  });

  it('filters by multiple capabilities', () => {
    // Get models that can both chat and output functions
    const chatWithFunctions = models.can("chat", "fn-out");
    expect(chatWithFunctions.length).toBeGreaterThan(0);
    
    // Verify each model has both capabilities
    chatWithFunctions.forEach((model: Model) => {
      expect(model.can.includes("chat") && model.can.includes("fn-out")).toBe(true);
    });
  });

  it('returns model for existing id', () => {
    const model = models.id("o1");
    expect(model?.id).toBe("o1");
    expect(model?.name).toBe("OpenAI O1");
  });

  it('finds model in provider', () => {
    const model = models.fromProvider("openai").id("gpt-4o");
    expect(model?.id).toBe("gpt-4o");
    expect(model?.providers.includes("openai")).toBe(true);
  });

  it('returns undefined for non-existent model', () => {
    const model = models.id("non-existent-model-id");
    expect(model).toBeUndefined();
  });

  it('returns undefined for non-existent model in provider', () => {
    const model = models.fromProvider("non-existent-provider").id("gpt-4o");
    expect(model).toBeUndefined();
  });

  it('filters by vision capabilities', () => {
    // Get models that can chat and understand images
    const visionModels = models.can("chat", "img-in");
    expect(visionModels.length).toBeGreaterThan(0);

    // Verify each model has both capabilities
    visionModels.forEach((model: Model) => {
      expect(model.can.includes("chat") && model.can.includes("img-in")).toBe(true);
    });
  });
});

describe('model validation', () => {
  it('catches invalid data', () => {
    // Missing required fields
    expect(() => validateModel({
      // Missing id, name, creator, etc.
    })).toThrow("Model id must be a string");

    // Invalid capability
    expect(() => validateModel({
      id: "test",
      name: "Test",
      creator: "Test",
      providers: ["test"],
      can: ["invalid-capability"],
      context: {
        type: "token",
        total: 1000,
        maxOutput: 100
      }
    })).toThrow("Model has invalid capabilities");

    // Invalid context structure
    expect(() => validateModel({
      id: "test",
      name: "Test",
      creator: "Test",
      providers: ["test"],
      can: ["chat"],
      context: "invalid"
    })).toThrow("Model context must be an object");
  });

  it('accepts valid data', () => {
    const validModel: Model = {
      id: "test-model",
      name: "Test Model",
      creator: "Test Creator",
      license: "mit",
      providers: ["test-provider"],
      can: ["chat", "txt-in", "txt-out"],
      context: {
        type: "token",
        total: 4096,
        maxOutput: 1024
      }
    };

    // Should not throw when validating a proper model
    const result = validateModel(validModel);
    expect(result.id).toBe(validModel.id);
    expect(result.name).toBe(validModel.name);
    expect(result.creator).toBe(validModel.creator);
    expect(result.license).toBe(validModel.license);
    expect(result.providers).toEqual(validModel.providers);
    expect(result.can).toEqual(validModel.can);
    expect(result.context).toEqual(validModel.context);

    // Verify actual models load
    const models = buildAllModels();
    expect(Array.isArray(models)).toBe(true);
    expect(models.length).toBeGreaterThan(0);
  });

  it('accepts image model context', () => {
    const imageModel: Model = {
      id: "test-image-model",
      name: "Test Image Model",
      creator: "Test Creator",
      license: "mit",
      providers: ["test-provider"],
      can: ["img-out"],
      context: {
        type: "image",
        maxOutput: 1,
        sizes: ["1024x1024", "512x512"],
        qualities: ["standard"]
      }
    };

    const result = validateModel(imageModel);
    expect(result.context).toEqual(imageModel.context);
  });
});

describe('language support', () => {
  it('filters by language support', () => {
    const model: Model = {
      id: "test-multilingual",
      name: "Test Multilingual",
      creator: "Test",
      license: "mit",
      providers: ["test"],
      can: ["chat"],
      languages: ["en", "es", "fr"],
      context: {
        type: "token",
        total: 1000,
        maxOutput: 100
      }
    };

    const result = validateModel(model);
    expect(result.languages).toEqual(model.languages);
  });
});

describe('context handling', () => {
  it('handles edge cases in withMinContext', () => {
    // Test with image models (should be filtered out)
    const imageModels = models.can("img-out");
    const largeContextImageModels = imageModels.withMinContext(1000);
    expect(largeContextImageModels.length).toBe(0);

    // Test with token models that have null context
    const nullContextModels = models.filter(m => {
      const context = m.context;
      if (context.type !== "token") return false;
      return (context as TokenContext).total === null;
    });
    const largeContextNullModels = nullContextModels.withMinContext(1000);
    expect(largeContextNullModels.length).toBe(0);

    // Test with valid context
    const chatModels = models.can("chat");
    const largeContextChatModels = chatModels.withMinContext(100000);
    expect(largeContextChatModels.length).toBeGreaterThan(0);
    largeContextChatModels.forEach(model => {
      const context = model.context as TokenContext;
      expect(context.total !== null && context.total >= 100000).toBe(true);
    });
  });

  it('has correct context type for audio models', () => {
    const whisperModel = models.id("whisper-1");
    expect(whisperModel?.context.type).toBe("audio-in");
    
    const audioContext = whisperModel?.context as AudioInputContext;
    expect(audioContext.maxDuration === undefined || audioContext.maxDuration === null).toBe(true);
  });
});

describe('ModelCollection', () => {
  it('preserves array operations', () => {
    const allModels = models;
    
    // Test slice
    const firstFive = allModels.slice(0, 5);
    expect(firstFive.length).toBe(5);
    expect(firstFive instanceof ModelCollection).toBe(true);

    // Test filter
    const filteredModels = allModels.filter((m: Model) => m.license === "mit");
    expect(filteredModels instanceof ModelCollection).toBe(true);

    // Test chaining
    const result = allModels
      .can("chat")
      .filter((m: Model) => m.providers.includes("openai"))
      .withMinContext(100000);
    expect(result instanceof ModelCollection).toBe(true);
  });

  it('returns deduplicated providers', () => {
    // Create a test collection with overlapping providers
    const testModels = new ModelCollection();
    testModels.push(
      {
        id: "model1",
        name: "Model 1",
        creator: "Test",
        license: "mit",
        providers: ["provider1", "provider2"],
        can: ["chat"],
        context: {
          type: "token",
          total: 1000,
          maxOutput: 100
        }
      },
      {
        id: "model2",
        name: "Model 2",
        creator: "Test",
        license: "mit",
        providers: ["provider2", "provider3"],
        can: ["chat"],
        context: {
          type: "token",
          total: 1000,
          maxOutput: 100
        }
      }
    );

    const providers = testModels.getProviders();
    expect(providers.length).toBe(3);
    expect(new Set(providers.map(p => p.id)).size).toBe(3);
  });

  it('handles creator operations', () => {
    // Create a test collection with multiple creators
    const testModels = new ModelCollection();
    testModels.push(
      {
        id: "model1",
        name: "Model 1",
        creator: "creator1",
        license: "mit",
        providers: ["provider1", "provider2"],
        can: ["chat"],
        context: {
          type: "token",
          total: 1000,
          maxOutput: 100
        }
      },
      {
        id: "model2",
        name: "Model 2",
        creator: "creator2",
        license: "mit",
        providers: ["provider2", "provider3"],
        can: ["chat"],
        context: {
          type: "token",
          total: 1000,
          maxOutput: 100
        }
      }
    );

    // Test fromCreator
    const creator1Models = testModels.fromCreator("creator1");
    expect(creator1Models.length).toBe(1);
    expect(creator1Models[0].creator).toBe("creator1");

    // Test getCreators
    const creators = testModels.getCreators();
    expect(creators.length).toBe(2);
    expect(new Set(creators.map(c => c.id)).size).toBe(2);

    // Test getCreator
    const creator1 = testModels.getCreator("creator1");
    expect(creator1).toBeDefined();
    expect(creator1?.id).toBe("creator1");

    // Test getCreatorForModel
    const model1Creator = testModels.getCreatorForModel("model1");
    expect(model1Creator).toBeDefined();
    expect(model1Creator?.id).toBe("creator1");
  });
});

// Test dist data loading
describe('dist data', () => {
  it('loads pre-built data correctly', () => {
    // Check models
    expect(prebuiltModels).toBeDefined();
    expect(Object.keys(prebuiltModels).length).toBeGreaterThan(0);
    
    // Check providers
    expect(prebuiltProviders).toBeDefined();
    expect(Object.keys(prebuiltProviders).length).toBeGreaterThan(0);
    
    // Check organizations
    expect(prebuiltOrgs).toBeDefined();
    expect(Object.keys(prebuiltOrgs).length).toBeGreaterThan(0);

    // Verify a known model exists
    const gpt4 = prebuiltModels['gpt-4'] as Model;
    expect(gpt4).toBeDefined();
    expect(gpt4.creator).toBe('openai');
    expect(gpt4.providers).toContain('openai');
  });

  it('finds models by ID', () => {
    const gpt4 = prebuiltModels['gpt-4'] as Model;
    expect(gpt4).toBeDefined();
    expect(gpt4.name).toBe('GPT-4');
    expect(gpt4.creator).toBe('openai');
  });

  it('finds models by creator', () => {
    const openaiModels = Object.values(prebuiltModels).filter((m): m is Model => 
      typeof m === 'object' && m !== null && 'creator' in m && m.creator === 'openai'
    );
    expect(openaiModels.length).toBeGreaterThan(0);
    expect(openaiModels.every(m => m.creator === 'openai')).toBe(true);
  });

  it('finds models by provider', () => {
    const openaiModels = Object.values(prebuiltModels).filter((m): m is Model => 
      typeof m === 'object' && m !== null && 'providers' in m && Array.isArray(m.providers) && m.providers.includes('openai')
    );
    expect(openaiModels.length).toBeGreaterThan(0);
    expect(openaiModels.every(m => m.providers.includes('openai'))).toBe(true);
  });

  it('filters models by capabilities', () => {
    const chatModels = Object.values(prebuiltModels).filter((m): m is Model => 
      typeof m === 'object' && m !== null && 'can' in m && Array.isArray(m.can) && m.can.includes('chat')
    );
    expect(chatModels.length).toBeGreaterThan(0);
    expect(chatModels.every(m => m.can.includes('chat'))).toBe(true);
  });

  it('gets creator information', () => {
    const openai = prebuiltOrgs['openai'] as Provider;
    expect(openai).toBeDefined();
    expect(openai.id).toBe('openai');
    expect(openai.name).toBe('OpenAI');
  });

  it('gets provider information', () => {
    const openai = prebuiltProviders['openai'] as Provider;
    expect(openai).toBeDefined();
    expect(openai.id).toBe('openai');
    expect(openai.name).toBe('OpenAI');
  });
});
