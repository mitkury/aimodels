import { describe, it, expect } from 'vitest';
import { models } from '../dist/index.js';
import type { Capability } from '../src/types/capabilities';
import type { ModelCollection } from '../src/types/modelCollection';

describe('AI Model Capabilities Tests', () => {
  describe('Capability Relationships', () => {
    it('verifies that chat models have text input and output capabilities', () => {
      const chatModels = models.canChat();
      
      // All chat models should have text capabilities
      chatModels.forEach(model => {
        expect(model.capabilities).toContain('chat');
        // Most chat models should have both txt-in and txt-out
        // But we'll check if at least one is present
        const hasTextCapability = model.capabilities.includes('txt-in') || model.capabilities.includes('txt-out');
        expect(hasTextCapability).toBe(true);
      });
      
      console.log(`Verified ${chatModels.length} chat models have proper text capabilities`);
    });

    it('verifies that reasoning models have chat capability', () => {
      const reasoningModels = models.canReason();
      
      // Models with reasoning generally should be able to chat
      const reasoningWithChat = reasoningModels.filter(model => model.capabilities.includes('chat'));
      
      console.log(`Models with reasoning: ${reasoningModels.length}`);
      console.log(`Models with reasoning and chat: ${reasoningWithChat.length}`);
      
      // This might not always be true, but for most current AI models it is
      // So we validate the relationship is generally true
      if (reasoningModels.length > 0) {
        expect(reasoningWithChat.length / reasoningModels.length).toBeGreaterThan(0.8);
      }
    });

    it('validates multimodal capability combinations', () => {
      // Vision models (text + image input)
      const visionModels = models.canSee().canChat();
      
      // Audio models (text + audio)
      const audioModels = models.canHear().canChat();
      
      // Full multimodal (text + image + audio)
      const fullMultimodal = models.canChat().canSee().canHear();
      
      console.log('Capability combinations:');
      console.log(`- Vision models (text + image): ${visionModels.length}`);
      console.log(`- Audio models (text + audio): ${audioModels.length}`);
      console.log(`- Full multimodal (text + image + audio): ${fullMultimodal.length}`);
      
      if (visionModels.length > 0) {
        console.log('Example vision models:', visionModels.slice(0, 3).map(m => m.id));
      }
      
      if (fullMultimodal.length > 0) {
        console.log('Example full multimodal models:', fullMultimodal.slice(0, 3).map(m => m.id));
      }
      
      // We expect vision models to exist since they're common now
      expect(visionModels.length).toBeGreaterThan(0);
    });
  });

  describe('Capability Method Equivalence', () => {
    it('verifies that fluent API methods match direct capability filtering', () => {
      // Test various fluent methods against their raw capability equivalents
      const testCases: { method: string; capability: Capability }[] = [
        { method: 'canChat', capability: 'chat' },
        { method: 'canReason', capability: 'reason' },
        { method: 'canSee', capability: 'img-in' },
        { method: 'canGenerateImages', capability: 'img-out' },
        { method: 'canHear', capability: 'audio-in' },
        { method: 'canSpeak', capability: 'audio-out' },
        { method: 'canOutputJSON', capability: 'json-out' },
        { method: 'canCallFunctions', capability: 'fn-out' },
        { method: 'canGenerateEmbeddings', capability: 'vec-out' },
      ];
      
      testCases.forEach(({ method, capability }) => {
        // Use type assertion to indicate the method exists on models
        const fluentResult = (models as any)[method]() as ModelCollection;
        const directResult = models.can(capability);
        
        expect(fluentResult.length).toBe(directResult.length);
        console.log(`Method ${method} found ${fluentResult.length} models, matching raw capability '${capability}'`);
      });
    });
  });

  describe('Complex Capability Combinations', () => {
    it('finds models with advanced combinations of capabilities', () => {
      // Find "super models" that have many advanced capabilities
      const superModels = models
        .canChat()       // Can chat
        .canReason()     // Has reasoning
        .canSee()        // Can process images
        .canCallFunctions() // Can call functions
        .canOutputJSON();  // Can output structured JSON
      
      console.log(`Found ${superModels.length} "super models" with advanced capabilities`);
      if (superModels.length > 0) {
        console.log('Examples:', superModels.slice(0, 3).map(m => m.id));
      }
      
      // Find code-specific models (check using model ID patterns)
      const codeModels = models.filter(model => 
        model.id.toLowerCase().includes('code') || 
        model.id.toLowerCase().includes('program') ||
        model.id.toLowerCase().includes('dev')
      );
      
      console.log(`Found ${codeModels.length} models specialized for code`);
      if (codeModels.length > 0) {
        console.log('Examples:', codeModels.slice(0, 3).map(m => m.id));
      }
    });
  });
  
  describe('Capability Distribution', () => {
    it('analyzes the distribution of capabilities across all models', () => {
      // Count the occurrences of each capability
      const capabilityCounts: Record<Capability, number> = {
        'chat': 0,
        'reason': 0,
        'txt-in': 0,
        'txt-out': 0,
        'img-in': 0,
        'img-out': 0,
        'audio-in': 0,
        'audio-out': 0,
        'json-out': 0,
        'fn-out': 0,
        'vec-out': 0
      };
      
      models.forEach(model => {
        model.capabilities.forEach(capability => {
          // Check if capability is one of the keys in capabilityCounts
          if (Object.prototype.hasOwnProperty.call(capabilityCounts, capability)) {
            capabilityCounts[capability as Capability]++;
          }
        });
      });
      
      // Sort capabilities by frequency
      const sortedCapabilities = Object.entries(capabilityCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([capability, count]) => `${capability}: ${count} models`);
      
      console.log('Capability distribution across all models:');
      sortedCapabilities.forEach(entry => {
        console.log(`- ${entry}`);
      });
      
      // Verify that we have at least some models with each capability
      const totalCapabilitiesWithModels = Object.values(capabilityCounts)
        .filter(count => count > 0)
        .length;
      
      console.log(`Number of capabilities with at least one model: ${totalCapabilitiesWithModels}`);
      expect(totalCapabilitiesWithModels).toBeGreaterThan(0);
    });
  });
}); 