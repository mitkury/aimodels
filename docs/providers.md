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

## TODO: Provider-Specific Model IDs

Some providers use different identifiers for the same model in their API (e.g., OpenAI uses "whisper-1" for their latest Whisper model). A future implementation should:

1. Add `modelMappings` field to Provider interface:
   ```typescript
   modelMappings?: Record<string, string>; // normalized ID -> provider ID
   ```

2. Store mappings in provider config:
   ```json
   {
     "id": "openai",
     "modelMappings": {
       "whisper-large-v3": "whisper-1"
     }
   }
   ```

3. Implement fallback behavior:
   - Use mapped ID if exists
   - Otherwise use normalized ID

This will allow the package to:
- Keep a consistent normalized interface
- Handle provider-specific model IDs internally
- Maintain clean provider configurations

## Model ID Mappings

Some providers may use different identifiers for the same model in their API. For example, OpenAI's API uses "whisper-1" to refer to the latest Whisper model. To handle these cases, providers can specify custom mappings from normalized model IDs to their API-specific IDs:

```typescript
// Example provider configuration
{
  "id": "openai",
  "name": "OpenAI",
  "modelMappings": {
    "whisper-large-v3": "whisper-1",
    "whisper-large-v3-turbo": "whisper-1"
  },
  "models": {
    "whisper-1": {
      "type": "minute",
      "price": 0.006
    }
  }
}
```

When no mapping exists for a model ID, the normalized ID is used as-is. This allows the package to:
1. Maintain a consistent normalized interface for consumers
2. Handle provider-specific model IDs internally
3. Keep provider configurations clean and maintainable

### Usage Example

```typescript
// Your code always uses normalized IDs
const whisperModel = models.id('whisper-large-v3');

// Internally, the package maps to provider-specific IDs
console.log(whisperModel.getProviderId('openai')); // Returns "whisper-1"
console.log(whisperModel.getProviderId('azure')); // Returns "whisper-large-v3"
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
