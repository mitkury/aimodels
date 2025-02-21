# Provider Model ID Mappings

## Problem

Some providers use different identifiers for the same model in their API. For example:
- OpenAI uses "whisper-1" to refer to their latest Whisper model
- Different providers may have different naming conventions for the same model
- Model IDs may change over time while keeping the same functionality

## Proposed Solution

Add support for provider-specific model ID mappings in provider configurations:

```typescript
interface Provider {
  // ... existing fields ...
  modelMappings?: Record<string, string>; // normalized ID -> provider ID
}
```

Example configuration:
```json
{
  "id": "openai",
  "name": "OpenAI",
  "modelMappings": {
    "whisper-large-v3": "whisper-1",
    "whisper-large-v3-turbo": "whisper-1"
  },
  "models": {
    "whisper-1": {
      "type": "minute",
      "price": 0.006
    }
  }
}
```

## Benefits

1. **Normalized Interface**
   - Consumers always use consistent model IDs
   - Provider-specific mappings handled internally
   - Clean abstraction layer

2. **Maintainability**
   - Mappings defined in provider configs
   - Easy to update when providers change IDs
   - Clear documentation of ID relationships

3. **Fallback Behavior**
   - Use mapped ID if exists
   - Otherwise use normalized ID
   - No breaking changes for unmapped models

## Implementation Notes

- Keep mappings optional
- Document mappings clearly in provider configs
- Consider versioning implications
- Test fallback behavior thoroughly 