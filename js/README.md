# AIModels

A collection of AI model specifications across different providers. This universal JavaScript package provides normalized data about AI models, including their capabilities, context windows, and pricing information. Works in any JavaScript runtime (Node.js, browsers, Deno).

## Installation

```bash
npm install aimodels
```

## Usage

```typescript
import { models } from 'aimodels';

// Find models by capability using fluent API
const chatModels = models.canChat();
const visionModels = models.canSee();
const reasoningModels = models.canReason();

// Chain methods for more specific filtering
const smartVisionModels = models.canChat().canReason().canSee();
const multimodalAssistants = models.canChat().canSee().canHear();
const fullStackModels = models.canChat().canCallFunctions().canOutputJSON();

// Audio capabilities
const speechModels = models.canHear().canSpeak();

// Text processing
const textProcessors = models.canRead().canWrite();

// Available fluent API methods:
// - canChat() - models with chat capability
// - canReason() - models with reasoning capability
// - canRead() - models that can process text input
// - canWrite() - models that can output text
// - canSee() - models that understand images
// - canGenerateImages() - models that can create images
// - canHear() - models that understand audio
// - canSpeak() - models that can generate speech
// - canOutputJSON() - models that provide structured JSON output
// - canCallFunctions() - models with function calling capability
// - canGenerateEmbeddings() - models that output vector embeddings

// Find models by provider
const openaiModels = models.fromProvider('openai');

// Find models by creator
const metaModels = models.fromCreator('meta');

// Find models by context window
const largeContextModels = models.withMinContext(32768);

// Find specific model
const model = models.id('gpt-4o');
console.log(model?.context.total); // Context window size
console.log(model?.providers); // ['openai']
```

## Features

- Comprehensive database of AI models from major providers (OpenAI, Anthropic, Mistral, etc.)
- Normalized data structure for easy comparison
- Intuitive fluent API for filtering models by capabilities
- Context window information
- Creator and provider associations
- TypeScript support with full type safety
- Zero dependencies
- Universal JavaScript support (Node.js, browsers, Deno)
- Regular updates with new models

## Types

### Model
```typescript
interface Model {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Model capabilities */
  can: Capability[];
  /** Available providers */
  providers: string[];
  /** Context window information */
  context: ModelContext;
  /** License or creator */
  license: string;
}
```

For more detailed information, see:
- [Model Capabilities](/docs/model-capabilities.md)
- [Model Structure](/docs/model-structure.md)
- [Providers](/docs/providers.md)

## License

MIT
