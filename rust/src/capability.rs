use std::fmt;
use std::str::FromStr;

use serde::Deserialize;

/// What a model can do, as listed in its `capabilities`.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord, Deserialize)]
#[non_exhaustive]
pub enum Capability {
    /// `chat`: conversational text in and out.
    #[serde(rename = "chat")]
    Chat,
    /// `reason`: spends tokens on reasoning before responding.
    #[serde(rename = "reason")]
    Reason,
    /// `txt-in`: reads text.
    #[serde(rename = "txt-in")]
    TxtIn,
    /// `txt-out`: writes text.
    #[serde(rename = "txt-out")]
    TxtOut,
    /// `img-in`: understands images.
    #[serde(rename = "img-in")]
    ImgIn,
    /// `img-out`: generates images.
    #[serde(rename = "img-out")]
    ImgOut,
    /// `audio-in`: processes audio.
    #[serde(rename = "audio-in")]
    AudioIn,
    /// `audio-out`: generates audio or speech.
    #[serde(rename = "audio-out")]
    AudioOut,
    /// `video-in`: processes video.
    #[serde(rename = "video-in")]
    VideoIn,
    /// `video-out`: generates video.
    #[serde(rename = "video-out")]
    VideoOut,
    /// `json-out`: structured JSON output.
    #[serde(rename = "json-out")]
    JsonOut,
    /// `fn-out`: function calling.
    #[serde(rename = "fn-out")]
    FnOut,
    /// `vec-out`: vector embeddings.
    #[serde(rename = "vec-out")]
    VecOut,
}

impl Capability {
    /// Every capability, in catalog order.
    pub const ALL: [Capability; 13] = [
        Capability::Chat,
        Capability::Reason,
        Capability::TxtIn,
        Capability::TxtOut,
        Capability::ImgIn,
        Capability::ImgOut,
        Capability::AudioIn,
        Capability::AudioOut,
        Capability::VideoIn,
        Capability::VideoOut,
        Capability::JsonOut,
        Capability::FnOut,
        Capability::VecOut,
    ];

    /// The catalog name of the capability, such as `"img-in"`.
    pub const fn as_str(self) -> &'static str {
        match self {
            Capability::Chat => "chat",
            Capability::Reason => "reason",
            Capability::TxtIn => "txt-in",
            Capability::TxtOut => "txt-out",
            Capability::ImgIn => "img-in",
            Capability::ImgOut => "img-out",
            Capability::AudioIn => "audio-in",
            Capability::AudioOut => "audio-out",
            Capability::VideoIn => "video-in",
            Capability::VideoOut => "video-out",
            Capability::JsonOut => "json-out",
            Capability::FnOut => "fn-out",
            Capability::VecOut => "vec-out",
        }
    }
}

impl fmt::Display for Capability {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}

/// Error returned when parsing a string that is not a known capability.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UnknownCapability(pub String);

impl fmt::Display for UnknownCapability {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "unknown model capability `{}`", self.0)
    }
}

impl std::error::Error for UnknownCapability {}

impl FromStr for Capability {
    type Err = UnknownCapability;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Capability::ALL
            .into_iter()
            .find(|capability| capability.as_str() == s)
            .ok_or_else(|| UnknownCapability(s.to_owned()))
    }
}
