# aimodels

A collection of AI model specifications across different providers. This universal JavaScript package provides normalized data about AI models, including their capabilities, context windows, and pricing information. Works in any JavaScript runtime (Node.js, browsers, Deno).

## Use cases

aimodels is useful when you need to programmatically access info about AI models and their capabilities. It's ideal for frameworks or applications that interact with different models, need to run inference across various providers or show info about models in the UI.

aimodels powers: 
- [aimodels.dev](https://aimodels.dev) - a website about AI models
- [aiwrapper](https://github.com/mitkury/aiwrapper) - an AI wrapper for running AI models
- [Sila](https://github.com/silaorg/sila) - an open alternative to ChatGPT

## Installation

```bash
npm install aimodels
```

## Usage

```typescript
import { models } from 'aimodels';

// 1. Get all models that support chat functionality
const chatModels = models.canChat();
console.log(`Available chat models: ${chatModels.length}`);
// Example output: "Available chat models: 99"

// 2. Find all chat models with vision capabilities from OpenAI
const visionModelsFromOpenAI = models.canChat().canSee().fromProvider('openai');
console.log(visionModelsFromOpenAI.map(model => model.name));
// Example output: ["GPT-5", "GPT-5.1", ...]

// 3. Check if a specific model can process images
const model = models.id('gpt-5.1');
if (model?.canSee()) {
  console.log(`${model.name} can process images`);
  // Enable image upload in your UI
  const allowAttachingImgs = true;
}

// You can also check multiple capabilities with a single method
if (model?.can('img-in', 'chat')) {
  console.log(`${model.name} can both chat and understand images`);
}

// And use capability checks to make UI decisions
function renderModelControls(model) {
  return {
    showImageUpload: model.canSee(),
    showAudioRecorder: model.canHear(),
    showFunctionEditor: model.canCallFunctions(),
    showResponseFormatting: model.canOutputJSON(),
  };
}

```

### Available API Methods

```typescript
// Capability methods
models.canChat()               // Models with chat capability
models.canReason()             // Models with reasoning capability
models.canRead()               // Models that can process text input
models.canWrite()              // Models that can output text
models.canSee()                // Models that understand images
models.canGenerateImages()     // Models that can create images
models.canHear()               // Models that understand audio
models.canSpeak()              // Models that can generate speech
models.canOutputJSON()         // Models that provide structured JSON output
models.canCallFunctions()      // Models with function calling capability
models.canGenerateEmbeddings() // Models that output vector embeddings

// Provider and creator methods
models.fromProvider('openai')  // Find models by provider
models.fromCreator('meta')     // Find models by creator

// Context window methods
models.withMinContext(32768)   // Find models with at least this context size

// Model lookup
models.id('gpt-5.1')           // Find a specific model by ID
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

## License

MIT

## Development

### Build Process

This project uses [tsup](https://github.com/egoist/tsup) (built on esbuild) for bundling. The build process is simple:

```bash
# Build the complete package and test
npm run build
```
