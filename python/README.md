# AIModels

A collection of AI model specifications across different providers. This package provides normalized data about AI models, including their capabilities, context windows, and pricing information.

## Installation

```bash
pip install aimodels
```

## Usage

```python
from aimodels import models

# Find models by capability
chat_models = models.can("chat")
vision_models = models.can("img-in")
reasoning_models = models.can("reason")

# Find models with multiple capabilities
multimodal_models = models.can("chat", "img-in")
audio_models = models.can("audio-in", "audio-out")
full_stack_models = models.can("chat", "fn-out", "json-out")

# Find models by provider
openai_models = models.from_provider("openai")

# Find models by creator
meta_models = models.from_creator("meta")

# Find models by context window
large_context_models = models.with_min_context(32768)

# Find specific model
model = models.id("gpt-4")
print(model.context.total)  # Context window size
print(model.providers)  # ['openai']

# Get pricing information
price = models.get_price("gpt-4", "openai")
if price:
    print(f"Input: ${price.input}/1M tokens")
    print(f"Output: ${price.output}/1M tokens")

# Get provider information
provider = models.get_provider("openai")
if provider:
    print(f"Name: {provider.name}")
    print(f"Website: {provider.website_url}")
    print(f"API: {provider.api_url}")
```

## Features

- Comprehensive database of AI models from major providers (OpenAI, Anthropic, Mistral, etc.)
- Normalized data structure for easy comparison
- Model capabilities (chat, img-in, img-out, function-out, etc.)
- Context window information
- Creator and provider associations
- Type hints with full type safety
- Zero dependencies
- Regular updates with new models

## Types

### Model
```python
@dataclass
class Model:
    """Represents an AI model with its capabilities and specifications."""
    id: str          # Unique identifier
    name: str        # Display name
    can: List[str]   # Model capabilities
    providers: List[str]  # Available providers
    context: ModelContext  # Context window information
    license: str     # License or creator
```

### ModelContext
```python
@dataclass
class ModelContext:
    """Context window information for a model."""
    total: Optional[int] = None        # Maximum input tokens
    max_output: Optional[int] = None   # Maximum output tokens
    sizes: Optional[List[str]] = None  # Available sizes
    qualities: Optional[List[str]] = None  # Available qualities
    type: Optional[str] = None         # Context type
    unit: Optional[str] = None         # Unit of measurement
    dimensions: Optional[int] = None    # Vector dimensions
```

### Provider
```python
@dataclass
class Provider:
    """Provider information."""
    id: str
    name: str
    website_url: str
    api_url: str
    models: Dict[str, Union[TokenPrice, Dict[str, Any]]]
```

For more detailed information, see:
- [Model Capabilities](../docs/model-capabilities.md)
- [Model Structure](../docs/model-structure.md)
- [Providers](../docs/providers.md)

## License

MIT
