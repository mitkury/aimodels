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

## Features

- Comprehensive database of AI models
- Normalized data structure for easy comparison
- Regular updates with new models
- TypeScript support
- Zero dependencies
- Universal JavaScript support (Node.js, browsers, Deno)


## License

MIT
