use std::collections::HashMap;

use crate::{Capability, ContextKind, Model, Organization, Provider};

/// The whole catalog. Get it with [`models()`](crate::models).
#[derive(Debug)]
pub struct Catalog {
    pub(crate) models: Vec<Model>,
    /// Model index by canonical ID or alias; the first model in catalog order wins.
    pub(crate) lookup: HashMap<String, usize>,
    pub(crate) providers: Vec<Provider>,
    pub(crate) organizations: Vec<Organization>,
}

impl Catalog {
    /// All models as a collection that can be filtered further.
    pub fn all(&self) -> ModelCollection<'_> {
        ModelCollection {
            catalog: self,
            models: self.models.iter().collect(),
        }
    }

    /// Iterates over every model in catalog order.
    pub fn iter(&self) -> std::slice::Iter<'_, Model> {
        self.models.iter()
    }

    /// Number of models.
    pub fn len(&self) -> usize {
        self.models.len()
    }

    /// Whether the catalog has no models.
    pub fn is_empty(&self) -> bool {
        self.models.is_empty()
    }

    /// Finds a model by canonical ID or alias.
    pub fn id(&self, id_or_alias: &str) -> Option<&Model> {
        self.lookup
            .get(id_or_alias)
            .map(|&index| &self.models[index])
    }

    /// Models that have every capability in `capabilities`.
    pub fn can(&self, capabilities: &[Capability]) -> ModelCollection<'_> {
        self.all().can(capabilities)
    }

    /// Models created by `creator`, such as `"google"`.
    pub fn from_creator(&self, creator: &str) -> ModelCollection<'_> {
        self.all().from_creator(creator)
    }

    /// Models served by `provider`, such as `"openrouter"`.
    pub fn from_provider(&self, provider: &str) -> ModelCollection<'_> {
        self.all().from_provider(provider)
    }

    /// Text models whose total context is at least `size` tokens or characters.
    pub fn with_min_context(&self, size: u64) -> ModelCollection<'_> {
        self.all().with_min_context(size)
    }

    /// Models that know every language in `languages`.
    pub fn know(&self, languages: &[&str]) -> ModelCollection<'_> {
        self.all().know(languages)
    }

    /// Finds the canonical model behind an ID returned by `provider`.
    pub fn from_provider_id(&self, provider: &str, provider_model_id: &str) -> Option<&Model> {
        self.all().from_provider_id(provider, provider_model_id)
    }

    /// Resolves a canonical ID or alias to the ID `provider` expects.
    pub fn resolve_model_id_for_provider(&self, id_or_alias: &str, provider: &str) -> Option<&str> {
        self.id(id_or_alias)?.id_for(provider)
    }

    /// Every known provider, whether or not it serves a catalog model.
    pub fn providers(&self) -> &[Provider] {
        &self.providers
    }

    /// Providers that serve at least one catalog model.
    pub fn active_providers(&self) -> Vec<&Provider> {
        self.all().providers()
    }

    /// Finds a provider by ID.
    pub fn provider(&self, id: &str) -> Option<&Provider> {
        self.providers.iter().find(|provider| provider.id == id)
    }

    /// Every known organization, including providers that create no models.
    pub fn organizations(&self) -> &[Organization] {
        &self.organizations
    }

    /// Finds an organization by ID.
    pub fn organization(&self, id: &str) -> Option<&Organization> {
        self.organizations.iter().find(|org| org.id == id)
    }

    /// Organizations that create at least one catalog model.
    pub fn creators(&self) -> Vec<&Organization> {
        self.all().creators()
    }
}

impl<'a> IntoIterator for &'a Catalog {
    type Item = &'a Model;
    type IntoIter = std::slice::Iter<'a, Model>;

    fn into_iter(self) -> Self::IntoIter {
        self.models.iter()
    }
}

/// A filtered list of catalog models, in catalog order.
///
/// Filters consume the collection and return a narrower one, so they chain:
///
/// ```
/// use aimodels::{models, Capability};
///
/// let vision_json = models()
///     .from_creator("google")
///     .can(&[Capability::Chat, Capability::ImgIn, Capability::JsonOut]);
/// assert!(!vision_json.is_empty());
/// ```
#[derive(Debug, Clone)]
pub struct ModelCollection<'a> {
    catalog: &'a Catalog,
    models: Vec<&'a Model>,
}

impl<'a> ModelCollection<'a> {
    /// Keeps the models for which `predicate` returns `true`.
    pub fn filter(mut self, mut predicate: impl FnMut(&Model) -> bool) -> Self {
        self.models.retain(|model| predicate(model));
        self
    }

    /// Keeps models that have every capability in `capabilities`.
    pub fn can(self, capabilities: &[Capability]) -> Self {
        self.filter(|model| model.can(capabilities))
    }

    /// Keeps models created by `creator`.
    pub fn from_creator(self, creator: &str) -> Self {
        self.filter(|model| model.creator_id == creator)
    }

    /// Keeps models served by `provider`.
    pub fn from_provider(self, provider: &str) -> Self {
        self.filter(|model| model.id_for(provider).is_some())
    }

    /// Keeps token or character models whose total context is at least `size`.
    pub fn with_min_context(self, size: u64) -> Self {
        self.filter(|model| {
            model.context.as_ref().is_some_and(|context| {
                matches!(context.kind, ContextKind::Token | ContextKind::Character)
                    && context.total.is_some_and(|total| total >= size)
            })
        })
    }

    /// Keeps models that know every language in `languages`.
    pub fn know(self, languages: &[&str]) -> Self {
        self.filter(|model| {
            model.languages.as_ref().is_some_and(|known| {
                languages
                    .iter()
                    .all(|language| known.iter().any(|k| k == language))
            })
        })
    }

    /// Finds a model in this collection by canonical ID or alias.
    pub fn id(&self, id_or_alias: &str) -> Option<&'a Model> {
        self.iter()
            .find(|model| model.id == id_or_alias || model.aliases.iter().any(|a| a == id_or_alias))
    }

    /// Finds the model in this collection behind an ID returned by `provider`.
    pub fn from_provider_id(&self, provider: &str, provider_model_id: &str) -> Option<&'a Model> {
        self.iter()
            .find(|model| model.id_for(provider) == Some(provider_model_id))
    }

    /// Providers that serve at least one model in this collection.
    pub fn providers(&self) -> Vec<&'a Provider> {
        let mut seen: Vec<&str> = Vec::new();
        for model in self.iter() {
            for id in model.provider_ids() {
                if !seen.contains(&id) {
                    seen.push(id);
                }
            }
        }
        seen.into_iter()
            .filter_map(|id| self.catalog.provider(id))
            .collect()
    }

    /// Organizations that create at least one model in this collection.
    pub fn creators(&self) -> Vec<&'a Organization> {
        let mut seen: Vec<&str> = Vec::new();
        for model in self.iter() {
            if !seen.contains(&model.creator_id.as_str()) {
                seen.push(&model.creator_id);
            }
        }
        seen.into_iter()
            .filter_map(|id| self.catalog.organization(id))
            .collect()
    }

    /// Iterates over the models.
    pub fn iter(&self) -> std::iter::Copied<std::slice::Iter<'_, &'a Model>> {
        self.models.iter().copied()
    }

    /// The models as a slice.
    pub fn as_slice(&self) -> &[&'a Model] {
        &self.models
    }

    /// Number of models.
    pub fn len(&self) -> usize {
        self.models.len()
    }

    /// Whether the collection is empty.
    pub fn is_empty(&self) -> bool {
        self.models.is_empty()
    }
}

impl<'a> IntoIterator for ModelCollection<'a> {
    type Item = &'a Model;
    type IntoIter = std::vec::IntoIter<&'a Model>;

    fn into_iter(self) -> Self::IntoIter {
        self.models.into_iter()
    }
}

impl<'c, 'a> IntoIterator for &'c ModelCollection<'a> {
    type Item = &'a Model;
    type IntoIter = std::iter::Copied<std::slice::Iter<'c, &'a Model>>;

    fn into_iter(self) -> Self::IntoIter {
        self.iter()
    }
}
