# Model Capabilities

This document outlines the capabilities system used in the `aimodels` package to describe what AI models can do.

## TypeScript Definition

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

## Example Usage

```typescript
// Find models that can chat
const chatModels = models.can("chat");

// Find models that can process images and chat
const visionModels = models.can("chat", "img-in");

// Find models that can generate images
const imageGenerators = models.can("img-out");

// Find models that can do function calling
const functionModels = models.can("fn-out");
```

## Examples by Model Type

### Multimodal Chat Models (GPT-4V, Claude 3)

```json
{
  "can": ["chat", "txt-in", "img-in", "json-out", "fn-out"]
}
```

### Image Generation Models (DALL-E 3, Stable Diffusion)

```json
{
  "can": ["txt-in", "img-out"]
}
```

### Speech Models (Whisper)

```json
{
  "can": ["audio-in", "txt-out"]
}
```

### Text-to-Speech Models (ElevenLabs)

```json
{
  "can": ["txt-in", "audio-out"]
}
```

### Embedding Models (CLIP)

```json
{
  "can": ["txt-in", "img-in", "vec-out"]
}
```

## Using in Code

```typescript
// Type definitions
type Capability =
  | "chat"
  | "img-in"
  | "img-out"
  | "audio-in"
  | "audio-out"
  | "json-out"
  | "fn-out"
  | "vec-out"
  | "reason"
  | "txt-in";

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
- **audio-in**: Process audio input and speech recognition
- **audio-out**: Generate audio and speech
- **json-out**: Generate structured JSON output
- **fn-out**: Handle function calling and API interactions
- **vec-out**: Generate vector embeddings

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
