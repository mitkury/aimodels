use aimodels::{models, Capability, ContextKind};

#[test]
fn loads_the_embedded_catalog() {
    assert!(models().len() > 100);
    assert!(models().providers().len() > 10);
    assert!(models().organizations().len() > 10);
    assert!(!models().creators().is_empty());
}

#[test]
fn resolves_canonical_ids_for_each_provider() {
    let model = models().id("gpt-5.1").expect("gpt-5.1");

    assert_eq!(model.id_for("openai"), Some("gpt-5.1"));
    assert_eq!(model.id_for("openrouter"), Some("openai/gpt-5.1"));
    assert_eq!(model.id_for("anthropic"), None);
    assert_eq!(
        models().resolve_model_id_for_provider("gpt-5.1", "openrouter"),
        Some("openai/gpt-5.1")
    );
    assert_eq!(
        models()
            .from_provider_id("openrouter", "openai/gpt-5.1")
            .map(|m| m.id()),
        Some("gpt-5.1")
    );

    let cases = [
        (
            "claude-sonnet-4-5-20250929",
            "openrouter",
            "anthropic/claude-sonnet-4.5",
        ),
        (
            "gemini-2.5-pro-preview-06-05",
            "openrouter",
            "google/gemini-2.5-pro-preview",
        ),
        (
            "Qwen/Qwen3.8-2.4T-A95B",
            "openrouter",
            "qwen/qwen3.8-2.4t-a95b",
        ),
        ("grok-4.6", "openrouter", "x-ai/grok-4.6"),
        ("claude-opus-5", "bedrock", "anthropic.claude-opus-5"),
        (
            "thinkingmachines/Inkling",
            "together",
            "thinkingmachines/inkling",
        ),
    ];
    for (id, provider, expected) in cases {
        let model = models().id(id).unwrap_or_else(|| panic!("{id}"));
        assert_eq!(model.id_for(provider), Some(expected), "{id} on {provider}");
        assert_eq!(
            models()
                .from_provider_id(provider, expected)
                .map(|m| m.id()),
            Some(id),
            "{expected} on {provider}"
        );
    }
    assert_eq!(
        models()
            .id("gpt-realtime-2.1")
            .unwrap()
            .id_for("openrouter"),
        None
    );
}

#[test]
fn creators_and_providers_have_organization_data() {
    let model = models().id("gpt-5").unwrap();
    assert_eq!(model.creator_id(), "openai");
    assert_eq!(model.creator().map(|org| org.name.as_str()), Some("OpenAI"));
    assert!(model.providers().iter().any(|p| p.id == "openai"));

    let openai = models().provider("openai").unwrap();
    assert_eq!(openai.website_url.as_deref(), Some("https://openai.com"));
    assert!(models().provider("does-not-exist").is_none());

    for creator in models().creators() {
        assert!(
            !models().from_creator(&creator.id).is_empty(),
            "{}",
            creator.id
        );
    }
    for provider in models().active_providers() {
        assert!(
            !models().from_provider(&provider.id).is_empty(),
            "{}",
            provider.id
        );
    }
}

#[test]
fn extending_models_do_not_inherit_identity() {
    assert_eq!(
        models().id("grok-imagine-video-1.5").unwrap().released_at(),
        Some("2026-06-16")
    );
    assert!(models()
        .id("kimi-k2-thinking")
        .unwrap()
        .aliases()
        .is_empty());
    assert_eq!(models().id("kimi-k2").unwrap().id(), "kimi-k2-0905-preview");
}

#[test]
fn extending_models_inherit_metadata() {
    for model in models().iter().filter(|m| m.extends().is_some()) {
        let base = models().id(model.extends().unwrap()).unwrap();
        assert_eq!(model.creator_id(), base.creator_id(), "{}", model.id());
        assert!(!model.capabilities().is_empty(), "{}", model.id());
        assert!(model.context().is_some(), "{}", model.id());
    }
}

#[test]
fn aliases_are_unambiguous() {
    let mut owners = std::collections::HashMap::new();
    for model in models() {
        for alias in model.aliases() {
            assert_eq!(
                owners.insert(alias.as_str(), model.id()),
                None,
                "alias `{alias}`"
            );
            assert_eq!(
                models().id(alias).map(|m| m.id()),
                Some(model.id()),
                "alias `{alias}`"
            );
        }
    }
}

#[test]
fn filters_by_creator_and_capabilities() {
    let wanted = [Capability::Chat, Capability::ImgIn, Capability::JsonOut];
    let found = models().from_creator("google").can(&wanted);

    assert!(!found.is_empty());
    for model in &found {
        assert_eq!(model.creator_id(), "google");
        assert!(model.can(&wanted));
        let context = model.context().expect("chat models have a context");
        assert_eq!(context.kind, ContextKind::Token);
        assert!(context.total.is_some());
    }

    let all_google = models().from_creator("google");
    assert!(all_google.len() > found.len());
    assert_eq!(
        all_google.clone().filter(|m| m.can(&wanted)).len(),
        found.len()
    );
}

#[test]
fn filters_by_minimum_context() {
    let large = models().with_min_context(1_000_000);
    assert!(!large.is_empty());
    for model in &large {
        assert!(model.context().unwrap().total.unwrap() >= 1_000_000);
    }
}

#[test]
fn reads_context_limits() {
    let anthropic_fixed = models()
        .from_creator("anthropic")
        .filter(|m| m.context().is_some_and(|c| c.output_is_fixed));
    assert!(!anthropic_fixed.is_empty());

    let image = models()
        .iter()
        .find(|m| m.context().is_some_and(|c| c.kind == ContextKind::Image))
        .expect("an image generation model");
    assert!(!image.context().unwrap().sizes.as_ref().unwrap().is_empty());

    let embedding = models()
        .can(&[Capability::VecOut])
        .into_iter()
        .find_map(|m| {
            m.context()
                .filter(|c| c.kind == ContextKind::Embedding)
                .cloned()
        })
        .expect("an embedding model");
    assert!(embedding.dimensions.is_some());
}

#[test]
fn parses_capability_names() {
    for capability in Capability::ALL {
        assert_eq!(capability.as_str().parse::<Capability>(), Ok(capability));
        assert_eq!(capability.to_string(), capability.as_str());
    }
    assert!("telepathy".parse::<Capability>().is_err());
}
