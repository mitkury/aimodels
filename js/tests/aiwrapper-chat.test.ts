import { describe, expect, it } from 'vitest';
import { models } from '../dist/index.js';

type ProviderId = 'openai' | 'openrouter' | 'anthropic';

const PROVIDER_FILTERS = getProviderFilters();

describe('AIWrapper provider model availability', () => {
  const providerIds: ProviderId[] = ['openai', 'openrouter', 'anthropic'];

  for (const providerId of providerIds) {
    const title = `${providerId} chat model listing`;

    if (PROVIDER_FILTERS.length > 0 && !PROVIDER_FILTERS.includes(providerId)) {
      it.skip(`${title} (skipped by PROVIDERS filter)`, () => {});
      continue;
    }

    it(title, () => {
      const chatModels = models.fromProvider(providerId).canChat();
      const list = Array.from(chatModels).map(model => `${model.id} (${model.name})`);

      console.log(`Chat-capable models for provider "${providerId}":`);
      list.forEach(line => console.log(`- ${line}`));

      // We expect at least one chat model per supported provider in our data
      expect(chatModels.length).toBeGreaterThan(0);
    });
  }
});

function getProviderFilters(): ProviderId[] {
  const envProviders = process.env.PROVIDERS;
  if (!envProviders) {
    return [];
  }

  const parsed = envProviders
    .split(',')
    .map(provider => provider.trim().toLowerCase())
    .filter(Boolean) as ProviderId[];

  // Deduplicate while preserving order
  return Array.from(new Set(parsed));
}
