"""
Core functionality for working with AI models.
"""

import json
from pathlib import Path
from typing import List, Optional, Dict, Any, Set, Union
import logging
from dataclasses import dataclass
from enum import Enum

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class Capability(str, Enum):
    """Model capabilities as defined in the TypeScript version."""
    CHAT = "chat"         # shortcut for "txt-in" and "txt-out"
    REASON = "reason"     # when the model spends some tokens on reasoning before responding
    TEXT_IN = "txt-in"    # process text input
    TEXT_OUT = "txt-out"  # output text
    IMG_IN = "img-in"     # understand images
    IMG_OUT = "img-out"   # generate images
    AUDIO_IN = "audio-in" # process audio input
    AUDIO_OUT = "audio-out" # generate audio/speech
    JSON_OUT = "json-out" # structured JSON output
    FUNCTION_OUT = "fn-out" # function calling
    VECTORS_OUT = "vec-out" # output vector embeddings

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
    output_is_fixed: Optional[int] = None
    extended: Optional[Dict[str, Any]] = None
    embedding_type: Optional[str] = None
    normalized: Optional[bool] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ModelContext':
        """Create a ModelContext from a dictionary, handling camelCase to snake_case conversion."""
        # Convert camelCase to snake_case
        converted = {}
        for key, value in data.items():
            if key == 'maxOutput':
                converted['max_output'] = value
            elif key == 'outputIsFixed':
                converted['output_is_fixed'] = value
            elif key == 'embeddingType':
                converted['embedding_type'] = value
            else:
                converted[key] = value
        return cls(**converted)

@dataclass
class TokenPrice:
    """Token-based pricing information."""
    type: str = "token"
    input: float = 0.0
    output: float = 0.0

@dataclass
class Provider:
    """Provider information."""
    id: str
    name: str
    website_url: str
    api_url: str
    models: Dict[str, Union[TokenPrice, Dict[str, Any]]]

    def __init__(self, **kwargs):
        # Convert camelCase to snake_case
        self.id = kwargs['id']
        self.name = kwargs['name']
        self.website_url = kwargs['websiteUrl']
        self.api_url = kwargs['apiUrl']
        self.models = kwargs['models']

class Model:
    """Represents an AI model with its capabilities and specifications."""
    
    def __init__(self, data: Dict[str, Any], creator: str, validate: bool = True):
        self._data = data
        self._creator = creator
        logger.debug(f"Initializing model with data: {data}")
        if validate:
            self._validate()
        logger.debug(f"Created model with data: {data}")
    
    def _validate(self) -> None:
        """Validate model data against the TypeScript schema."""
        required_fields = ['id', 'name', 'license', 'providers', 'can', 'context']
        logger.debug(f"Validating model data: {self._data}")
        for field in required_fields:
            if field not in self._data:
                logger.error(f"Missing required field: {field} in data: {self._data}")
                raise ValueError(f"Missing required field: {field}")
        
        if not isinstance(self._data['providers'], list):
            raise ValueError("providers must be a list")
        
        if not isinstance(self._data['can'], list):
            raise ValueError("can must be a list")
        
        # Validate capabilities
        valid_capabilities = {cap.value for cap in Capability}
        for cap in self._data['can']:
            if cap not in valid_capabilities:
                raise ValueError(f"Invalid capability: {cap}")
        
        # Validate context
        if not isinstance(self._data['context'], dict):
            raise ValueError("context must be a dictionary")
    
    @property
    def id(self) -> str:
        return self._data["id"]
    
    @property
    def name(self) -> str:
        return self._data["name"]
    
    @property
    def can(self) -> List[str]:
        return self._data["can"]
    
    @property
    def providers(self) -> List[str]:
        return self._data["providers"]
    
    @property
    def context(self) -> ModelContext:
        return ModelContext.from_dict(self._data["context"])
    
    @property
    def license(self) -> str:
        return self._data["license"]
    
    @property
    def creator(self) -> str:
        return self._creator
    
    @property
    def extends(self) -> Optional[str]:
        return self._data.get("extends")
    
    @property
    def overrides(self) -> Optional[Dict[str, Any]]:
        return self._data.get("overrides")
    
    @property
    def aliases(self) -> Optional[List[str]]:
        return self._data.get("aliases")
    
    @property
    def languages(self) -> Optional[List[str]]:
        return self._data.get("languages")

class ModelCollection:
    """Base class for model collections."""
    
    def __init__(self, models: List[Model] = []):
        self._models = models
        self._model_map = {model.id: model for model in models}
    
    def can(self, *capabilities: str) -> List[Model]:
        """Find models that have all the specified capabilities."""
        return [
            model for model in self._models
            if all(cap in model.can for cap in capabilities)
        ]
    
    def from_provider(self, provider: str) -> List[Model]:
        """Find models available from a specific provider."""
        return [
            model for model in self._models
            if provider in model.providers
        ]
    
    def from_creator(self, creator: str) -> List[Model]:
        """Find models created by a specific organization."""
        return [
            model for model in self._models
            if model.creator == creator
        ]
    
    def with_min_context(self, min_tokens: int) -> List[Model]:
        """Find models with at least the specified context window size."""
        return [
            model for model in self._models
            if model.context.total is not None and model.context.total >= min_tokens
        ]
    
    def id(self, model_id: str) -> Optional[Model]:
        """Find a specific model by its ID."""
        return self._model_map.get(model_id)
    
    def find(self, predicate) -> Optional[Model]:
        """Find a model that matches the predicate."""
        for model in self._models:
            if predicate(model):
                return model
        return None

class AIModels(ModelCollection):
    """Main class for working with AI models."""
    
    def __init__(self, models: List[Model] = []):
        super().__init__(models)
        self._providers: List[Provider] = []
        self._creators: Dict[str, Any] = {}
        self._load_data()
    
    def _load_data(self) -> None:
        """Load all data from JSON files."""
        # Get the root data directory (2 levels up from this file)
        data_dir = Path(__file__).parent.parent.parent.parent / "data"
        logger.debug(f"Loading data from: {data_dir}")
        
        # Load creators
        creators_file = data_dir / "creators.json"
        logger.debug(f"Loading creators from: {creators_file}")
        with open(creators_file) as f:
            self._creators = json.load(f)
        
        # Load providers
        providers_dir = data_dir / "providers"
        logger.debug(f"Loading providers from: {providers_dir}")
        for provider_file in providers_dir.glob("*-provider.json"):
            logger.debug(f"Loading provider: {provider_file}")
            with open(provider_file) as f:
                provider_data = json.load(f)
                self._providers.append(Provider(**provider_data))
        
        # Load models
        models_dir = data_dir / "models"
        logger.debug(f"Loading models from: {models_dir}")
        all_models: List[Model] = []
        for model_file in models_dir.glob("*-models.json"):
            provider = model_file.stem.replace("-models", "")
            logger.debug(f"Loading models for provider: {provider}")
            with open(model_file) as f:
                data = json.load(f)
                for model_data in data["models"]:
                    # Skip validation for models that extend others
                    model = Model(model_data, provider, validate=not 'extends' in model_data)
                    all_models.append(model)
        
        # Create model map for inheritance resolution
        self._model_map = {model.id: model for model in all_models}
        
        # Resolve inheritance
        self._models = [self._resolve_model(model) for model in all_models]
        logger.debug(f"Loaded {len(self._models)} total models")
    
    def _resolve_model(self, model: Model, visited: Optional[Set[str]] = None) -> Model:
        """Resolve model inheritance by merging with base model."""
        if visited is None:
            visited = set()
        
        if not model.extends:
            return model
        
        if model.id in visited:
            raise ValueError(f"Circular dependency detected for model {model.id}")
        
        visited.add(model.id)
        base_model = self._model_map.get(model.extends)
        if not base_model:
            raise ValueError(f"Base model {model.extends} not found for {model.id}")
        
        # Recursively resolve base model
        resolved_base = self._resolve_model(base_model, visited)
        
        # If no overrides, inherit everything except id and extends
        if not model.overrides:
            resolved_data = {
                **resolved_base._data,
                "id": model.id,
                "extends": model.extends
            }
        else:
            # Merge with base model, giving priority to overrides
            resolved_data = {
                **resolved_base._data,
                **model.overrides,
                "id": model.id,
                "extends": model.extends
            }
        
        # Create new model with resolved data and validate
        resolved_model = Model(resolved_data, model.creator, validate=True)
        return resolved_model
    
    @property
    def creators(self) -> List[str]:
        """Get list of all creators."""
        return list(self._creators.get("creators", {}).keys())
    
    @property
    def providers(self) -> List[str]:
        """Get list of all provider IDs."""
        return [p.id for p in self._providers]
    
    def get_price(self, model_id: str, provider: str) -> Optional[TokenPrice]:
        """Get pricing information for a model from a specific provider."""
        provider_data = next((p for p in self._providers if p.id == provider), None)
        if not provider_data:
            return None
        
        price_data = provider_data.models.get(model_id)
        if not price_data or price_data.get("type") != "token":
            return None
        
        return TokenPrice(**price_data)
    
    def get_provider(self, provider_id: str) -> Optional[Provider]:
        """Get provider information by ID."""
        return next((p for p in self._providers if p.id == provider_id), None)
    
    def get_providers_for_model(self, model_id: str) -> List[Provider]:
        """Get all providers that can serve a specific model."""
        # First try to find the model by its ID
        model = self.id(model_id)
        
        # If not found, try to find it by alias
        if not model:
            model = self.find(lambda m: model_id in (m.aliases or []))
        
        if not model:
            return []
        
        return [p for p in self._providers if p.id in model.providers]

# Create singleton instance
models = AIModels() 