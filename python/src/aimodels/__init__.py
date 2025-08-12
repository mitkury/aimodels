"""
A collection of AI model specifications across different providers.
"""

from importlib.metadata import version
from pathlib import Path

from .models import AIModels, Model, ModelContext, Capability, Provider, TokenPrice

def _resolve_local_version() -> str:
    # Fallback for local development when the package isn't installed
    try:
        # Python 3.11+
        import tomllib  # type: ignore
        pyproject_path = Path(__file__).resolve().parents[2] / "pyproject.toml"
        if pyproject_path.exists():
            with pyproject_path.open("rb") as f:
                data = tomllib.load(f)
                return data.get("project", {}).get("version", "unknown")
    except Exception:
        pass
    # Very lightweight regex fallback without dependencies
    try:
        pyproject_text = (Path(__file__).resolve().parents[2] / "pyproject.toml").read_text(encoding="utf-8")
        for line in pyproject_text.splitlines():
            if line.strip().startswith("version") and "=" in line:
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    except Exception:
        pass
    return "unknown"

try:
    # Package name as published on PyPI
    __version__ = version("aimodels.dev")
except Exception:
    __version__ = _resolve_local_version()
else:
    if not __version__ or __version__ == "unknown":
        __version__ = _resolve_local_version()

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