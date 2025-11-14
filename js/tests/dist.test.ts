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
    it('includes GPT-5.1 with correct properties', () => {
      const gpt51 = models['gpt-5.1'] as Model;
      expect(gpt51).toBeDefined();
      expect(gpt51.id).toBe('gpt-5.1');
      expect(gpt51.name).toBe('GPT-5.1');
      expect(gpt51.providerIds).toContain('openai');
      expect(gpt51.capabilities).toContain('chat');
      expect(gpt51.context?.total).toBeGreaterThan(0);
    });

    it('includes Claude 3 with correct properties', () => {
      const claude = Object.values(models).find(
        (m: any) => m.id.includes('claude') && m.id.includes('3')
      ) as Model;
      
      expect(claude).toBeDefined();
      expect(claude.providerIds).toContain('anthropic');
      expect(claude.capabilities).toContain('chat');
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