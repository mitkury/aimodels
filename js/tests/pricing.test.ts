import { describe, expect, it } from 'vitest';
import { models } from '../dist/index.js';

describe('provider pricing data', () => {
  it('exposes a pricing map for every provider', () => {
    expect(models.providers.length).toBeGreaterThan(0);

    for (const provider of models.providers) {
      expect(provider.pricing).toBeDefined();
      expect(Array.isArray(provider.pricing)).toBe(false);
      expect(typeof provider.pricing).toBe('object');
    }
  });

  it('uses valid numeric fields for every published price', () => {
    for (const provider of models.providers) {
      for (const [modelId, price] of Object.entries(provider.pricing)) {
        expect(modelId.length).toBeGreaterThan(0);

        if (price.type === 'token') {
          expect(price.input).toBeGreaterThanOrEqual(0);
          expect(price.output).toBeGreaterThanOrEqual(0);
        } else {
          expect(price.type).toBe('image');
          expect(price.price).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  it('keeps provider objects and provider IDs consistent on models', () => {
    for (const model of models) {
      expect(model.providers.map(provider => provider.id)).toEqual(model.providerIds);
    }
  });
});
