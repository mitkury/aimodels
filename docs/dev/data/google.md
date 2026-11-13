# Google

Official sources:

- Gemini API models:
  https://ai.google.dev/gemini-api/docs/models
- Gemini 3.6 Flash:
  https://ai.google.dev/gemini-api/docs/models/gemini-3.6-flash
- Gemini 3.5 Flash-Lite:
  https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite
- Gemini 3.7 Flash:
  https://ai.google.dev/gemini-api/docs/models/gemini-3.7-flash
- Gemini Robotics ER 2:
  https://ai.google.dev/gemini-api/docs/models/gemini-robotics-er-2-preview
- Gemini Robotics ER 2 Streaming:
  https://ai.google.dev/gemini-api/docs/models/gemini-robotics-er-2-streaming-preview
- Gemini API release notes:
  https://ai.google.dev/gemini-api/docs/changelog
- Gemini API model-list endpoint:
  https://ai.google.dev/api/models#method:-models.list
- Vertex AI generative model release notes:
  https://docs.cloud.google.com/vertex-ai/generative-ai/docs/release-notes

The July 30, 2026 release notes establish the two Robotics ER 2 endpoint IDs,
their multimodal inputs, and function calling. Their model pages publish a
131,072-token input limit and 65,536-token output limit. The August 13 release
notes and model page establish the stable `gemini-3.7-flash` ID and limits.

## September 9, 2026 audit

- [Gemini 3.8 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash):
  1,048,576 input tokens, 65,536 output tokens; text, image, audio, and video
  inputs, with text output, thinking, tools, and structured output.
- [Gemini 3.5 Transcribe](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-transcribe):
  separate unary and live API IDs. The unary limit is one hour, or 30 minutes
  with diarization/timestamps. Do not inherit that duration onto live sessions.
- [Gemini Omni Flash](https://ai.google.dev/gemini-api/docs/models/gemini-omni-flash):
  current ID `gemini-omni-1.1-flash`; text/image/video input and video output.
  Its documented input context is 1,048,576 tokens. The schema does not encode
  video duration or output resolution alongside token context.
- [Music generation](https://ai.google.dev/gemini-api/docs/music-generation):
  `lyria-3.5` accepts text/images and produces music and lyrics. No exact
  duration ceiling is recorded.
- [Changelog](https://ai.google.dev/gemini-api/docs/changelog):
  Transcribe August 26, Omni 1.1 August 27, Flash 3.8 September 2, and
  Lyria 3.5 September 3.

## September 16, 2026 audit

The [September 15 release notes](https://ai.google.dev/gemini-api/docs/changelog)
announce [Gemini 3.8 Live](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-live)
and [Live Extended Thinking](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-live-extended-thinking).
Both accept text, images, audio, and video, with 131,072 input tokens and 65,536
output tokens. Both support thinking and function calling, but not structured
JSON output. Audio is the response modality; text output is available through
audio transcription, not a standalone text-only response mode.

The two callable IDs are separate records: the default Live model has interleaved
reasoning; Extended Thinking exposes background reasoning and async-only tools.
These differences do not require new catalog capability flags. Do not inherit
Flash's one-million-token context or JSON support. Gemini 3.8 Flash was already
present and is not duplicated. Neither Live ID appeared on OpenRouter.

## October 13, 2026 audit

The [October 13 release notes](https://ai.google.dev/gemini-api/docs/changelog)
make [Gemini 4 Argon](https://ai.google.dev/gemini-api/docs/models/gemini-4-argon)
(`gemini-4-argon`) generally available. Its model page lists text, image, video,
audio, and PDF input with text output; function calling, structured outputs,
and thinking (low, medium, high); no Live API. The context window is 1,048,576
tokens, input and output together. Output is not recorded: the model page gives
65,536 tokens by default (more with long decode), while the model-list endpoint
reports an `outputTokenLimit` of 32,768. The September 30 announcement opened
access to a restricted program only, so `releasedAt` is the GA date. Pricing is
on a "What's new in Gemini 4 Argon" page and is not recorded here.

## November 2, 2026 audit

[Nano Banana 2.1](https://ai.google.dev/gemini-api/docs/models/gemini-nano-banana-2.1)
has text/image/video input and text/image output, with 131,072 input tokens
and 32,768 output tokens. Thinking is supported; function calling and structured
output are not. [Flash TTS](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash-tts)
and [Flash-Lite TTS](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash-lite-tts)
use token limits (8,192 input; 16,384 output), not audio seconds. The
[changelog](https://ai.google.dev/gemini-api/docs/changelog) dates Nano Banana 2.1
to October 6, 2026, and both Flash TTS and Flash-Lite TTS to September 22, 2026.

[EmbeddingGemma 2](https://huggingface.co/google/embeddinggemma-2) is Apache-2.0,
with text/image/audio/video input, 8,192 tokens and 768 default dimensions.
Truncated vectors are deployment options, not separate models. No native Gemini
API selector is established, so explicitly exclude the checkpoint from Google
availability and omit an API release date. Gemini 4 Argon was already added;
this audit adds its verified OpenRouter route.

## November 4, 2026 audit

[Gemini Embedding 2](https://ai.google.dev/gemini-api/docs/models/gemini-embedding-2)
has a stable Gemini API ID, an 8,192-token input limit and multimodal inputs.
The [embedding guide](https://ai.google.dev/gemini-api/docs/embeddings) specifies
3,072 default dimensions; the [April 22 release notes](https://ai.google.dev/gemini-api/docs/changelog)
establish GA. Keep the preview as a historical record, not an alias.

The [Gemini API shutdown schedule](https://ai.google.dev/gemini-api/docs/deprecations)
establishes these completed retirements for cataloged IDs:

| Shutdown | Models excluded from native Gemini availability |
| --- | --- |
| 2025-11-10 | `imagen-3.0-generate-002` |
| 2025-11-12 | `veo-3.0-generate-preview` |
| 2025-12-02 | `gemini-2.5-pro-preview-06-05` |
| 2026-01-14 | `text-embedding-004` |
| 2026-02-17 | `gemini-2.5-flash-preview-09-2025` |
| 2026-03-09 | `gemini-3-pro-preview` |
| 2026-03-31 | `gemini-2.5-flash-lite-preview-09-2025` |
| 2026-05-25 | `gemini-3.1-flash-lite-preview` |
| 2026-06-01 | `gemini-2.0-flash`, `gemini-2.0-flash-lite` |
| 2026-06-25 | `gemini-3.1-flash-image-preview`, `gemini-3-pro-image-preview` |
| 2026-06-30 | `veo-2.0-generate-001`, `veo-3.0-generate-001`, `veo-3.0-fast-generate-001` |
| 2026-08-10 | `gemini-embedding-2-preview` |
| 2026-08-17 | `imagen-4.0-generate-001`, `imagen-4.0-ultra-generate-001`, `imagen-4.0-fast-generate-001` |
| 2026-10-22 | `veo-3.1-generate-preview`, `veo-3.1-fast-generate-preview`, `veo-3.1-lite-generate-preview`, `gemini-omni-flash-preview` |

These are Gemini API exclusions, not claims about Vertex availability. Keep
intrinsic records and models with future shutdown dates. Gemini 3.5/3.7 Flash
remain callable through automatic routing. Managed-agent codes are left out of
the intrinsic model catalog; they select an agent harness through Interactions.

## November 9, 2026 audit

The [November 5 release notes](https://ai.google.dev/gemini-api/docs/changelog)
and [model page](https://ai.google.dev/gemini-api/docs/models/gemini-omni-flash)
establish the stable Gemini Omni 1.2 Flash API ID, 131,072 input tokens,
65,536 output tokens, and text/image/video inputs with video and text outputs.
The audio is part of the generated video. The Omni 1.1 selector continues
serving 1.1 until Google's December 3 redirect.

Remove the retired `text-embedding-004` record. The January 14 release notes
confirm its shutdown. [Gemini 4 Carbon](https://blog.google/innovation-and-ai/technology/ai/google-ai-updates-october-2026/)
is still in restricted pre-release testing, with no verified Gemini API ID.

## November 12, 2026 audit

The [Gemini API changelog](https://aistudio.google.com/docs/changelog) dates
Carbon to November 10, Decision 1 to November 11, and Hydrogen to November 12.
The [model catalog](https://aistudio.google.com/docs/models) lists 1M context
and 65K default output for both Gemini 4 models. The
[Carbon model card](https://aistudio.google.com/docs/models/gemini-4-carbon)
gives the exact context and standard synchronous limits. Both models support
long decode beyond that standard output limit. OpenRouter lists both IDs.

[Gemini Decision 1](https://aistudio.google.com/docs/decisions-api) accepts
text, images, audio, and video. The 262,144-token limit includes all questions
and their shared input. The Decisions API returns scores in a fixed response
structure and generates zero output tokens.
