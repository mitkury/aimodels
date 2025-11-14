"""
Basic tests for the aimodels package (Python).

These tests are intended to run against the local source in this repository,
not any globally installed `aimodels` package. We explicitly add the `src`
directory to `sys.path` so that `import aimodels` resolves to the local code.
"""

from pathlib import Path
import sys
import importlib.util

# Ensure local src/aimodels is imported instead of any globally installed package
ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
PKG_ROOT = SRC / "aimodels"

# Manually load the local aimodels package and register it in sys.modules
spec = importlib.util.spec_from_file_location("aimodels", PKG_ROOT / "__init__.py")
assert spec is not None and spec.loader is not None
aimodels = importlib.util.module_from_spec(spec)
sys.modules["aimodels"] = aimodels
spec.loader.exec_module(aimodels)  # type: ignore[assignment]

models = aimodels.models
__version__ = aimodels.__version__


def test_version():
    assert __version__ != "unknown"


def test_public_api_presence():
    # Core utilities present
    assert hasattr(models, "id")
    assert hasattr(models, "fromProvider")
    assert hasattr(models, "fromCreator")
    assert hasattr(models, "withMinContext")
    assert hasattr(models, "can")
    assert hasattr(models, "providers")

    # Fluent capability API
    for method in [
        "canChat",
        "canRead",
        "canWrite",
        "canReason",
        "canSee",
        "canGenerateImages",
        "canHear",
        "canSpeak",
        "canOutputJSON",
        "canCallFunctions",
        "canGenerateEmbeddings",
    ]:
        assert hasattr(models, method)


def test_can_find_chat_models():
    chat_models = models.canChat()
    assert len(chat_models) > 0
    assert all(m.canChat() for m in chat_models)


def test_can_find_multimodal_models():
    multimodal = models.canChat().canSee()
    assert len(multimodal) > 0
    assert all(m.canChat() and m.canSee() for m in multimodal)


def test_from_provider():
    openai_models = models.fromProvider("openai")
    assert len(openai_models) > 0
    assert all("openai" in m.providers for m in openai_models)


def test_with_min_context():
    big = models.withMinContext(32768)
    assert len(big) > 0
    assert all((m.context.total or 0) >= 32768 for m in big)


def test_find_specific_model():
    gpt51 = models.id("gpt-5.1")
    assert gpt51 is not None
    assert gpt51.id == "gpt-5.1"
    assert "openai" in gpt51.providers


def test_providers_api_and_data():
    provs = models.providers
    assert isinstance(provs, list)
    assert len(provs) > 0
    # Known providers
    ids = {p.id for p in provs}
    assert {"openai", "anthropic", "google"} & ids

    # Individual provider fetch
    openai = models.getProvider("openai")
    assert openai is not None
    assert openai.apiUrl is not None


def test_capability_method_equivalence():
    cases = [
        ("canChat", "chat"),
        ("canReason", "reason"),
        ("canSee", "img-in"),
        ("canGenerateImages", "img-out"),
        ("canHear", "audio-in"),
        ("canSpeak", "audio-out"),
        ("canOutputJSON", "json-out"),
        ("canCallFunctions", "fn-out"),
        ("canGenerateEmbeddings", "vec-out"),
    ]
    for method, cap in cases:
        fluent = getattr(models, method)()
        direct = models.can(cap)
        assert len(fluent) == len(direct) 