# allmodels

A collection of AI model specifications across different providers. This package provides normalized data about AI models, including their capabilities, context windows, and pricing information.

## Installation

```bash
npm install allmodels
```

## Usage

```typescript
import { models } from 'allmodels';

// Get all available models
console.log(models.all);

// Get list of all providers
console.log(models.providers); // ['openai', 'anthropic', 'meta', ...]

// Get models from a specific provider
const openAiModels = models.from('openai');

// Find a specific model
const model = models.find('deepseek-r1');
console.log(model.contextWindow);
console.log(model.providers); 
console.log(model.pricing.input);

// Filter models by capability
const chatModels = models.withCapability('chat');

// Filter by context window
const largeContextModels = models.withMinContext(32768);

// Filter by maximum price
const affordableModels = models.withMaxPrice(0.01); // Max $0.01 per 1K tokens
```

## Data Structure

Each model entry contains the following information:

```typescript
interface ModelSpec {
  id: string;                 // Unique identifier for the model
  name: string;              // Display name
  provider: string;          // Provider (e.g., 'openai', 'anthropic', etc.)
  contextWindow: number;     // Maximum context window size in tokens
  capabilities: string[];    // Array of capabilities (e.g., ['chat', 'completion'])
  pricing: {
    input: number;          // Cost per 1K input tokens in USD
    output: number;         // Cost per 1K output tokens in USD
  };
  released: string;         // Release date
  license?: string;         // License information for open-source models
  trainingData?: string[];  // Known training data sources
  parameters?: number;      // Number of parameters (if known)
}
```

## Features

- Comprehensive database of AI models
- Normalized data structure for easy comparison
- Regular updates with new models
- TypeScript support
- Zero dependencies
- Universal JavaScript support (Node.js, browsers, Deno)

## Contributing

Contributions are welcome! Please check our contributing guidelines for details on how to submit new models or updates.

## License

MIT
