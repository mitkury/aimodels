# AIModels

A collection of AI model specifications across different providers. This package provides normalized data about AI models, including their capabilities, context windows, and pricing information.

## Installation

```bash
npm install aimodels
```

## Usage

```typescript
import { models } from 'aimodels';

// Get all available models
console.log(models.all);

// Get list of all providers
console.log(models.providers); // ['openai', 'anthropic', 'mistral', ...]

// Get list of model creators
console.log(models.creators); // ['meta', 'mistral', ...]

// Get models from a specific provider
const openAiModels = models.fromProvider('openai');

// Get models from a specific creator
const metaModels = models.fromCreator('meta');

// Find a specific model
const model = models.find('gpt-4');
console.log(model?.context.total); // Context window size
console.log(model?.providers); // ['openai']

// Get model pricing for a specific provider
const price = models.getPrice('gpt-4', 'openai');
console.log(price); // { type: 'token', input: 0.03, output: 0.06 }

// Filter models by capabilities
const chatModels = models.can('chat');
const multimodalModels = models.can('chat', 'img-in');

// Filter by context window
const largeContextModels = models.withMinContext(32768);
```

## Features

- Comprehensive database of AI models from major providers (OpenAI, Anthropic, Mistral, etc.)
- Normalized data structure for easy comparison
- Model capabilities (chat, img-in, img-out, function-out, etc.)
- Context window information
- Pricing information per provider
- Creator and provider associations
- TypeScript support with full type safety
- Zero dependencies
- Universal JavaScript support (Node.js, browsers, Deno)
- Regular updates with new models


## Types

```typescript
interface Model {
  id: string;           // Unique model identifier
  name: string;         // Display name
  can: string[];        // Capabilities (chat, img-in, img-out, etc.)
  providers: string[];  // Available providers
  context: {
    total: number;      // Total context window size
  };
  license: string;      // License or creator
}

type ModelPrice = 
  | { type: 'token'; input: number; output: number }      // Price per 1K tokens
  | { type: 'image'; price: number; size: string }        // Price per image
  | { type: 'character'; price: number }                  // Price per character
  | { type: 'minute'; price: number };                    // Price per minute

interface Provider {
  id: string;           // Provider identifier
  name: string;         // Display name
  websiteUrl: string;   // Provider's website
  apiUrl: string;       // API documentation URL
  models: Record<string, ModelPrice>;  // Model pricing
}
```

## License

MIT
