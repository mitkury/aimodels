# Model Pricing Structure Design

This document outlines the different pricing structures for various types of AI models.

## Token-based Models
Used for text generation models like GPT-4, Claude, etc.

```json
{
  "pricing": {
    "type": "token",
    "input": 0.03,
    "output": 0.06,
    "unit": "USD/1K tokens"
  }
}
```

## Image Generation Models
Used for models like DALL-E, Stable Diffusion, etc.

```json
{
  "pricing": {
    "type": "image",
    "tiers": [
      {
        "size": "1024x1024",
        "price": 0.04
      },
      {
        "size": "512x512",
        "price": 0.02
      }
    ],
    "unit": "USD/image"
  }
}
```

## Vision Models (Multimodal)
Used for models that handle both text and images like GPT-4V.

```json
{
  "pricing": {
    "type": "multimodal",
    "text": {
      "input": 0.01,
      "output": 0.03,
      "unit": "USD/1K tokens"
    },
    "image": {
      "price": 0.01,
      "unit": "USD/image"
    }
  }
}
```

## Audio Models
Used for speech-to-text models like Whisper.

```json
{
  "pricing": {
    "type": "audio",
    "price": 0.006,
    "unit": "USD/minute"
  }
}
```

## Benefits of This Structure

1. **Type Differentiation**: Clear distinction between different pricing models through the `type` field
2. **Flexible Units**: Each pricing type can specify its own units
3. **Tiered Pricing Support**: Supports complex pricing tiers (e.g., different image sizes)
4. **Multimodal Support**: Can represent hybrid models that combine different pricing types
5. **Future-proof**: Structure can be extended to support new pricing models

## Implementation Notes

- Frontend should validate pricing calculations based on the `type` field
- UI should adapt to show relevant pricing information based on model type
- Consider adding optional fields for volume discounts or special pricing tiers
- May need to handle currency conversion for different regions
