# Provider Pricing Structure

This document outlines how pricing is structured for different providers and their models.

## Core Structure

```json
{
  "provider": "openai",
  "models": {
    "gpt-4-vision-preview": {
      "type": "token",
      "input": 0.01,
      "output": 0.03
    },
    "dall-e-3": {
      "type": "image",
      "tiers": [
        {
          "size": "1024x1024",
          "price": 0.04
        }
      ]
    }
  }
}
```

## Pricing Types

### Token-based
```json
{
  "type": "token",
  "input": 0.01,         // USD per 1K input tokens
  "output": 0.03         // USD per 1K output tokens
}
```

### Image-based
```json
{
  "type": "image",
  "tiers": [
    {
      "size": "1024x1024",
      "price": 0.04      // USD per image
    }
  ]
}
```

### Audio-based
```json
{
  "type": "audio",
  "price": 0.006,        // USD per minute
  "unit": "minute"
}
```

## Examples

### OpenAI Provider
```json
{
  "provider": "openai",
  "models": {
    "gpt-4": {
      "type": "token",
      "input": 0.03,
      "output": 0.06
    },
    "gpt-4-vision-preview": {
      "type": "token",
      "input": 0.01,
      "output": 0.03
    },
    "dall-e-3": {
      "type": "image",
      "tiers": [
        {
          "size": "1024x1024",
          "price": 0.04
        }
      ]
    }
  }
}
```

### Azure OpenAI Provider (Different Pricing)
```json
{
  "provider": "azure",
  "models": {
    "gpt-4": {
      "type": "token",
      "input": 0.024,    // Azure might offer different rates
      "output": 0.048
    }
  }
}
```

### Anthropic Provider
```json
{
  "provider": "anthropic",
  "models": {
    "claude-3-opus": {
      "type": "token",
      "input": 0.015,
      "output": 0.075
    }
  }
}
```

## Design Rationale

1. **Provider-Specific**: Each provider can set their own prices for models
2. **Model Mapping**: Prices are mapped to specific model IDs
3. **Flexible Types**: Supports different pricing types (token, image, audio)
4. **Tiered Pricing**: Supports price tiers for different qualities/sizes
5. **Currency Standard**: All prices in USD (could be extended for multiple currencies)

## Implementation Notes

- All prices should be in USD
- Model IDs should match those in the model configuration
- Providers might offer the same model at different price points
- Some providers might have region-specific pricing
- Consider adding volume discounts or special tier pricing in future
