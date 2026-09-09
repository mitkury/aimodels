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

    pythonic = models.can_chat().can_see()
    assert [m.id for m in pythonic] == [m.id for m in multimodal]


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


def test_provider_specific_model_ids():
    model = models.id("gpt-5.1")
    assert model is not None
    assert model.id_for("openai") == "gpt-5.1"
    assert model.id_for("openrouter") == "openai/gpt-5.1"
    assert models.resolve_model_id_for_provider("gpt-5.1", "openrouter") == "openai/gpt-5.1"
    assert models.from_provider_id("openrouter", "openai/gpt-5.1") is model
    assert model.id_for("anthropic") is None
    assert models.id("gpt-realtime-2.1").id_for("openrouter") is None
    assert (
        models.id("claude-sonnet-4-5-20250929").id_for("openrouter")
        == "anthropic/claude-sonnet-4.5"
    )
    assert (
        models.id("gemini-2.5-pro-preview-06-05").id_for("openrouter")
        == "google/gemini-2.5-pro-preview"
    )
    assert (
        models.id("lyria-3-pro-preview").id_for("openrouter")
        == "google/lyria-3-pro-preview"
    )


def test_inkling_provider_specific_model_ids():
    model = models.id("thinkingmachines/Inkling")
    assert model is not None
    assert model.creatorId == "thinkingmachines"
    assert set(model.providerIds) >= {"thinkingmachines", "together"}
    assert model.id_for("thinkingmachines") == "thinkingmachines/Inkling"
    assert model.id_for("together") == "thinkingmachines/inkling"
    assert models.from_provider_id("together", "thinkingmachines/inkling") is model


def test_recent_provider_specific_model_ids():
    expected = {
        ("meta-models/Muse-Glimmer-30B", "openrouter"): "meta/muse-glimmer-30b",
        (
            "nvidia/nemotron-3.5-lightning-30b-a3b",
            "openrouter",
        ): "nvidia/nemotron-3.5-lightning",
        ("Qwen/Qwen3.8-2.4T-A95B", "openrouter"): "qwen/qwen3.8-2.4t-a95b",
        (
            "thinkingmachines/Inkling-Small",
            "openrouter",
        ): "thinkingmachines/inkling-small",
        ("grok-4.6", "openrouter"): "x-ai/grok-4.6",
        ("muse-spark-1.2", "meta"): "muse-spark-1.2",
        ("claude-opus-5", "bedrock"): "anthropic.claude-opus-5",
    }

    for (model_id, provider_id), provider_model_id in expected.items():
        model = models.id(model_id)
        assert model is not None
        assert model.id_for(provider_id) == provider_model_id


def test_package_exposes_one_catalog_instance():
    from aimodels.models import models as module_models

    assert models is module_models


def test_creator_ids_are_preserved():
    creator = models.get_creator("openai")
    assert creator is not None
    assert creator["id"] == "openai"
    assert any(org["id"] == "openai" for org in models.orgs)


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
    assert all(isinstance(provider.pricing, dict) for provider in provs)

    providers_for_model = models.getProvidersForModel("gpt-5.1")
    assert {provider.id for provider in providers_for_model} >= {"openai", "openrouter"}


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


def test_extended_model_identity_metadata():
    video = models.id("grok-imagine-video-1.5")
    assert video is not None
    assert video.released_at == "2026-06-16"

    thinking = models.id("kimi-k2-thinking")
    assert thinking is not None
    assert thinking.aliases is None

    kimi_k2 = models.id("kimi-k2")
    assert kimi_k2 is not None
    assert kimi_k2.id == "kimi-k2-0905-preview"


def test_aliases_are_unambiguous():
    owners = {}
    for model in models:
        for alias in model.aliases or []:
            assert alias not in owners, (
                f"alias {alias!r} is shared by {owners[alias]!r} and {model.id!r}"
            )
            owners[alias] = model.id


def test_september_catalog_canonical_ids():
    ids = [
        "gpt-6-astra",
        "gpt-image-2.5-sunburst",
        "gpt-image-2.5-flare",
        "claude-fable-5-1",
        "claude-mythos-5-1",
        "gemini-3.8-flash",
        "gemini-3.5-transcribe",
        "gemini-3.5-transcribe-live",
        "gemini-omni-1.1-flash",
        "lyria-3.5",
        "muse-spark-1.3",
        "muse-image-1.0",
        "muse-voice-transcribe-1.0",
        "qwen3.8-max",
        "qwen3.8-max-0902",
        "qwen3.8-flash",
        "Qwen/Qwen3.8-27B",
        "Qwen/Qwen3.8-Flash-Next",
        "deepseek-v4-flash-vision-exp",
        "glm-5.3",
        "glm-5.3-flash",
        "hy4-preview",
        "parse-v5.0",
        "CohereLabs/North-Micro-Vision-Instruct",
        "MiniMax-H3-Max",
        "grok-imagine-image-2.0",
        "mistral-ocr-4-1",
        "stepaudio-2.5-chat",
        "stepaudio-2.5-realtime",
        "stepaudio-2.5-tts",
        "stepaudio-2.5-asr",
    ]
    for model_id in ids:
        assert models.id(model_id).id == model_id


def test_september_provider_mappings():
    cases = [
        ["gpt-6-astra", "openrouter", "openai/gpt-6-astra"],
        ["claude-fable-5-1", "openrouter", "anthropic/claude-fable-5.1"],
        ["gemini-3.8-flash", "openrouter", "google/gemini-3.8-flash"],
        ["muse-spark-1.3", "meta", "muse-spark-1.3"],
        ["muse-spark-1.3", "openrouter", "meta/muse-spark-1.3"],
        ["Qwen/Qwen3.8-27B", "openrouter", "qwen/qwen3.8-27b"],
        ["qwen3.8-max-0902", "openrouter", "qwen/qwen3.8-max-0902"],
        ["qwen3.8-flash", "qwen", "qwen3.8-flash"],
        ["deepseek-v4-flash-vision-exp", "tencent", "deepseek/deepseek-v4-flash-vision-exp"],
        ["glm-5.3", "openrouter", "z-ai/glm-5.3"],
        ["glm-5.3-flash", "tencent", "glm-5.3-flash"],
        ["hy4-preview", "openrouter", "tencent/hy4-preview"],
        ["parse-v5.0", "cohere", "parse-v5.0"]
    ]
    for model_id, provider, provider_model_id in cases:
        model = models.id(model_id)
        assert model.id_for(provider) == provider_model_id
        assert models.from_provider_id(provider, provider_model_id) is model


def test_september_unverified_provider_availability():
    cases = [
        ["Qwen/Qwen3.8-27B", "qwen"],
        ["Qwen/Qwen3.8-2.4T-A95B", "qwen"],
        ["Qwen/Qwen3.8-Flash-Next", "qwen"],
        ["CohereLabs/North-Micro-Vision-Instruct", "cohere"],
        ["meta-models/Muse-Glimmer-30B", "meta"],
        ["claude-mythos-5-1", "openrouter"],
        ["qwen3.8-max-preview", "openrouter"],
        ["Qwen/Qwen3.8-Flash-Next", "openrouter"],
        ["gpt-image-2.5-sunburst", "openrouter"],
        ["gemini-3.5-transcribe", "openrouter"]
    ]
    for model_id, provider in cases:
        assert models.id(model_id).id_for(provider) is None


def test_september_context_units_and_limits():
    cases = [
        ["gpt-6-astra", "token", 1050000, 128000],
        ["gemini-3.8-flash", "token", 1048576, 65536],
        ["deepseek-v4-flash-vision-exp", "token", 1000000, 384000],
        ["glm-5.3-flash", "token", 1000000, 128000],
        ["hy4-preview", "token", 1048576, 65536],
        ["gemini-3.5-transcribe", "audio-in", 3600, None],
        ["gemini-3.5-transcribe-live", "audio-in", None, None],
        ["stepaudio-2.5-tts", "character", 1000, None],
        ["CohereLabs/North-Micro-Vision-Instruct", "token", 8192, None],
        ["Qwen/Qwen3.8-Flash-Next", "token", 262144, None]
    ]
    for model_id, unit, total, max_output in cases:
        context = models.id(model_id).context
        assert (context.type, context.total, context.max_output) == (
            unit, total, max_output
        )


def test_september_licenses():
    cases = [
        ["glm-5.3", "glm-5.3"],
        ["glm-5.3-flash", "mit"],
        ["Qwen/Qwen3.8-27B", "apache-2.0"],
        ["Qwen/Qwen3.8-Flash-Next", "qwen-community-1.0"],
        ["muse-spark-1.3", "proprietary"]
    ]
    for model_id, license_id in cases:
        assert models.id(model_id).license == license_id


def test_september_aliases():
    cases = [
        ["gpt-image-2.5-sunburst-2026-09-08", "gpt-image-2.5-sunburst"],
        ["gpt-image-2.5-flare-2026-09-08", "gpt-image-2.5-flare"],
        ["muse-spark-1.3-contributor", "muse-spark-1.3"],
        ["mistral-ocr-latest", "mistral-ocr-4-1"],
        ["kimi-k2.7-code-highspeed", "kimi-k2.7-code"]
    ]
    for alias, model_id in cases:
        assert models.id(alias).id == model_id
        assert not any(model.id == alias for model in models)


def test_september_capability_boundaries():
    assert not models.id("muse-spark-1.3").canHear()
    assert not models.id("glm-5.3").canSee()
    assert models.id("glm-5.3-flash").canSee()
    assert models.id("deepseek-v4-flash-vision-exp").canSee()
    for model_id in ["parse-v5.0", "mistral-ocr-4-1"]:
        assert not models.id(model_id).canChat()
        assert not models.id(model_id).canCallFunctions()
    assert not models.id("parse-v5.0").canOutputJSON()
    assert models.id("mistral-ocr-4-1").canOutputJSON()


def test_september_release_date_evidence():
    assert models.id("gpt-6-astra").released_at == "2026-09-03"
    assert models.id("claude-mythos-5-1").released_at == "2026-09-01"
    assert models.id("mistral-ocr-4-1").released_at == "2026-07-16"
    assert models.id("qwen3.8-max-0902").released_at is None
    assert models.id("Qwen/Qwen3.8-Flash-Next").released_at is None
