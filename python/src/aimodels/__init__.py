"""
A collection of AI model specifications across different providers.
"""

from importlib.metadata import version

from .models import AIModels, Model, ModelContext, Capability, Provider, TokenPrice

try:
    __version__ = version("aimodels")
except Exception:
    __version__ = "unknown"

# Create a singleton instance
models = AIModels()

# Re-export types
__all__ = [
    "models",
    "Model",
    "ModelContext",
    "Capability",
    "Provider",
    "TokenPrice"
] 