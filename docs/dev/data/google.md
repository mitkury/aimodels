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
