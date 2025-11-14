import { describe, it, vi } from 'vitest';
import type { LanguageProvider } from 'aiwrapper';

/**
 * AIWrapper imports the published aimodels package, so we remap it to the
 * freshly built data from this repository for the tests.
 */
vi.mock('aimodels', async () => {
  return await import('../dist/index.js');
});

import { Lang } from 'aiwrapper';
import { models } from '../dist/index.js';

type ProviderId = 'openai' | 'openrouter' | 'anthropic';

interface ProviderTestConfig {
  id: ProviderId;
  envVar: string;
  createClient: (apiKey: string, modelId: string) => LanguageProvider;
}

const SYSTEM_PROMPT = 'You are an automated integration test. Reply with exactly the word "hey".';
const TEST_PROMPT = 'Respond with exactly the word "hey".';
const MODEL_LIMIT = parsePositiveInteger(process.env.AIWRAPPER_CHAT_MODEL_LIMIT);
const TIMEOUT_PER_MODEL_MS = parsePositiveInteger(process.env.AIWRAPPER_CHAT_MODEL_TIMEOUT_MS) ?? 15_000;
const OPENROUTER_SITE_URL = process.env.OPENROUTER_SITE_URL ?? 'https://github.com/mitkury/aimodels';
const OPENROUTER_SITE_NAME = process.env.OPENROUTER_SITE_NAME ?? 'aimodels smoke tests';

const IGNORED_MODEL_IDS = new Set<string>(['computer-use-preview-2025-03-11']);

const PROVIDER_FILTERS = getProviderFilters();

const providerConfigs: ProviderTestConfig[] = [
  {
    id: 'openai',
    envVar: 'OPENAI_API_KEY',
    createClient: (apiKey, modelId) =>
      Lang.openai({
        apiKey,
        model: modelId,
        systemPrompt: SYSTEM_PROMPT
      })
  },
  {
    id: 'openrouter',
    envVar: 'OPENROUTER_API_KEY',
    createClient: (apiKey, modelId) =>
      Lang.openrouter({
        apiKey,
        model: modelId,
        maxTokens: 128,
        maxCompletionTokens: 64,
        systemPrompt: SYSTEM_PROMPT,
        siteUrl: OPENROUTER_SITE_URL,
        siteName: OPENROUTER_SITE_NAME
      })
  },
  {
    id: 'anthropic',
    envVar: 'ANTHROPIC_API_KEY',
    createClient: (apiKey, modelId) =>
      Lang.anthropic({
        apiKey,
        model: modelId,
        systemPrompt: SYSTEM_PROMPT
      })
  }
];

describe('AIWrapper chat smoke tests', () => {
  for (const provider of providerConfigs) {
    const title = `${provider.id} chat models respond with "hey"`;
    const apiKey = process.env[provider.envVar];
    const chatModels = getChatModels(provider.id);

    if (PROVIDER_FILTERS.length > 0 && !PROVIDER_FILTERS.includes(provider.id)) {
      it.skip(`${title} (skipped by PROVIDERS filter)`, () => {});
      continue;
    }

    if (!apiKey) {
      it.skip(`${title} (set ${provider.envVar} to enable)`, () => {});
      continue;
    }

    if (chatModels.length === 0) {
      it.skip(`${title} (no chat models defined for ${provider.id})`, () => {});
      continue;
    }

    it(
      title,
      async () => {
        const modelsToTest = MODEL_LIMIT ? chatModels.slice(0, MODEL_LIMIT) : chatModels;
        const failures: Array<{ modelId: string; reason: string }> = [];

        for (const model of modelsToTest) {
          try {
            await expectModelToRespond(provider, apiKey, model);
          } catch (error) {
            const reason = error instanceof Error ? error.message : String(error);
            failures.push({ modelId: model.id, reason });
          }
        }

        if (failures.length > 0) {
          const message = failures
            .map(failure => ` - ${failure.modelId}: ${failure.reason}`)
            .join('\n');

          if (provider.id === 'openrouter') {
            const successes = modelsToTest.length - failures.length;
            if (successes <= 0) {
              throw new Error(
                `Provider ${provider.id} had no successful responses out of ${modelsToTest.length} models:\n${message}`
              );
            }

            // For OpenRouter we only require that at least one model works;
            // partial failures are expected as not all aggregated models may be exposed.
            console.warn(
              `Provider ${provider.id} had ${failures.length} partial failures out of ${modelsToTest.length} models:\n${message}`
            );
          } else {
            throw new Error(
              `Provider ${provider.id} failed for ${failures.length} of ${modelsToTest.length} models:\n${message}`
            );
          }
        }
      },
      computeTimeout(chatModels.length)
    );
  }
});

function parsePositiveInteger(value?: string): number | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }
  return Math.trunc(parsed);
}

function computeTimeout(modelCount: number): number {
  if (!Number.isFinite(modelCount) || modelCount <= 0) {
    return 15_000;
  }
  return Math.max(15_000, modelCount * TIMEOUT_PER_MODEL_MS);
}

function getChatModels(providerId: ProviderId) {
  const chatModels = models.fromProvider(providerId).can('chat');
  return Array.from(chatModels).filter(model => !IGNORED_MODEL_IDS.has(model.id));
}

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

async function expectModelToRespond(
  provider: ProviderTestConfig,
  apiKey: string,
  model: { id: string }
): Promise<void> {
  const client = provider.createClient(apiKey, model.id);
  const response = await client.ask(TEST_PROMPT);
  const answer = response.answer?.trim().toLowerCase() ?? '';

  if (!answer.includes('hey')) {
    throw new Error(`Unexpected answer "${response.answer ?? ''}"`);
  }
}
