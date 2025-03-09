# aimodels

A collection of AI model specifications across different providers. This universal JavaScript package provides normalized data about AI models, including their capabilities, context windows, and pricing information. Works in any JavaScript runtime (Node.js, browsers, Deno).

## Use cases

aimodels is useful when you need to programmatically access info about AI models and their capabilities. It's ideal for frameworks or applications that interact with different models, need to run inference across various providers or show info about models in the UI.

aimodels powers: 
- [aimodels.dev](https://aimodels.dev) - a website about AI models
- [aiwrapper](https://github.com/mitkury/aiwrapper) - an AI wrapper for running AI models ([aiwrapper.dev](https://aiwrapper.dev))
- [Supa](https://github.com/supaorg/supa) - an open alternative to ChatGPT ([supa.cloud](https://supa.cloud))

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
// Example output: ["GPT-4o", "GPT-4 Vision", ...]

// 3. Check if a specific model can process images
const model = models.id('gpt-4o');
if (model?.canSee()) {
  console.log(`${model.name} can process images`);
  // Enable image upload in your UI
  const allowAttachingImgs = true;
}

// You can also check multiple capabilities with a single method
if (model?.hasCapabilities('img-in', 'chat')) {
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

// 4. Make decisions based on context window size
function selectModelBasedOnInputLength(inputTokens) {
  // Find models that can handle your content's size
  const suitableModels = models.canChat().filter(model => 
    (model.context.total || 0) >= inputTokens
  );
  
  // Sort by context window size (smallest suitable model first)
  return suitableModels.sort((a, b) => 
    (a.context.total || 0) - (b.context.total || 0)
  )[0];
}

const contentLength = 10000; // tokens
const recommendedModel = selectModelBasedOnInputLength(contentLength);
console.log(`Recommended model: ${recommendedModel?.name}`);

// 5. Utility function to trim chat messages to fit a model's context window
function trimChatHistory(messages, model, reserveTokens = 500) {
  // Only proceed if we have a valid model with a context window
  if (!model || !model.context?.total) {
    console.warn('Invalid model or missing context window information');
    return messages;
  }
  
  const contextWindow = model.context.total;
  let totalTokens = 0;
  const availableTokens = contextWindow - reserveTokens;
  const trimmedMessages = [];
  
  // This is a simplified token counting approach
  // In production, you may use a proper tokenizer for your model
  for (const msg of messages.reverse()) {
    // If the model can't process images, remove any image attachments
    if (!model.canSee() && msg.attachments?.some(a => a.type === 'image')) {
      msg.attachments = msg.attachments.filter(a => a.type !== 'image');
    }
    
    const estimatedTokens = JSON.stringify(msg).length / 4;
    if (totalTokens + estimatedTokens <= availableTokens) {
      trimmedMessages.unshift(msg);
      totalTokens += estimatedTokens;
    } else {
      break;
    }
  }
  
  return trimmedMessages;
}

// Example usage
const chatHistory = [/* array of message objects */];
const gpt4 = models.id('gpt-4');
const fittedMessages = trimChatHistory(chatHistory, gpt4);
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
models.id('gpt-4o')            // Find a specific model by ID
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
