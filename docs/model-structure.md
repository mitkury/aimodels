# Model Data Structure

This document outlines the standardized structure for representing AI models. For pricing information, see [provider-pricing.md](./provider-pricing.md).

## Core Structure

```json
{
  "id": "gpt-4-vision-preview",
  "name": "GPT-4V",
  "creator": "OpenAI",
  "license": "proprietary",
  "providers": ["openai", "azure"],
  
  "can": [
    "chat",
    "img-in",
    "json-out",
    "function-out"
  ],

  "context": {
    "total": 128000,
    "maxOutput": 4000
  }
}
```

## Field Descriptions

### Core Metadata
- **id**: Unique identifier for the model
- **name**: Display name for the model
- **creator**: Organization that created the model
- **license**: License type (e.g., "proprietary", "apache-2.0", "mit", "llama-2-community")
- **providers**: Array of provider IDs that can serve this model

### Capabilities
See [model-capabilities.md](./model-capabilities.md) for detailed documentation.
```json
"can": ["chat", "img-in", "json-out"]
```

### Context Window
```json
"context": {
  "total": 128000,        // maximum input tokens
  "maxOutput": 4000,      // maximum output tokens
  "outputIsFixed": 1      // optional, for models with fixed output limit
}
```

## Examples

### Proprietary Multi-Provider Model
```json
{
  "id": "gpt-4-vision-preview",
  "name": "GPT-4V",
  "creator": "OpenAI",
  "license": "proprietary",
  "providers": ["openai", "azure"],
  "can": ["chat", "img-in", "json-out", "function-out"],
  "context": {
    "total": 128000,
    "maxOutput": 4000
  }
}
```

### Open Source Model
```json
{
  "id": "llama-2-70b-chat",
  "name": "Llama 2 70B Chat",
  "creator": "Meta",
  "license": "llama-2-community",
  "providers": [
    "replicate",
    "ollama",
    "together",
    "anyscale"
  ],
  "can": ["chat", "function-out"],
  "context": {
    "total": 4096,
    "maxOutput": 4096
  }
}
```

### Image Generation Model
```json
{
  "id": "stable-diffusion-xl",
  "name": "Stable Diffusion XL",
  "creator": "Stability AI",
  "license": "openrail++",
  "providers": [
    "replicate",
    "stability",
    "ollama",
    "huggingface"
  ],
  "can": ["img-out"]
}
```

## Design Rationale

1. **Multi-provider Support**: Models can be served by multiple providers (e.g., OpenAI models through Azure)
2. **Capability-based**: Uses the intuitive "can" system for declaring model capabilities
3. **License Tracking**: Includes licensing information for compliance and filtering
4. **Context Management**: Clear specification of context window limitations
5. **Extensible**: Structure can accommodate new model types and capabilities

## Implementation Notes

- All string fields should use kebab-case
- Provider IDs should match those in the providers configuration
- Capabilities should match the standardized list in model-capabilities.md
- Context window values are in tokens
- Pricing information is stored separately in provider configurations
