"""
A collection of AI model specifications across different providers.
"""

from importlib.metadata import version

from .models import AIModels, Model, ModelContext, Capability, Provider, TokenPrice

try:
    # Package name as published on PyPI
    __version__ = version("aimodels.dev")
except Exception:
    __version__ = "unknown"

# Create a singleton instance
models = AIModels()

# Re-export types
__all__ = [
    "AIModels",
    "models",
    "Model",
    "ModelContext",
    "Capability",
    "Provider",
    "TokenPrice",
] 