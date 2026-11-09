//! A collection of AI model specifications across different providers.
//!
//! The catalog is embedded at compile time from the AIModels data set, the same
//! data shipped by the `aimodels` npm package and the `aimodels.dev` Python
//! package. Nothing is read from the network or the environment at run time.
//!
//! Canonical model IDs are independent of the provider that serves them.
//! Store the canonical ID and translate it only when building a provider
//! request:
//!
//! ```
//! use aimodels::models;
//!
//! let model = models().id("gpt-5.1").unwrap();
//! assert_eq!(model.id_for("openrouter"), Some("openai/gpt-5.1"));
//!
//! let same = models().from_provider_id("openrouter", "openai/gpt-5.1").unwrap();
//! assert_eq!(same.id(), "gpt-5.1");
//! ```
//!
//! Filter by creator, provider and capabilities, and read context limits:
//!
//! ```
//! use aimodels::{models, Capability};
//!
//! for model in models()
//!     .from_creator("google")
//!     .can(&[Capability::Chat, Capability::ImgIn, Capability::JsonOut])
//! {
//!     let context = model.context().unwrap();
//!     println!("{}: {:?} in, {:?} out", model.id(), context.total, context.max_output);
//! }
//! ```
//!
//! Models that `extends` another inherit its fields, with their own fields and
//! `overrides` taking precedence. Aliases and release dates identify a single
//! record and are never inherited.

#![forbid(unsafe_code)]
#![warn(missing_docs)]

use std::sync::OnceLock;

mod capability;
mod collection;
mod context;
mod load;
mod model;
mod provider;

pub use capability::{Capability, UnknownCapability};
pub use collection::{Catalog, ModelCollection};
pub use context::{ContextKind, ModelContext};
pub use model::Model;
pub use provider::{Include, Organization, Price, Provider, ProviderModels};

/// The embedded catalog.
///
/// It is parsed and resolved on first use and shared afterwards.
pub fn models() -> &'static Catalog {
    static CATALOG: OnceLock<Catalog> = OnceLock::new();
    CATALOG.get_or_init(|| {
        load::load().unwrap_or_else(|err| panic!("the embedded aimodels catalog is invalid: {err}"))
    })
}
