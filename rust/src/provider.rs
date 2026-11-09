use std::collections::BTreeMap;

/// An organization that creates models or serves them.
#[derive(Debug, Clone, PartialEq, Eq)]
#[non_exhaustive]
pub struct Organization {
    /// Catalog ID, such as `"openai"`.
    pub id: String,
    /// Display name.
    pub name: String,
    /// Main website.
    pub website_url: String,
    /// Country code, such as `"USA"`.
    pub country: String,
    /// Year founded.
    pub founded: u16,
}

/// An inference provider, enriched with its organization metadata when the
/// catalog has a matching organization.
#[derive(Debug, Clone, PartialEq)]
#[non_exhaustive]
pub struct Provider {
    /// Catalog ID, such as `"openrouter"`.
    pub id: String,
    /// Display name.
    pub name: String,
    /// Base URL of the provider's API.
    pub api_url: Option<String>,
    /// API documentation URL.
    pub api_docs_url: Option<String>,
    /// Organization website, when known.
    pub website_url: Option<String>,
    /// Organization country code, when known.
    pub country: Option<String>,
    /// Organization founding year, when known.
    pub founded: Option<u16>,
    /// Prices keyed by canonical model ID.
    pub pricing: BTreeMap<String, Price>,
    /// Which creators' models the provider serves and how it names them.
    pub models: Vec<ProviderModels>,
}

/// One entry of a provider's `models` list: the models it serves from one creator.
#[derive(Debug, Clone, PartialEq, Eq)]
#[non_exhaustive]
pub struct ProviderModels {
    /// Creator whose models are listed.
    pub creator: String,
    /// The creator's models this provider serves.
    pub include: Include,
    /// Models excluded when `include` is [`Include::All`].
    pub exclude: Vec<String>,
    /// Prefix added to canonical IDs, such as `"openai/"`.
    pub id_prefix: Option<String>,
    /// Canonical-to-provider ID exceptions; they take precedence over the prefix.
    pub id_overrides: BTreeMap<String, String>,
}

/// Which of a creator's models a provider serves.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Include {
    /// Every model from the creator.
    All,
    /// Only these canonical model IDs.
    Only(Vec<String>),
}

/// A provider's price for one model.
#[derive(Debug, Clone, PartialEq)]
#[non_exhaustive]
pub enum Price {
    /// Price per million tokens.
    #[non_exhaustive]
    Token {
        /// Input price per million tokens.
        input: f64,
        /// Output price per million tokens.
        output: f64,
        /// Cached input price per million tokens, when listed.
        input_cached: Option<f64>,
    },
    /// Price per generated image.
    #[non_exhaustive]
    Image {
        /// Price per image.
        price: f64,
        /// Image size the price applies to.
        size: Option<String>,
        /// Price unit, such as `"per_image"`.
        unit: Option<String>,
    },
    /// Another pricing unit (for example per request or per second), kept as
    /// its `type` name.
    Other(String),
}
