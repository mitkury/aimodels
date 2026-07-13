"""
Core functionality for working with AI models.
"""

import json
from pathlib import Path
from typing import List, Optional, Dict, Any, Set, Union, Callable
from dataclasses import dataclass, field
from enum import Enum

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
    VIDEO_IN = "video-in" # process video input
    VIDEO_OUT = "video-out" # generate video
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
    output_is_fixed: Optional[Union[int, bool]] = None
    extended: Optional[Dict[str, Any]] = None
    embedding_type: Optional[str] = None
    normalized: Optional[bool] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ModelContext":
        """Create a ModelContext from a dictionary, handling camelCase to snake_case conversion."""
        converted: Dict[str, Any] = {}
        for key, value in (data or {}).items():
            if key == "maxOutput":
                converted["max_output"] = value
            elif key == "outputIsFixed":
                converted["output_is_fixed"] = value
            elif key == "embeddingType":
                converted["embedding_type"] = value
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
    """Provider source data enriched with matching organization metadata."""
    id: str
    name: str
    websiteUrl: Optional[str] = None
    country: Optional[str] = None
    founded: Optional[int] = None
    apiUrl: Optional[str] = None
    apiDocsUrl: Optional[str] = None
    isLocal: Optional[int] = None
    pricing: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    # Optional model mappings describing which creators' models this provider exposes
    models: Optional[List[Dict[str, Any]]] = None

    @classmethod
    def from_sources(cls, org: Dict[str, Any], provider: Dict[str, Any]) -> "Provider":
        merged: Dict[str, Any] = {**org, **provider}
        # Ensure id is present from provider source
        merged["id"] = provider.get("id") or org.get("id")
        merged.setdefault("pricing", {})
        return cls(**merged)  # type: ignore[arg-type]

class Model:
    """Represents an AI model with its capabilities and specifications."""

    def __init__(self, data: Dict[str, Any]):
        self._data = data
        # Minimal validation of invariant keys used by API
        if "id" not in data:
            raise ValueError("Model missing id")

    # Raw accessors and inheritance resolution helpers
    @property
    def id(self) -> str:
        return self._data["id"]

    @property
    def extends(self) -> Optional[str]:
        return self._data.get("extends")

    @property
    def overrides(self) -> Optional[Dict[str, Any]]:
        return self._data.get("overrides")

    def _resolve(self, key: str, default: Any = None) -> Any:
        # Direct value
        if key in self._data:
            return self._data[key]
        # Overrides
        overrides = self._data.get("overrides") or {}
        if key in overrides:
            return overrides[key]
        # Inheritance resolution happens in AIModels when constructing final models
        return default

    # Enhanced property getters (matching JS names)
    @property
    def name(self) -> str:
        return self._resolve("name", self.id)

    @property
    def capabilities(self) -> List[str]:
        return list(self._resolve("capabilities", []))

    @property
    def context(self) -> ModelContext:
        return ModelContext.from_dict(self._resolve("context", {}))

    @property
    def license(self) -> Optional[str]:
        return self._resolve("license")

    @property
    def languages(self) -> Optional[List[str]]:
        return self._resolve("languages")

    @property
    def aliases(self) -> Optional[List[str]]:
        return self._resolve("aliases")

    @property
    def releasedAt(self) -> Optional[str]:
        return self._resolve("releasedAt")

    @property
    def released_at(self) -> Optional[str]:
        return self.releasedAt

    def _is_included_by(self, entry: Dict[str, Any]) -> bool:
        if entry.get("creator") != self.creatorId:
            return False

        include = entry.get("include")
        if include == "all":
            return self.id not in (entry.get("exclude") or [])
        return isinstance(include, list) and self.id in include

    def _provider_mapping(self, provider_id: str) -> Optional[Dict[str, Any]]:
        provider = AIModels.providers_data.get(provider_id) or {}
        return next(
            (
                entry
                for entry in (provider.get("models") or [])
                if self._is_included_by(entry)
            ),
            None,
        )

    @property
    def providerIds(self) -> List[str]:
        ids: Set[str] = set()
        creator_id = self.creatorId
        if not creator_id:
            return []

        for provider_id, provider in AIModels.providers_data.items():
            is_native = provider_id == creator_id
            entries = provider.get("models") or []

            # Native provider: include by default, unless models array says otherwise
            if is_native:
                if not entries:
                    ids.add(provider_id)
                    continue
                
                creator_entry = next((e for e in entries if e.get("creator") == creator_id), None)
                if not creator_entry:
                    # No entry for creator, default to including all
                    ids.add(provider_id)
                elif self._is_included_by(creator_entry):
                    # Entry exists and includes this model
                    ids.add(provider_id)
                continue

            # Non-native provider: only include if explicitly listed
            if not entries:
                continue
            
            if any(self._is_included_by(entry) for entry in entries):
                ids.add(provider_id)

        return sorted(ids)

    def idFor(self, provider_id: str) -> Optional[str]:
        """Resolve the canonical model ID to the ID required by a provider."""
        if provider_id not in self.providerIds:
            return None

        entry = self._provider_mapping(provider_id)
        overrides = (entry or {}).get("idOverrides") or {}
        if self.id in overrides:
            return overrides[self.id]

        return f"{(entry or {}).get('idPrefix') or ''}{self.id}"

    def id_for(self, provider_id: str) -> Optional[str]:
        """Pythonic alias for idFor."""
        return self.idFor(provider_id)

    @property
    def creatorId(self) -> Optional[str]:
        return self._resolve("creatorId")

    # Convenience getters analogous to JS Model
    @property
    def providers(self) -> List[str]:
        return self.providerIds

    @property
    def creator(self) -> Optional[str]:
        return self.creatorId

    # Capability checks analogous to JS Model
    def can(self, *capabilities: str) -> bool:
        caps = set(self.capabilities)
        return all(c in caps for c in capabilities)

    def canChat(self) -> bool:
        return "chat" in self.capabilities

    def canReason(self) -> bool:
        return "reason" in self.capabilities

    def canRead(self) -> bool:
        return "txt-in" in self.capabilities

    def canWrite(self) -> bool:
        return "txt-out" in self.capabilities

    def canSee(self) -> bool:
        return "img-in" in self.capabilities

    def canGenerateImages(self) -> bool:
        return "img-out" in self.capabilities

    def canHear(self) -> bool:
        return "audio-in" in self.capabilities

    def canSpeak(self) -> bool:
        return "audio-out" in self.capabilities

    def canOutputJSON(self) -> bool:
        return "json-out" in self.capabilities

    def canCallFunctions(self) -> bool:
        return "fn-out" in self.capabilities

    def canGenerateEmbeddings(self) -> bool:
        return "vec-out" in self.capabilities

    # Pythonic capability aliases
    can_chat = canChat
    can_reason = canReason
    can_read = canRead
    can_write = canWrite
    can_see = canSee
    can_generate_images = canGenerateImages
    can_hear = canHear
    can_speak = canSpeak
    can_output_json = canOutputJSON
    can_call_functions = canCallFunctions
    can_generate_embeddings = canGenerateEmbeddings

class ModelCollection(List[Model]):
    """Fluent collection API similar to JS ModelCollection (inherits from list)."""

    # Fluent filtering by capabilities
    def can(self, *capabilities: str) -> "ModelCollection":
        return ModelCollection([m for m in self if all(c in m.capabilities for c in capabilities)])

    def canChat(self) -> "ModelCollection":
        return self.can("chat")

    def canReason(self) -> "ModelCollection":
        return self.can("reason")

    def canRead(self) -> "ModelCollection":
        return self.can("txt-in")

    def canWrite(self) -> "ModelCollection":
        return self.can("txt-out")

    def canSee(self) -> "ModelCollection":
        return self.can("img-in")

    def canGenerateImages(self) -> "ModelCollection":
        return self.can("img-out")

    def canHear(self) -> "ModelCollection":
        return self.can("audio-in")

    def canSpeak(self) -> "ModelCollection":
        return self.can("audio-out")

    def canOutputJSON(self) -> "ModelCollection":
        return self.can("json-out")

    def canCallFunctions(self) -> "ModelCollection":
        return self.can("fn-out")

    def canGenerateEmbeddings(self) -> "ModelCollection":
        return self.can("vec-out")

    # Pythonic capability aliases
    can_chat = canChat
    can_reason = canReason
    can_read = canRead
    can_write = canWrite
    can_see = canSee
    can_generate_images = canGenerateImages
    can_hear = canHear
    can_speak = canSpeak
    can_output_json = canOutputJSON
    can_call_functions = canCallFunctions
    can_generate_embeddings = canGenerateEmbeddings

    def know(self, *languages: str) -> "ModelCollection":
        return ModelCollection([m for m in self if m.languages and all(l in m.languages for l in languages)])

    # Array-like utilities returning ModelCollection
    def filter(self, predicate: Callable[[Model], bool]) -> "ModelCollection":
        return ModelCollection([m for m in self if predicate(m)])

    def slice(self, start: Optional[int] = None, end: Optional[int] = None) -> "ModelCollection":
        s = slice(start, end)
        return ModelCollection(list(self)[s])

    # Lookups
    def id(self, model_id: str) -> Optional[Model]:
        for m in self:
            if m.id == model_id or (m.aliases and model_id in m.aliases):
                return m
        return None

    def resolveModelIdForProvider(self, model_id: str, provider_id: str) -> Optional[str]:
        """Resolve a canonical model ID or alias to the ID required by a provider."""
        model = self.id(model_id)
        return model.idFor(provider_id) if model else None

    def resolve_model_id_for_provider(self, model_id: str, provider_id: str) -> Optional[str]:
        """Pythonic alias for resolveModelIdForProvider."""
        return self.resolveModelIdForProvider(model_id, provider_id)

    def fromProviderId(self, provider_id: str, provider_model_id: str) -> Optional[Model]:
        """Find a canonical model from an ID returned by a provider."""
        return next(
            (
                model
                for model in self.fromProvider(provider_id)
                if model.idFor(provider_id) == provider_model_id
            ),
            None,
        )

    def from_provider_id(self, provider_id: str, provider_model_id: str) -> Optional[Model]:
        """Pythonic alias for fromProviderId."""
        return self.fromProviderId(provider_id, provider_model_id)

    def fromProvider(self, provider: str) -> "ModelCollection":
        return self.filter(lambda m: provider in m.providerIds)

    # Pythonic aliases matching README in python package
    def from_provider(self, provider: str) -> List[Model]:
        return list(self.fromProvider(provider))

    def fromCreator(self, creator: str) -> "ModelCollection":
        return self.filter(lambda m: m.creatorId == creator)

    def from_creator(self, creator: str) -> List[Model]:
        return list(self.fromCreator(creator))

    def withMinContext(self, tokens: int) -> "ModelCollection":
        def ok(m: Model) -> bool:
            ctx = m.context
            if ctx.type not in ("token", "character"):
                return False
            if ctx.total is None:
                return False
            return ctx.total >= tokens
        return self.filter(ok)

    def with_min_context(self, tokens: int) -> List[Model]:
        return list(self.withMinContext(tokens))

    # Providers and orgs data resolved via AIModels static stores
    @property
    def providers(self) -> List[Provider]:
        # unique providerIds across models
        provider_ids = sorted({pid for m in self for pid in m.providerIds})
        providers: List[Provider] = []
        for pid in provider_ids:
            provider = AIModels.providers_data.get(pid)
            org = AIModels.orgs_data.get(pid, {"id": pid, "name": pid})
            if provider:
                providers.append(Provider.from_sources({"id": pid, **org}, provider))
        return providers

    @property
    def orgs(self) -> List[Dict[str, Any]]:
        creator_ids = sorted({m.creatorId for m in self if m.creatorId})
        return [
            {**AIModels.orgs_data[cid], "id": cid}
            for cid in creator_ids
            if cid in AIModels.orgs_data
        ]

    def getProvider(self, provider_id: str) -> Optional[Provider]:
        provider = AIModels.providers_data.get(provider_id)
        org = AIModels.orgs_data.get(provider_id, {"id": provider_id, "name": provider_id})
        if provider:
            return Provider.from_sources({"id": provider_id, **org}, provider)
        return None

    def get_provider(self, provider_id: str) -> Optional[Provider]:
        return self.getProvider(provider_id)

    def getCreator(self, creator_id: str) -> Optional[Dict[str, Any]]:
        organization = AIModels.orgs_data.get(creator_id)
        return {**organization, "id": creator_id} if organization else None

    def get_creator(self, creator_id: str) -> Optional[Dict[str, Any]]:
        return self.getCreator(creator_id)

    def getProvidersForModel(self, model_id: str) -> List[Provider]:
        model = self.id(model_id)
        if not model:
            return []
        providers = (self.getProvider(provider_id) for provider_id in model.providerIds)
        return [provider for provider in providers if provider is not None]

    def getCreatorForModel(self, model_id: str) -> Optional[Dict[str, Any]]:
        model = self.id(model_id)
        if not model or not model.creatorId:
            return None
        return self.getCreator(model.creatorId)

class AIModels(ModelCollection):
    """Main class for working with AI models."""

    # Static stores similar to JS ModelCollection
    providers_data: Dict[str, Dict[str, Any]] = {}
    orgs_data: Dict[str, Dict[str, Any]] = {}
    model_sources: Dict[str, Dict[str, Any]] = {}

    def __init__(self):
        # Load and build models list, then initialize base list
        models = self._load_and_build_models()
        super().__init__(models)

    def _data_root(self) -> Path:
        """Resolve data directory location.

        Priority:
        1. Packaged data under the installed module: aimodels/data
        2. Repository root data directory (for local development/tests)
        """
        # 1) Packaged data directory next to this module
        packaged = Path(__file__).resolve().parent / "data"
        if packaged.exists():
            return packaged
        # 2) Repo root: three levels up from this file -> project root, then /data
        repo_root = Path(__file__).resolve().parents[3]
        return repo_root / "data"

    def _load_and_build_models(self) -> List[Model]:
        data_dir = self._data_root()
        models_dir = data_dir / "models"
        providers_dir = data_dir / "providers"
        orgs_path = data_dir / "orgs.json"

        # Load organizations
        with open(orgs_path, "r", encoding="utf-8") as f:
            AIModels.orgs_data = json.load(f)

        # Load providers
        AIModels.providers_data = {}
        for p in providers_dir.glob("*.json"):
            with open(p, "r", encoding="utf-8") as f:
                provider_data = json.load(f)
                pid = provider_data.get("id")
                if pid:
                    AIModels.providers_data[pid] = provider_data

        # Load models collections and flatten into sources keyed by id (matching JS build)
        AIModels.model_sources = {}
        for mfile in models_dir.glob("*-models.json"):
            with open(mfile, "r", encoding="utf-8") as f:
                data = json.load(f)
                creator_id = data.get("creator")
                for model_data in data.get("models", []):
                    # store raw source enhanced with creatorId for convenience
                    src = dict(model_data)
                    if creator_id:
                        src["creatorId"] = creator_id
                    AIModels.model_sources[src["id"]] = src

        # Build initial Model objects and resolve inheritance similarly to JS Model.resolveProperty
        models: Dict[str, Model] = {}
        for model_id, source in AIModels.model_sources.items():
            models[model_id] = Model(source)

        # Resolve inheritance by producing final models list
        def resolve_model(source_id: str, seen: Optional[Set[str]] = None) -> Dict[str, Any]:
            if seen is None:
                seen = set()
            if source_id in seen:
                raise ValueError(f"Circular inheritance detected: {' -> '.join(list(seen) + [source_id])}")
            seen.add(source_id)
            src = AIModels.model_sources[source_id]
            base_id = src.get("extends")
            if not base_id:
                return src
            if base_id not in AIModels.model_sources:
                raise ValueError(f"Base model '{base_id}' not found for '{source_id}'")
            base = resolve_model(base_id, seen)
            overrides = src.get("overrides") or {}
            merged = {**base, **overrides, "id": src["id"], "extends": base_id}
            # Preserve creatorId and providerIds if defined at base only
            if "creatorId" not in merged and "creatorId" in base:
                merged["creatorId"] = base["creatorId"]
            if "providerIds" not in merged and "providerIds" in base:
                merged["providerIds"] = base["providerIds"]
            return merged

        final_models: List[Model] = []
        for model_id in AIModels.model_sources.keys():
            resolved_source = resolve_model(model_id)
            final_models.append(Model(resolved_source))

        # Ensure deterministic order
        final_models.sort(key=lambda m: m.id)
        return final_models

# Create singleton instance
models = AIModels()
