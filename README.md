# AIModels

A collection of AI model specifications across different providers. This package provides normalized data about AI models, including their capabilities, context windows, and pricing information.

## Installation

```bash
npm install aimodels
```

## Usage

```typescript
import { models } from 'aimodels';

// Find models by capability
const chatModels = models.can('chat');
const multimodalModels = models.can('chat', 'img-in');

// Find models by provider
const openaiModels = models.fromProvider('openai');

// Find models by creator
const metaModels = models.fromCreator('meta');

// Find models by context window
const largeContextModels = models.withMinContext(32768);

// Find specific model
const model = models.id('gpt-4');
console.log(model?.context.total); // Context window size
console.log(model?.providers); // ['openai']
```

## Features

- Comprehensive database of AI models from major providers (OpenAI, Anthropic, Mistral, etc.)
- Normalized data structure for easy comparison
- Model capabilities (chat, img-in, img-out, function-out, etc.)
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

### Capabilities
```typescript
type Capability =
  | "chat"         // shortcut for "txt-in" and "txt-out"
  | "reason"       // when the model spends some tokens on reasoning
  | "txt-in"       // process text input
  | "txt-out"      // output text
  | "img-in"       // understand images
  | "img-out"      // generate images
  | "audio-in"     // process audio input
  | "audio-out"    // generate audio/speech
  | "json-out"     // structured JSON output
  | "fn-out"       // function calling
  | "vec-out";     // output vector embeddings
```

For more detailed information, see:
- [Model Capabilities](/docs/model-capabilities.md)
- [Model Structure](/docs/model-structure.md)
- [Providers](/docs/providers.md)

## License

MIT
