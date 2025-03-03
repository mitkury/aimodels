"""
Basic tests for the aimodels package.
"""

import pytest
from aimodels import models, __version__

def test_version():
    """Test that version is being read correctly."""
    assert __version__ != "unknown"

def test_can_find_chat_models():
    """Test finding models with chat capability."""
    chat_models = models.can("chat")
    assert len(chat_models) > 0
    assert all("chat" in model.can for model in chat_models)

def test_can_find_multimodal_models():
    """Test finding models with multiple capabilities."""
    multimodal_models = models.can("chat", "img-in")
    assert len(multimodal_models) > 0
    assert all("chat" in model.can and "img-in" in model.can for model in multimodal_models)

def test_from_provider():
    """Test finding models from a specific provider."""
    openai_models = models.from_provider("openai")
    assert len(openai_models) > 0
    assert all("openai" in model.providers for model in openai_models)

def test_with_min_context():
    """Test finding models with minimum context window."""
    large_context_models = models.with_min_context(32768)
    assert len(large_context_models) > 0
    assert all(model.context.total >= 32768 for model in large_context_models)

def test_find_specific_model():
    """Test finding a specific model by ID."""
    gpt4 = models.id("gpt-4")
    assert gpt4 is not None
    assert gpt4.id == "gpt-4"
    assert "openai" in gpt4.providers 