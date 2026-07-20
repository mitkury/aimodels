# AIModels

A normalized catalog of AI models, creators, and inference providers. The
package includes model capabilities, context windows, aliases, provider
availability, and provider-specific ID translation.

## Installation

```bash
pip install aimodels.dev
```

## Usage

```python
from aimodels import models

# Find models by capability
chat_models = models.can("chat")
vision_models = models.can("img-in")
reasoning_models = models.can("reason")

# Fluent API (equivalent to the capability filters above)
fluent_chat = models.canChat()
fluent_multimodal = models.canChat().canSee()

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
model = models.id("gpt-5.1")
print(model.context.total)  # Context window size
print(model.providers)  # For example: ['openai', 'openrouter']

# Resolve canonical IDs at the provider boundary
print(model.id_for("openrouter"))  # openai/gpt-5.1
canonical = models.from_provider_id("openrouter", "openai/gpt-5.1")

# Get provider information
provider = models.get_provider("openai")
if provider:
    print(f"Name: {provider.name}")
    print(f"Website: {provider.websiteUrl}")
    print(f"API: {provider.apiUrl}")
```

## Features

- Comprehensive database of AI models from major providers (OpenAI, Anthropic, Mistral, etc.)
- Normalized data structure for easy comparison
- Model capabilities (chat, img-in, img-out, function-out, etc.)
- Context window information
- Creator and provider associations

## Types

### Model
```python
class Model:
    """Represents an AI model with its capabilities and specifications."""
    id: str
    name: str
    capabilities: List[str]
    providerIds: List[str]
    creatorId: Optional[str]
    context: ModelContext

    def can(self, *caps: str) -> bool: ...
    def canChat(self) -> bool: ...
    def canReason(self) -> bool: ...
    def canRead(self) -> bool: ...
    def canWrite(self) -> bool: ...
    def canSee(self) -> bool: ...
    def canGenerateImages(self) -> bool: ...
    def canHear(self) -> bool: ...
    def canSpeak(self) -> bool: ...
    def canOutputJSON(self) -> bool: ...
    def canCallFunctions(self) -> bool: ...
    def canGenerateEmbeddings(self) -> bool: ...

    # Convenience aliases
    @property
    def providers(self) -> List[str]: ...
    @property
    def creator(self) -> Optional[str]: ...
```

### ModelContext
```python
@dataclass
class ModelContext:
    """Context window information for a model."""
    total: Optional[int] = None
    max_output: Optional[int] = None
    sizes: Optional[List[str]] = None
    qualities: Optional[List[str]] = None
    type: Optional[str] = None
    unit: Optional[str] = None
    dimensions: Optional[int] = None
    output_is_fixed: Optional[Union[int, bool]] = None
    extended: Optional[Dict[str, Any]] = None
    embedding_type: Optional[str] = None
    normalized: Optional[bool] = None
```

### Provider
```python
@dataclass
class Provider:
    """Provider information (merged with organization fields to match JS Provider)."""
    id: str
    name: str
    websiteUrl: Optional[str] = None
    country: Optional[str] = None
    founded: Optional[int] = None
    apiUrl: Optional[str] = None
    apiDocsUrl: Optional[str] = None
    isLocal: Optional[int] = None
    pricing: Dict[str, Dict[str, Any]]
    # Optional model mappings describing which creators' models this provider exposes
    models: List[Dict[str, Any]] | None = None
```

## License

MIT

## Development

Run the Python checks from the repository root:

```bash
python3 -m pytest python/tests
python3 -m build python
```

Catalog source files live in the repository-level `data/` directory. See the
repository [documentation map](../docs/README.md) before editing them.
