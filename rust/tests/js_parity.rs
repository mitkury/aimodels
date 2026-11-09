//! Checks that the Rust crate resolves the catalog exactly like the JavaScript
//! package.
//!
//! Build the JavaScript package, export its catalog, then run the ignored tests:
//!
//! ```text
//! (cd js && npm ci && npm run build)
//! node rust/scripts/export-js-catalog.mjs rust/target/js-catalog.json
//! AIMODELS_JS_CATALOG=$PWD/rust/target/js-catalog.json \
//!   cargo test --manifest-path rust/Cargo.toml -- --include-ignored
//! ```

use aimodels::{models, ContextKind, Model, ModelContext};
use serde_json::{json, Map, Value};

const NEEDS_EXPORT: &str = "needs AIMODELS_JS_CATALOG from rust/scripts/export-js-catalog.mjs";

fn js_catalog() -> Value {
    let path = std::env::var("AIMODELS_JS_CATALOG").expect(NEEDS_EXPORT);
    let text = std::fs::read_to_string(&path).unwrap_or_else(|err| panic!("read {path}: {err}"));
    serde_json::from_str(&text).expect("parse the exported JavaScript catalog")
}

fn opt<T: Into<Value>>(value: Option<T>) -> Value {
    value.map_or(Value::Null, Into::into)
}

/// The JavaScript context shape, with `null` fields dropped and `outputIsFixed`
/// reduced to its truthiness, since Rust reads both `null` and absent as `None`.
fn normalize_js_context(context: &Value) -> Value {
    let Some(object) = context.as_object() else {
        return Value::Null;
    };
    let mut normalized = Map::new();
    for (key, value) in object {
        match (key.as_str(), value) {
            (_, Value::Null) | ("extended", _) => {}
            ("outputIsFixed", flag) => {
                if flag.as_bool().unwrap_or_else(|| flag.as_i64() != Some(0)) {
                    normalized.insert(key.clone(), json!(true));
                }
            }
            _ => {
                normalized.insert(key.clone(), value.clone());
            }
        }
    }
    Value::Object(normalized)
}

fn rust_context(context: Option<&ModelContext>) -> Value {
    let Some(context) = context else {
        return Value::Null;
    };
    let mut object = Map::new();
    let mut put = |key: &str, value: Value| {
        if !value.is_null() {
            object.insert(key.to_owned(), value);
        }
    };
    if context.kind != ContextKind::Image {
        put("type", json!(context.kind.as_str()));
    }
    put("total", opt(context.total));
    put("maxOutput", opt(context.max_output));
    if context.output_is_fixed {
        put("outputIsFixed", json!(true));
    }
    put("sizes", opt(context.sizes.clone()));
    put("qualities", opt(context.qualities.clone()));
    put("unit", opt(context.unit.clone()));
    put("dimensions", opt(context.dimensions));
    put("embeddingType", opt(context.embedding_type.clone()));
    put("normalized", opt(context.normalized));
    Value::Object(object)
}

fn rust_model(model: &Model) -> Value {
    json!({
        "id": model.id(),
        "name": model.name(),
        "creatorId": model.creator_id(),
        "capabilities": model.capabilities().iter().map(|c| c.as_str()).collect::<Vec<_>>(),
        "context": rust_context(model.context()),
        "license": model.license(),
        "languages": model.languages(),
        "aliases": model.aliases(),
        "releasedAt": model.released_at(),
        "extends": model.extends(),
        "providerIds": model
            .provider_ids()
            .map(|provider| json!([provider, model.id_for(provider)]))
            .collect::<Vec<_>>(),
    })
}

#[test]
#[ignore = "needs AIMODELS_JS_CATALOG from rust/scripts/export-js-catalog.mjs"]
fn every_model_matches_the_javascript_package() {
    let js = js_catalog();
    let js_models = js["models"].as_array().expect("models");

    let js_ids: Vec<&str> = js_models
        .iter()
        .map(|m| m["id"].as_str().unwrap())
        .collect();
    let rust_ids: Vec<&str> = models().iter().map(Model::id).collect();
    assert_eq!(rust_ids, js_ids, "model list or order differs");

    for (js_model, model) in js_models.iter().zip(models()) {
        let mut expected = js_model.clone();
        expected["context"] = normalize_js_context(&js_model["context"]);
        assert_eq!(
            rust_model(model),
            expected,
            "model `{}` differs",
            model.id()
        );
    }
}

#[test]
#[ignore = "needs AIMODELS_JS_CATALOG from rust/scripts/export-js-catalog.mjs"]
fn lookups_match_the_javascript_package() {
    let js = js_catalog();

    for (key, expected) in js["idLookups"].as_object().expect("idLookups") {
        assert_eq!(
            opt(models().id(key).map(Model::id)),
            *expected,
            "id lookup `{key}`"
        );
    }

    for lookup in js["providerIdLookups"]
        .as_array()
        .expect("providerIdLookups")
    {
        let provider = lookup[0].as_str().unwrap();
        let provider_model_id = lookup[1].as_str().unwrap();
        assert_eq!(
            opt(models()
                .from_provider_id(provider, provider_model_id)
                .map(Model::id)),
            lookup[2],
            "{provider} id `{provider_model_id}`"
        );
    }

    for (size, expected) in js["minContext"].as_object().expect("minContext") {
        let size: u64 = size.parse().unwrap();
        let ids: Vec<&str> = models()
            .with_min_context(size)
            .iter()
            .map(Model::id)
            .collect();
        assert_eq!(json!(ids), *expected, "with_min_context({size})");
    }
}

#[test]
#[ignore = "needs AIMODELS_JS_CATALOG from rust/scripts/export-js-catalog.mjs"]
fn providers_and_organizations_match_the_javascript_package() {
    let js = js_catalog();

    let providers: Vec<Value> = models()
        .providers()
        .iter()
        .map(|p| {
            json!({
                "id": p.id,
                "name": p.name,
                "apiUrl": p.api_url,
                "apiDocsUrl": p.api_docs_url,
                "websiteUrl": p.website_url,
                "country": p.country,
                "founded": p.founded,
                "pricing": p.pricing.keys().collect::<Vec<_>>(),
            })
        })
        .collect();
    assert_eq!(json!(providers), js["providers"]);

    let active: Vec<&str> = models()
        .active_providers()
        .iter()
        .map(|p| p.id.as_str())
        .collect();
    assert_eq!(json!(active), js["activeProviders"]);

    let organizations: Vec<Value> = models()
        .organizations()
        .iter()
        .map(|o| {
            json!({
                "id": o.id,
                "name": o.name,
                "websiteUrl": o.website_url,
                "country": o.country,
                "founded": o.founded,
            })
        })
        .collect();
    assert_eq!(json!(organizations), js["organizations"]);

    let creators: Vec<&str> = models().creators().iter().map(|o| o.id.as_str()).collect();
    assert_eq!(json!(creators), js["creators"]);
}
