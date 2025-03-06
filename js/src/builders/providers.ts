import type { Provider, ProvidersData, SourceProvider } from '../types/providers';

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
import awsProvider from '@data/providers/aws-provider.json' with { type: 'json' };
import bedrockProvider from '@data/providers/bedrock-provider.json' with { type: 'json' };
import oracleProvider from '@data/providers/oracle-provider.json' with { type: 'json' };

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

// Validation function
function validateProvider(provider: SourceProvider): boolean {
  if (!provider.id || !provider.name || !provider.websiteUrl || !provider.apiUrl) {
    console.error(`Provider with id "${provider.id}" missing required fields`);
    return false;
  }
  return true;
}

interface SourceProvider {
  id: string;
  name: string;
  websiteUrl: string;
  apiUrl: string;
  models?: Record<string, unknown>;
}

/**
 * Builds a combined list of all available providers.
 * This is a single source of truth for provider data.
 */
export function buildAllProviders(): Provider[] {
  try {
    // Combine all providers - using the imports from the top of the file
    return [
      openaiProvider,
      anthropicProvider,
      mistralProvider,
      cohereProvider,
      xaiProvider,
      googleProvider,
      deepseekProvider,
      groqProvider,
      azureProvider,
      awsProvider,
      bedrockProvider,
      oracleProvider
    ].map(provider => ({
      id: provider.id,
      name: provider.name,
      websiteUrl: provider.websiteUrl,
      apiUrl: provider.apiUrl,
      models: provider.models || {}
    }));
  } catch (error) {
    console.error('Error building providers:', error);
    return [];
  }
}

/**
 * Builds the full providers data structure.
 */
export function buildProvidersData(): ProvidersData {
  return {
    providers: buildAllProviders()
  };
}
