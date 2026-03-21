import { describe, expect, it, vi } from 'vitest';
import type { Model } from '../dist/index.js';
import type { LanguageProvider } from 'aiwrapper';

/**
 * AIWrapper imports the published aimodels package, so we remap it to the
 * freshly built data from this repository for the tests.
 */
vi.mock('aimodels', async () => {
  return await import('../dist/index.js');
});

import { AIModels as AIWrapperAIModels, Lang } from 'aiwrapper';
import { ModelCollection, models } from '../dist/index.js';

// Ensure AIWrapper uses the freshly built local data even if its own dependency is older
syncAiWrapperData();

type ProviderId = 'openai' | 'openrouter' | 'anthropic' | 'google';

interface ProviderTestConfig {
  id: ProviderId;
  envVars: string[];
  createClient: (apiKey: string, model: Model) => LanguageProvider;
}

const TEST_PROMPT = 'Respond with exactly the word "hey", nothing else.';
const IGNORED_MODEL_IDS = new Set<string>(['computer-use-preview-2025-03-11']);

const PROVIDER_FILTERS = getProviderFilters();
const MODEL_FILTERS = getModelFilters();

const providerConfigs: ProviderTestConfig[] = [
  {
    id: 'openai',
    envVars: ['OPENAI_API_KEY'],
    createClient: (apiKey, model) =>
      Lang.openai({
        apiKey,
        model: model.id
      })
  },
  {
    id: 'openrouter',
    envVars: ['OPENROUTER_API_KEY'],
    createClient: (apiKey, model) =>
      Lang.openrouter({
        apiKey,
        model: `${model.creatorId}/${model.id}`
      })
  },
  {
    id: 'anthropic',
    envVars: ['ANTHROPIC_API_KEY'],
    createClient: (apiKey, model) =>
      Lang.anthropic({
        apiKey,
        model: model.id
      })
  },
  {
    id: 'google',
    envVars: ['GOOGLE_API_KEY', 'GEMINI_API_KEY'],
    createClient: (apiKey, model) =>
      Lang.google({
        apiKey,
        model: model.id
      })
  }
];

describe('AIWrapper chat smoke tests', async () => {
  // Gather all AIWrapper providers that are actually configured via .env
  const enabledProviders = providerConfigs.filter(providerConfig => {
    const hasApiKey = getApiKey(providerConfig) !== undefined;
    const isAllowedByFilter =
      PROVIDER_FILTERS.length === 0 || PROVIDER_FILTERS.includes(providerConfig.id);
    return hasApiKey && isAllowedByFilter;
  });

  if (enabledProviders.length === 0) {
    it.skip('AIWrapper chat models (no providers enabled via env/PROVIDERS)', () => { });
    return;
  }

  for (const provider of enabledProviders) {
    it(`${provider.id} chat models respond with "hey"`, async () => {
      const apiKey = getApiKey(provider)!;
      const chatModels = getChatModels(provider.id);

      if (chatModels.length === 0) {
        it.skip(`(no chat models defined for ${provider.id})`, () => { });
        return;
      }

      const modelsToTest = chatModels;
      const failures: Array<{ modelId: string; reason: string }> = [];

      console.log(
        `Running AIWrapper chat smoke tests for provider "${provider.id}" on ${modelsToTest.length} model(s)`
      );

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
        throw new Error(
          `Provider ${provider.id} failed for ${failures.length} of ${modelsToTest.length} models:\n${message}`
        );
      }
    });
  }
});

function getChatModels(providerId: ProviderId): Model[] {
  const chatModels = models.fromProvider(providerId).can('chat');
  return Array.from(chatModels).filter(model => {
    if (IGNORED_MODEL_IDS.has(model.id)) {
      return false;
    }

    if (MODEL_FILTERS.length === 0) {
      return true;
    }

    return MODEL_FILTERS.includes(model.id);
  });
}

function syncAiWrapperData(): void {
  if (Object.keys(ModelCollection.modelSources).length === 0) {
    return;
  }

  AIWrapperAIModels.addStaticData({
    models: ModelCollection.modelSources,
    providers: ModelCollection.providersData,
    orgs: ModelCollection.orgsData
  });
}

async function expectModelToRespond(
  provider: ProviderTestConfig,
  apiKey: string,
  model: Model
): Promise<void> {
  const client = provider.createClient(apiKey, model);
  const response = await client.ask(TEST_PROMPT);
  const answer = response.answer?.trim().toLowerCase();
  expect(answer).toContain('hey');
}

function getProviderFilters(): ProviderId[] {
  const rawValue =
    process.env.PROVIDERS ??
    process.env.PROVIDER ??
    process.env.npm_config_providers ??
    process.env.npm_config_provider ??
    getArgValue('--providers') ??
    getArgValue('--provider') ??
    getArgValue('--provider-id') ??
    process.env.npm_config_PROVIDERS ??
    getProvidersFromArgv();

  if (!rawValue) {
    return [];
  }

  const allowed: ProviderId[] = ['openai', 'openrouter', 'anthropic', 'google'];

  const parsed = rawValue
    .split(',')
    .map(provider => provider.trim().toLowerCase())
    .filter((provider): provider is ProviderId => allowed.includes(provider as ProviderId));

  // Deduplicate while preserving order
  return Array.from(new Set(parsed));
}

function getApiKey(provider: ProviderTestConfig): string | undefined {
  for (const envVar of provider.envVars) {
    const value = process.env[envVar];
    if (value) {
      return value;
    }
  }

  return undefined;
}

function getModelFilters(): string[] {
  const rawValue =
    process.env.MODELS ??
    process.env.MODEL ??
    process.env.npm_config_models ??
    process.env.npm_config_model ??
    getArgValue('--models') ??
    getArgValue('--model');

  if (!rawValue) {
    return [];
  }

  return Array.from(
    new Set(
      rawValue
        .split(',')
        .map(model => model.trim())
        .filter(Boolean)
    )
  );
}

function getProvidersFromArgv(): string | undefined {
  return getArgValue('--providers');
}

function getArgValue(flag: string): string | undefined {
  const inline = process.argv.find(arg => arg.startsWith(`${flag}=`));
  if (inline) {
    return inline.split('=')[1];
  }

  const flagIndex = process.argv.indexOf(flag);
  if (flagIndex !== -1 && process.argv[flagIndex + 1]) {
    return process.argv[flagIndex + 1];
  }

  return undefined;
}
