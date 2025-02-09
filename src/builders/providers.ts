import type { Provider, ProvidersData } from '../types/index.ts';

// Import provider data
import openaiProvider from '../data/providers/openai.json' with { type: 'json' };
import anthropicProvider from '../data/providers/anthropic.json' with { type: 'json' };
import mistralProvider from '../data/providers/mistral.json' with { type: 'json' };

// Type guard to check if a price object is a token price
function isTokenPrice(price: any): price is { type: 'token'; input: number; output: number } {
  return price?.type === 'token' && typeof price.input === 'number' && typeof price.output === 'number';
}

// Type guard to check if a price object is an image price
function isImagePrice(price: any): price is { type: 'image'; price: number; size: string; unit: 'per_image' } {
  return price?.type === 'image' && typeof price.price === 'number' && typeof price.size === 'string' && price.unit === 'per_image';
}

// Type guard to check if a price object is a character price
function isCharacterPrice(price: any): price is { type: 'character'; price: number } {
  return price?.type === 'character' && typeof price.price === 'number';
}

// Type guard to check if a price object is a minute price
function isMinutePrice(price: any): price is { type: 'minute'; price: number } {
  return price?.type === 'minute' && typeof price.price === 'number';
}

/**
 * Validate and convert a raw provider object to a Provider type
 */
function validateProvider(raw: any): Provider {
  if (!raw?.id || typeof raw.id !== 'string' ||
      !raw?.name || typeof raw.name !== 'string' ||
      !raw?.websiteUrl || typeof raw.websiteUrl !== 'string' ||
      !raw?.apiUrl || typeof raw.apiUrl !== 'string' ||
      !raw?.models || typeof raw.models !== 'object') {
    throw new Error(`Invalid provider data: ${JSON.stringify(raw)}`);  
  }

  // Validate each model price
  Object.values(raw.models).forEach(price => {
    if (!isTokenPrice(price) && !isImagePrice(price) && !isCharacterPrice(price) && !isMinutePrice(price)) {
      throw new Error(`Invalid price data: ${JSON.stringify(price)}`);  
    }
  });

  return raw as Provider;
}

/**
 * Builds a combined list of all available providers.
 * This is a single source of truth for provider data.
 */
export function buildAllProviders(): Provider[] {
  return [
    validateProvider(openaiProvider),
    validateProvider(anthropicProvider),
    validateProvider(mistralProvider)
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
