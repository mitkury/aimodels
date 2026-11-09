/// The kind of limits a [`ModelContext`] describes.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[non_exhaustive]
pub enum ContextKind {
    /// `token`: text models measured in tokens.
    Token,
    /// `character`: text models measured in characters.
    Character,
    /// Image generation (stored without a `type` in the catalog).
    Image,
    /// `audio-in`: audio input models.
    AudioIn,
    /// `audio-out`: audio output models.
    AudioOut,
    /// `embedding`: embedding models.
    Embedding,
}

impl ContextKind {
    /// The catalog `type` value, or `"image"` for image generation contexts.
    pub const fn as_str(self) -> &'static str {
        match self {
            ContextKind::Token => "token",
            ContextKind::Character => "character",
            ContextKind::Image => "image",
            ContextKind::AudioIn => "audio-in",
            ContextKind::AudioOut => "audio-out",
            ContextKind::Embedding => "embedding",
        }
    }
}

/// A model's context window and output limits.
///
/// Fields that do not apply to [`kind`](Self::kind) are `None`.
#[derive(Debug, Clone, PartialEq, Eq)]
#[non_exhaustive]
pub struct ModelContext {
    /// What kind of limits these are.
    pub kind: ContextKind,
    /// Maximum input size (tokens or characters); `None` when unknown or unlimited.
    pub total: Option<u64>,
    /// Maximum output size; for image models, the maximum images per request.
    pub max_output: Option<u64>,
    /// `true` when the model can always produce up to `max_output` regardless
    /// of input size (as long as the input fits within `total`).
    pub output_is_fixed: bool,
    /// Available image sizes, such as `"1024x1024"`.
    pub sizes: Option<Vec<String>>,
    /// Available image quality settings.
    pub qualities: Option<Vec<String>>,
    /// Unit of an embedding model's input size (`"tokens"` or `"characters"`).
    pub unit: Option<String>,
    /// Size of the vectors an embedding model produces.
    pub dimensions: Option<u64>,
    /// What an embedding model embeds, such as `"text"`.
    pub embedding_type: Option<String>,
    /// Whether an embedding model's output vectors are normalized.
    pub normalized: Option<bool>,
}
