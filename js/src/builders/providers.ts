import type { Provider, ProvidersData } from '../types/index.ts';

// Import provider data from root data directory
import openaiProvider from '@data/providers/openai-provider.json' with { type: 'json' };
import anthropicProvider from '@data/providers/anthropic-provider.json' with { type: 'json' };
import mistralProvider from '@data/providers/mistral-provider.json' with { type: 'json' };
import cohereProvider from '@data/providers/cohere-provider.json' with { type: 'json' };
import xaiProvider from '@data/providers/xai-provider.json' with { type: 'json' };
import googleProvider from '@data/providers/google-provider.json' with { type: 'json' };
import deepseekProvider from '@data/providers/deepseek-provider.json' with { type: 'json' };
import groqProvider from '@data/providers/groq-provider.json' with { type: 'json' };
import azureProvider from '@data/providers/azure-provider.json' with { type: 'json' };

// Type guard to check if a price object is a token price
function isTokenPrice(price: unknown): price is { type: 'token'; input: number; output: number } {
  return typeof price === 'object' && price !== null && 
    'type' in price && (price as { type: string }).type === 'token' &&
    'input' in price && typeof (price as { input: unknown }).input === 'number' &&
    'output' in price && typeof (price as { output: unknown }).output === 'number';
}

// Type guard to check if a price object is an image price
function isImagePrice(price: unknown): price is { type: 'image'; price: number; size: string; unit: 'per_image' } {
  return typeof price === 'object' && price !== null &&
    'type' in price && (price as { type: string }).type === 'image' &&
    'price' in price && typeof (price as { price: unknown }).price === 'number' &&
    'size' in price && typeof (price as { size: unknown }).size === 'string' &&
    'unit' in price && (price as { unit: string }).unit === 'per_image';
}

// Type guard to check if a price object is a character price
function isCharacterPrice(price: unknown): price is { type: 'character'; price: number } {
  return typeof price === 'object' && price !== null &&
    'type' in price && (price as { type: string }).type === 'character' &&
    'price' in price && typeof (price as { price: unknown }).price === 'number';
}

// Type guard to check if a price object is a minute price
function isMinutePrice(price: unknown): price is { type: 'minute'; price: number } {
  return typeof price === 'object' && price !== null &&
    'type' in price && (price as { type: string }).type === 'minute' &&
    'price' in price && typeof (price as { price: unknown }).price === 'number';
}

// Type guard to check if a price object is a search price
function isSearchPrice(price: unknown): price is { type: 'search'; price: number } {
  return typeof price === 'object' && price !== null &&
    'type' in price && (price as { type: string }).type === 'search' &&
    'price' in price && typeof (price as { price: unknown }).price === 'number';
}

/**
 * Validate and convert a raw provider object to a Provider type
 */
function validateProvider(raw: unknown): Provider {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Provider data must be an object');
  }

  const provider = raw as Record<string, unknown>;

  // Validate Creator fields
  if (typeof provider.id !== 'string') {
    throw new Error('Provider id must be a string');
  }
  if (typeof provider.name !== 'string') {
    throw new Error('Provider name must be a string');
  }
  if (typeof provider.websiteUrl !== 'string') {
    throw new Error('Provider websiteUrl must be a string');
  }
  if (typeof provider.country !== 'string') {
    throw new Error('Provider country must be a string');
  }
  if (typeof provider.founded !== 'number') {
    throw new Error('Provider founded must be a number');
  }

  // Validate Provider fields
  if (typeof provider.apiUrl !== 'string') {
    throw new Error('Provider apiUrl must be a string');
  }
  if (typeof provider.apiDocsUrl !== 'string') {
    throw new Error('Provider apiDocsUrl must be a string');
  }
  if (typeof provider.pricing !== 'object' || provider.pricing === null) {
    throw new Error('Provider pricing must be an object');
  }

  // Validate each model price
  const pricing = provider.pricing as Record<string, unknown>;
  Object.values(pricing).forEach(price => {
    if (!isTokenPrice(price) && !isImagePrice(price) && !isCharacterPrice(price) && !isMinutePrice(price) && !isSearchPrice(price)) {
      throw new Error(`Invalid price data: ${JSON.stringify(price)}`);
    }
  });

  // At this point we've verified all required fields
  return {
    id: provider.id as string,
    name: provider.name as string,
    websiteUrl: provider.websiteUrl as string,
    country: provider.country as string,
    founded: provider.founded as number,
    apiUrl: provider.apiUrl as string,
    apiDocsUrl: provider.apiDocsUrl as string,
    pricing: provider.pricing as Provider['pricing'],
    ...(provider.defaultModel ? { defaultModel: provider.defaultModel as string } : {}),
    ...(provider.isLocal ? { isLocal: provider.isLocal as number } : {})
  };
}

/**
 * Builds a combined list of all available providers.
 * This is a single source of truth for provider data.
 */
export function buildAllProviders(): Provider[] {
  return [
    validateProvider(openaiProvider),
    validateProvider(anthropicProvider),
    validateProvider(mistralProvider),
    validateProvider(cohereProvider),
    validateProvider(xaiProvider),
    validateProvider(googleProvider),
    validateProvider(deepseekProvider),
    validateProvider(groqProvider),
    validateProvider(azureProvider)
  ];
}

/**
 * Builds the full providers data structure.
 */
export function buildProvidersData(): ProvidersData {
  return {
    providers: buildAllProviders()
  };
}
