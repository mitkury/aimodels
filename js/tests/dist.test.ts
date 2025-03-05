import { describe, it, expect } from 'vitest';
import { models, providers, organizations } from '../../dist/data';
import type { Model, Provider } from '../src/types/models';

describe('dist data', () => {
  it('loads pre-built data correctly', () => {
    expect(models).toBeDefined();
    expect(Object.keys(models).length).toBeGreaterThan(0);
    expect(providers).toBeDefined();
    expect(Object.keys(providers).length).toBeGreaterThan(0);
    expect(organizations).toBeDefined();
    expect(Object.keys(organizations).length).toBeGreaterThan(0);

    const gpt4 = models['gpt-4'] as Model;
    expect(gpt4).toBeDefined();
    expect(gpt4.creator).toBe('openai');
    expect(gpt4.providers).toContain('openai');
  });
});

describe('public API', () => {
  it('finds models by ID', () => {
    const gpt4 = models['gpt-4'] as Model;
    expect(gpt4).toBeDefined();
    expect(gpt4.name).toBe('GPT-4');
    expect(gpt4.creator).toBe('openai');
  });

  it('finds models by creator', () => {
    const openaiModels = Object.values(models).filter((m): m is Model => 
      typeof m === 'object' && m !== null && 'creator' in m && m.creator === 'openai'
    );
    expect(openaiModels.length).toBeGreaterThan(0);
    expect(openaiModels.every(m => m.creator === 'openai')).toBe(true);
  });

  it('finds models by provider', () => {
    const openaiModels = Object.values(models).filter((m): m is Model => 
      typeof m === 'object' && m !== null && 'providers' in m && Array.isArray(m.providers) && m.providers.includes('openai')
    );
    expect(openaiModels.length).toBeGreaterThan(0);
    expect(openaiModels.every(m => m.providers.includes('openai'))).toBe(true);
  });

  it('filters models by capabilities', () => {
    const chatModels = Object.values(models).filter((m): m is Model => 
      typeof m === 'object' && m !== null && 'can' in m && Array.isArray(m.can) && m.can.includes('chat')
    );
    expect(chatModels.length).toBeGreaterThan(0);
    expect(chatModels.every(m => m.can.includes('chat'))).toBe(true);
  });

  it('gets creator information', () => {
    const openai = organizations['openai'] as Provider;
    expect(openai).toBeDefined();
    expect(openai.id).toBe('openai');
    expect(openai.name).toBe('OpenAI');
  });

  it('gets provider information', () => {
    const openai = providers['openai'] as Provider;
    expect(openai).toBeDefined();
    expect(openai.id).toBe('openai');
    expect(openai.name).toBe('OpenAI');
  });
}); 