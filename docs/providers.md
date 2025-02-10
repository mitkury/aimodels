# Providers

This document outlines how provider information is structured in the `aimodels` package.

## TypeScript Definition

```typescript
interface Provider {
  /** Provider identifier */
  id: string;
  /** Display name */
  name: string;
  /** Provider's website URL */
  websiteUrl: string;
  /** API documentation URL */
  apiUrl: string;
  /** Pricing information for models */
  models: Record<string, ModelPrice>;
}

interface ModelPrice {
  /** Price type (token, image, audio) */
  type: string;
  /** Price per million input tokens (for token-based models) */
  input?: number;
  /** Price per million output tokens (for token-based models) */
  output?: number;
  /** Price per image (for image-based models) */
  price?: number;
  /** Image size (for image-based models) */
  size?: string;
}
```

## Example Usage

```typescript
// Find models from a specific provider
const openaiModels = models.fromProvider('openai');

// Check if a model is available from multiple providers
const gpt4 = models.id('gpt-4');
console.log(gpt4?.providers); // ['openai', 'azure']

// Get all providers that offer a specific model
const providers = gpt4?.providers ?? [];
```

## Example Provider Data

```json
{
  "id": "openai",
  "name": "OpenAI",
  "websiteUrl": "https://openai.com",
  "apiUrl": "https://platform.openai.com/docs/api-reference",
  "models": {
    "gpt-4": {
      "type": "token",
      "input": 0.03,
      "output": 0.06
    },
    "gpt-3.5-turbo": {
      "type": "token",
      "input": 0.0015,
      "output": 0.002
    },
    "dall-e-3": {
      "type": "image",
      "price": 0.04,
      "size": "1024x1024"
    }
  }
}
```
