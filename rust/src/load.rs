//! Parses the embedded catalog and resolves it the same way the JavaScript
//! package does.

use std::collections::{BTreeMap, HashMap, HashSet};
use std::fmt;
use std::marker::PhantomData;

use serde::de::{IgnoredAny, MapAccess, Visitor};
use serde::{Deserialize, Deserializer};
use serde_json::Value;

use crate::{
    Capability, Catalog, ContextKind, Include, Model, ModelContext, Organization, Price, Provider,
    ProviderModels,
};

include!(concat!(env!("OUT_DIR"), "/catalog_files.rs"));

pub(crate) fn load() -> Result<Catalog, String> {
    let orgs: OrderedMap<RawOrganization> =
        serde_json::from_str(ORGS).map_err(|err| format!("orgs.json: {err}"))?;
    let organizations: Vec<Organization> = orgs
        .0
        .into_iter()
        .map(|(id, org)| Organization {
            id,
            name: org.name,
            website_url: org.website_url,
            country: org.country,
            founded: org.founded,
        })
        .collect();

    let mut raw_providers: Vec<RawProvider> = Vec::new();
    for (file, json) in PROVIDER_FILES {
        let provider: RawProvider =
            serde_json::from_str(json).map_err(|err| format!("providers/{file}: {err}"))?;
        if raw_providers.iter().any(|p| p.id == provider.id) {
            return Err(format!(
                "providers/{file}: duplicate provider `{}`",
                provider.id
            ));
        }
        raw_providers.push(provider);
    }

    let mut sources: Vec<Source> = Vec::new();
    for (file, json) in MODEL_FILES {
        let collection: RawModelFile =
            serde_json::from_str(json).map_err(|err| format!("models/{file}: {err}"))?;
        for raw in collection.models {
            sources.push(Source {
                creator: collection.creator.clone(),
                raw,
            });
        }
    }

    let mut index: HashMap<&str, usize> = HashMap::new();
    for (i, source) in sources.iter().enumerate() {
        if index.insert(&source.raw.id, i).is_some() {
            return Err(format!("duplicate model `{}`", source.raw.id));
        }
    }
    for source in &sources {
        check_chain(&sources, &index, source)?;
    }

    let providers = raw_providers
        .iter()
        .map(|raw| provider(raw, &organizations))
        .collect::<Result<Vec<_>, _>>()?;

    let models: Vec<Model> = (0..sources.len())
        .map(|i| resolve(&sources, &index, i, &providers))
        .collect();

    let mut lookup: HashMap<String, usize> = HashMap::new();
    for (i, model) in models.iter().enumerate() {
        for key in std::iter::once(&model.id).chain(&model.aliases) {
            lookup.entry(key.clone()).or_insert(i);
        }
    }

    Ok(Catalog {
        models,
        lookup,
        providers,
        organizations,
    })
}

struct Source {
    /// The `creator` of the file the record came from. Like the JavaScript
    /// build, this always becomes the model's creator.
    creator: String,
    raw: RawModel,
}

fn check_chain(
    sources: &[Source],
    index: &HashMap<&str, usize>,
    source: &Source,
) -> Result<(), String> {
    let mut seen = HashSet::new();
    let mut current = source;
    seen.insert(current.raw.id.as_str());
    while let Some(base) = &current.raw.extends {
        let &i = index
            .get(base.as_str())
            .ok_or_else(|| format!("model `{}` extends unknown model `{base}`", current.raw.id))?;
        current = &sources[i];
        if !seen.insert(current.raw.id.as_str()) {
            return Err(format!("model `{}` has an `extends` cycle", source.raw.id));
        }
    }
    Ok(())
}

/// Finds a field the way the JavaScript `Model.resolveProperty` does: the
/// record's own value, then its `overrides`, then the same lookup on the model
/// it extends.
fn inherit<'s, T: ?Sized>(
    sources: &'s [Source],
    index: &HashMap<&str, usize>,
    start: usize,
    own: impl Fn(&'s RawModel) -> Option<&'s T>,
    overridden: impl Fn(&'s RawOverrides) -> Option<&'s T>,
) -> Option<&'s T> {
    let mut current = &sources[start].raw;
    loop {
        if let Some(value) = own(current) {
            return Some(value);
        }
        if let Some(value) = current.overrides.as_ref().and_then(&overridden) {
            return Some(value);
        }
        current = &sources[index[current.extends.as_deref()?]].raw;
    }
}

fn resolve(
    sources: &[Source],
    index: &HashMap<&str, usize>,
    i: usize,
    providers: &[Provider],
) -> Model {
    let source = &sources[i];
    let raw = &source.raw;
    let own_overrides = raw.overrides.as_ref();

    let name = inherit(
        sources,
        index,
        i,
        |m| m.name.as_deref(),
        |o| o.name.as_deref(),
    )
    .filter(|name| !name.is_empty())
    .unwrap_or(&raw.id)
    .to_owned();
    let capabilities = inherit(
        sources,
        index,
        i,
        |m| m.capabilities.as_deref(),
        |o| o.capabilities.as_deref(),
    )
    .map(<[Capability]>::to_vec)
    .unwrap_or_default();
    let context = inherit(
        sources,
        index,
        i,
        |m| m.context.as_ref(),
        |o| o.context.as_ref(),
    )
    .cloned();
    let license = inherit(
        sources,
        index,
        i,
        |m| m.license.as_deref(),
        |o| o.license.as_deref(),
    )
    .map(str::to_owned);
    let languages = inherit(
        sources,
        index,
        i,
        |m| m.languages.as_deref(),
        |o| o.languages.as_deref(),
    )
    .map(<[String]>::to_vec);

    // Aliases and release dates identify one record, so they are not inherited.
    let aliases = raw
        .aliases
        .as_ref()
        .or_else(|| own_overrides.and_then(|o| o.aliases.as_ref()))
        .cloned()
        .unwrap_or_default();
    let released_at = raw
        .released_at
        .as_ref()
        .or_else(|| own_overrides.and_then(|o| o.released_at.as_ref()))
        .cloned();

    let provider_ids = providers
        .iter()
        .filter_map(|provider| {
            provider_model_id(provider, &source.creator, &raw.id)
                .map(|id| (provider.id.clone(), id))
        })
        .collect();

    Model {
        id: raw.id.clone(),
        name,
        creator_id: source.creator.clone(),
        capabilities,
        context: context.map(ModelContext::from),
        license,
        languages,
        aliases,
        released_at,
        extends: raw.extends.clone(),
        provider_ids,
    }
}

/// The ID `provider` uses for a model, or `None` when it does not serve it.
///
/// A creator's own provider serves all of its models unless its `models` list
/// has an entry for that creator; other providers serve only what they list.
fn provider_model_id(provider: &Provider, creator: &str, id: &str) -> Option<String> {
    let includes = |entry: &&ProviderModels| {
        entry.creator == creator
            && match &entry.include {
                Include::All => !entry.exclude.iter().any(|e| e == id),
                Include::Only(ids) => ids.iter().any(|i| i == id),
            }
    };

    let serves = if provider.id == creator {
        match provider
            .models
            .iter()
            .find(|entry| entry.creator == creator)
        {
            None => true,
            Some(entry) => includes(&entry),
        }
    } else {
        provider.models.iter().any(|entry| includes(&entry))
    };
    if !serves {
        return None;
    }

    let mapping = provider.models.iter().find(includes);
    let id = match mapping {
        Some(entry) => match entry.id_overrides.get(id) {
            Some(provider_id) => provider_id.clone(),
            None => format!("{}{id}", entry.id_prefix.as_deref().unwrap_or("")),
        },
        None => id.to_owned(),
    };
    Some(id)
}

fn provider(raw: &RawProvider, organizations: &[Organization]) -> Result<Provider, String> {
    let org = organizations.iter().find(|org| org.id == raw.id);
    let pricing = raw
        .pricing
        .iter()
        .map(|(model, price)| {
            parse_price(price)
                .map(|price| (model.clone(), price))
                .map_err(|err| format!("provider `{}` pricing for `{model}`: {err}", raw.id))
        })
        .collect::<Result<BTreeMap<_, _>, _>>()?;
    let models = raw
        .models
        .iter()
        .map(|entry| {
            let include = match &entry.include {
                RawInclude::All(all) if all == "all" => Include::All,
                RawInclude::All(other) => {
                    return Err(format!("provider `{}`: invalid include `{other}`", raw.id))
                }
                RawInclude::Only(ids) => Include::Only(ids.clone()),
            };
            Ok(ProviderModels {
                creator: entry.creator.clone(),
                include,
                exclude: entry.exclude.clone(),
                id_prefix: entry.id_prefix.clone(),
                id_overrides: entry.id_overrides.clone(),
            })
        })
        .collect::<Result<Vec<_>, _>>()?;

    Ok(Provider {
        id: raw.id.clone(),
        name: raw.name.clone(),
        api_url: raw.api_url.clone(),
        api_docs_url: raw.api_docs_url.clone(),
        website_url: org.map(|org| org.website_url.clone()),
        country: org.map(|org| org.country.clone()),
        founded: org.map(|org| org.founded),
        pricing,
        models,
    })
}

fn parse_price(value: &Value) -> Result<Price, String> {
    let number = |key: &str| value.get(key).and_then(Value::as_f64);
    let string = |key: &str| value.get(key).and_then(Value::as_str).map(str::to_owned);
    let kind = value
        .get("type")
        .and_then(Value::as_str)
        .ok_or("missing `type`")?;
    Ok(match kind {
        "token" => Price::Token {
            input: number("input").ok_or("missing `input`")?,
            output: number("output").ok_or("missing `output`")?,
            input_cached: number("input_cached"),
        },
        "image" => Price::Image {
            price: number("price").ok_or("missing `price`")?,
            size: string("size"),
            unit: string("unit"),
        },
        other => Price::Other(other.to_owned()),
    })
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct RawModelFile {
    creator: String,
    models: Vec<RawModel>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct RawModel {
    id: String,
    name: Option<String>,
    license: Option<String>,
    aliases: Option<Vec<String>>,
    released_at: Option<String>,
    capabilities: Option<Vec<Capability>>,
    context: Option<RawContext>,
    extends: Option<String>,
    overrides: Option<RawOverrides>,
    /// Accepted for schema compatibility; the file's `creator` always wins.
    #[allow(dead_code)]
    creator_id: Option<String>,
    languages: Option<Vec<String>>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct RawOverrides {
    name: Option<String>,
    capabilities: Option<Vec<Capability>>,
    context: Option<RawContext>,
    license: Option<String>,
    aliases: Option<Vec<String>>,
    released_at: Option<String>,
    /// Accepted for schema compatibility; the file's `creator` always wins.
    #[allow(dead_code)]
    creator_id: Option<String>,
    languages: Option<Vec<String>>,
}

#[derive(Clone, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct RawContext {
    #[serde(rename = "type")]
    kind: Option<RawContextKind>,
    total: Option<u64>,
    max_output: Option<u64>,
    output_is_fixed: Option<OutputIsFixed>,
    #[allow(dead_code)]
    extended: Option<IgnoredAny>,
    sizes: Option<Vec<String>>,
    qualities: Option<Vec<String>>,
    unit: Option<String>,
    dimensions: Option<u64>,
    embedding_type: Option<String>,
    normalized: Option<bool>,
}

#[derive(Clone, Copy, Deserialize)]
#[serde(rename_all = "kebab-case")]
enum RawContextKind {
    Token,
    Character,
    AudioIn,
    AudioOut,
    Embedding,
}

/// `outputIsFixed` is `1` in the catalog; the schema also accepts other
/// integers and booleans.
#[derive(Clone, Copy, Deserialize)]
#[serde(untagged)]
enum OutputIsFixed {
    Flag(bool),
    Number(i64),
}

impl From<RawContext> for ModelContext {
    fn from(raw: RawContext) -> Self {
        let kind = match raw.kind {
            Some(RawContextKind::Token) => ContextKind::Token,
            Some(RawContextKind::Character) => ContextKind::Character,
            Some(RawContextKind::AudioIn) => ContextKind::AudioIn,
            Some(RawContextKind::AudioOut) => ContextKind::AudioOut,
            Some(RawContextKind::Embedding) => ContextKind::Embedding,
            None => ContextKind::Image,
        };
        ModelContext {
            kind,
            total: raw.total,
            max_output: raw.max_output,
            output_is_fixed: match raw.output_is_fixed {
                Some(OutputIsFixed::Flag(flag)) => flag,
                Some(OutputIsFixed::Number(n)) => n != 0,
                None => false,
            },
            sizes: raw.sizes,
            qualities: raw.qualities,
            unit: raw.unit,
            dimensions: raw.dimensions,
            embedding_type: raw.embedding_type,
            normalized: raw.normalized,
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct RawProvider {
    id: String,
    name: String,
    api_url: Option<String>,
    api_docs_url: Option<String>,
    #[serde(default)]
    pricing: BTreeMap<String, Value>,
    #[serde(default)]
    models: Vec<RawProviderModels>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct RawProviderModels {
    creator: String,
    include: RawInclude,
    #[serde(default)]
    exclude: Vec<String>,
    id_prefix: Option<String>,
    #[serde(default)]
    id_overrides: BTreeMap<String, String>,
}

#[derive(Deserialize)]
#[serde(untagged)]
enum RawInclude {
    All(String),
    Only(Vec<String>),
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct RawOrganization {
    name: String,
    website_url: String,
    country: String,
    founded: u16,
}

/// A JSON object read as a list of entries in file order.
struct OrderedMap<T>(Vec<(String, T)>);

impl<'de, T: Deserialize<'de>> Deserialize<'de> for OrderedMap<T> {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        struct OrderedVisitor<T>(PhantomData<T>);

        impl<'de, T: Deserialize<'de>> Visitor<'de> for OrderedVisitor<T> {
            type Value = OrderedMap<T>;

            fn expecting(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
                f.write_str("a JSON object")
            }

            fn visit_map<A: MapAccess<'de>>(self, mut map: A) -> Result<Self::Value, A::Error> {
                let mut entries = Vec::new();
                while let Some(entry) = map.next_entry()? {
                    entries.push(entry);
                }
                Ok(OrderedMap(entries))
            }
        }

        deserializer.deserialize_map(OrderedVisitor(PhantomData))
    }
}
