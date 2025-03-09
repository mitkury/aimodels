import { describe, it, expect } from 'vitest';

// Import directly from the built distribution data file
import { models, providers, organizations } from '../src/data.js';
import type { Model } from '../src/types/model.js';
import type { Provider } from '../src/types/provider.js';

describe('Generated data file', () => {
  // Verify data structures exist and are populated
  it('contains populated data structures', () => {
    expect(models).toBeDefined();
    expect(Object.keys(models).length).toBeGreaterThan(0);
    expect(providers).toBeDefined();
    expect(Object.keys(providers).length).toBeGreaterThan(0);
    expect(organizations).toBeDefined();
    expect(Object.keys(organizations).length).toBeGreaterThan(0);
  });

  // Test popular models to ensure they have required fields
  describe('model data integrity', () => {
    it('includes GPT-4 with correct properties', () => {
      const gpt4 = models['gpt-4'] as Model;
      expect(gpt4).toBeDefined();
      expect(gpt4.id).toBe('gpt-4');
      expect(gpt4.name).toBe('GPT-4');
      expect(gpt4.providerIds).toContain('openai');
      expect(gpt4.can).toContain('chat');
      expect(gpt4.context?.total).toBeGreaterThan(0);
    });

    it('includes Claude 3 with correct properties', () => {
      const claude = Object.values(models).find(
        (m: any) => m.id.includes('claude') && m.id.includes('3')
      ) as Model;
      
      expect(claude).toBeDefined();
      expect(claude.providerIds).toContain('anthropic');
      expect(claude.can).toContain('chat');
    });
  });

  // Test provider data integrity
  describe('provider data integrity', () => {
    it('includes OpenAI with correct properties', () => {
      const openai = providers['openai'] as Provider;
      expect(openai).toBeDefined();
      expect(openai.id).toBe('openai');
      expect(openai.name).toBe('OpenAI');
      expect(openai.apiUrl).toBeDefined();
    });

    it('includes Anthropic with correct properties', () => {
      const anthropic = providers['anthropic'] as Provider;
      expect(anthropic).toBeDefined();
      expect(anthropic.id).toBe('anthropic');
      expect(anthropic.name).toBe('Anthropic');
    });
  });

  // Test organization data integrity
  describe('organization data integrity', () => {
    it('includes OpenAI organization data', () => {
      const openai = organizations['openai'];
      expect(openai).toBeDefined();
      expect(openai.name).toBe('OpenAI');
    });
  });
}); 