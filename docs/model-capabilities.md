# Model Capabilities

This document outlines what AI models can do using a simple, intuitive "can"
system.

## Core Structure

```json
{
  "can": [
    "chat", // basic text chat/completion
    "img-in", // understand images
    "img-out", // generate images
    "sound-in", // process audio input
    "sound-out", // generate audio/speech
    "json-out", // structured JSON output
    "function-out", // function calling
    "vectors-out", // output vector embeddings
    "text-out", // output text
    "reason", // advanced reasoning capabilities
    "text-in" // process text input
  ]
}
```

## Examples by Model Type

### Multimodal Chat Models (GPT-4V, Claude 3)

```json
{
  "can": ["chat", "text-in", "img-in", "json-out", "function-out"]
}
```

### Image Generation Models (DALL-E 3, Stable Diffusion)

```json
{
  "can": ["text-in", "img-out"]
}
```

### Speech Models (Whisper)

```json
{
  "can": ["sound-in", "text-out"]
}
```

### Text-to-Speech Models (ElevenLabs)

```json
{
  "can": ["text-in", "sound-out"]
}
```

### Embedding Models (CLIP)

```json
{
  "can": ["text-in", "img-in", "vectors-out"]
}
```

## Using in Code

```typescript
// Type definitions
type Capability =
  | "chat"
  | "img-in"
  | "img-out"
  | "sound-in"
  | "sound-out"
  | "json-out"
  | "function-out"
  | "text-to-vec"
  | "img-to-vec"
  | "reason"
  | "text-in";

interface Model {
  can: (...capabilities: Capability[]) => boolean;
}

// Usage examples
// Check single capability
if (model.can("chat")) {
  // use for chat
}

// Check multiple capabilities
if (model.can("img-in", "json-out")) {
  // use for image analysis with structured output
}

// Filter models
const imageModels = models.filter((m) => m.can("img-in"));
const multimodal = models.filter((m) => m.can("chat", "img-in"));
```

## Capability Descriptions

- **chat**: Text generation and understanding, including code
- **img-in**: Process and understand images
- **img-out**: Generate images
- **sound-in**: Process audio input and speech recognition
- **sound-out**: Generate audio and speech
- **json-out**: Generate structured JSON output
- **function-out**: Handle function calling and API interactions
- **text-to-vec**: Generate text embeddings
- **img-to-vec**: Generate image embeddings

## Design Rationale

1. **Simple API**: Using "can" makes the API intuitive and readable
2. **Concise JSON**: Shorter property name reduces data size
3. **Natural Language**: Reads naturally in code: `model.can("chat")`
4. **Input/Output Pattern**: Uses intuitive "-in" and "-out" suffixes
5. **Vector Operations**: Special "-to-vec" suffix for embeddings
6. **Extensibility**: Easy to add new capabilities following the pattern

## Implementation Notes

- Models can have multiple capabilities
- Capabilities are represented as an array of strings
- All capability strings are lowercase with hyphen separators
- The `can()` method supports checking multiple capabilities
- Type system ensures valid capability strings
