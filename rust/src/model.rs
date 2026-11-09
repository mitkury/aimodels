use crate::{models, Capability, ModelContext, Organization, Provider};

/// A catalog model with `extends`/`overrides` already resolved.
#[derive(Debug, Clone, PartialEq)]
pub struct Model {
    pub(crate) id: String,
    pub(crate) name: String,
    pub(crate) creator_id: String,
    pub(crate) capabilities: Vec<Capability>,
    pub(crate) context: Option<ModelContext>,
    pub(crate) license: Option<String>,
    pub(crate) languages: Option<Vec<String>>,
    pub(crate) aliases: Vec<String>,
    pub(crate) released_at: Option<String>,
    pub(crate) extends: Option<String>,
    /// `(provider ID, provider-specific model ID)` in catalog provider order.
    pub(crate) provider_ids: Vec<(String, String)>,
}

impl Model {
    /// Canonical catalog ID, such as `"gpt-5.1"`.
    pub fn id(&self) -> &str {
        &self.id
    }

    /// Display name; falls back to the ID when the catalog has none.
    pub fn name(&self) -> &str {
        &self.name
    }

    /// ID of the organization that created the model.
    pub fn creator_id(&self) -> &str {
        &self.creator_id
    }

    /// The organization that created the model, when the catalog has it.
    pub fn creator(&self) -> Option<&'static Organization> {
        models().organization(&self.creator_id)
    }

    /// What the model can do.
    pub fn capabilities(&self) -> &[Capability] {
        &self.capabilities
    }

    /// Whether the model has every capability in `capabilities`.
    pub fn can(&self, capabilities: &[Capability]) -> bool {
        capabilities.iter().all(|c| self.capabilities.contains(c))
    }

    /// Context window and output limits.
    pub fn context(&self) -> Option<&ModelContext> {
        self.context.as_ref()
    }

    /// License, such as `"proprietary"` or `"apache-2.0"`.
    pub fn license(&self) -> Option<&str> {
        self.license.as_deref()
    }

    /// Languages the model knows, when listed.
    pub fn languages(&self) -> Option<&[String]> {
        self.languages.as_deref()
    }

    /// Other IDs that identify this model. Not inherited through `extends`.
    pub fn aliases(&self) -> &[String] {
        &self.aliases
    }

    /// ISO release date (`YYYY-MM-DD`) when documented. Not inherited through `extends`.
    pub fn released_at(&self) -> Option<&str> {
        self.released_at.as_deref()
    }

    /// ID of the model this record extends, if any.
    pub fn extends(&self) -> Option<&str> {
        self.extends.as_deref()
    }

    /// IDs of the providers that serve this model.
    pub fn provider_ids(&self) -> impl Iterator<Item = &str> + '_ {
        self.provider_ids
            .iter()
            .map(|(provider, _)| provider.as_str())
    }

    /// The providers that serve this model.
    pub fn providers(&self) -> Vec<&'static Provider> {
        self.provider_ids()
            .filter_map(|id| models().provider(id))
            .collect()
    }

    /// The model ID to send to `provider`, or `None` when that provider does
    /// not serve this model.
    ///
    /// ```
    /// let model = aimodels::models().id("gpt-5.1").unwrap();
    /// assert_eq!(model.id_for("openrouter"), Some("openai/gpt-5.1"));
    /// ```
    pub fn id_for(&self, provider: &str) -> Option<&str> {
        self.provider_ids
            .iter()
            .find(|(id, _)| id == provider)
            .map(|(_, model_id)| model_id.as_str())
    }
}
