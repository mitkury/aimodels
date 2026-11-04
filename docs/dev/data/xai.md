# xAI

Official sources:

- Models and aliases: https://docs.x.ai/developers/models
- Model pricing and context windows: https://docs.x.ai/developers/pricing
- Release notes: https://docs.x.ai/developers/release-notes
- Grok 4.5: https://docs.x.ai/developers/grok-4-5
- Grok 4.3: https://docs.x.ai/developers/models/grok-4.3
- Grok Imagine Image Quality: https://docs.x.ai/developers/models/grok-imagine-image-quality
- Grok Imagine Video 1.5: https://docs.x.ai/developers/models/grok-imagine-video-1.5
- Grok Voice Think Fast 1.0 announcement: https://x.ai/news/grok-voice-think-fast-1
- Voice API model IDs and aliases: https://docs.x.ai/developers/rest-api-reference/inference/voice
- Voice overview, including TTS and STT: https://docs.x.ai/developers/model-capabilities/audio/voice
- July 2026 voice preset announcement: https://x.ai/news/new-flagship-voices

The Voice and Text-to-Speech APIs expose named voice presets, including the 21
voices announced in July 2026. These are selectable voices, not standalone model
IDs. At that audit, the Speech-to-Text REST API did not expose a model selector.

The July 29, 2026 release notes move `grok-voice-latest` to
`grok-voice-think-fast-2.0`; keep the alias only on the new model. The August 12
release notes establish `grok-4.6`, its 500,000-token context, and modalities.

To list the models available to an API key:

```bash
curl https://api.x.ai/v1/models \
  -H "Authorization: Bearer $XAI_API_KEY"
```

## September 9, 2026 audit

The [image-generation guide](https://docs.x.ai/developers/model-capabilities/images/generation)
documents `grok-imagine-image-2.0`, text/image input, image output, batches
of up to ten, 1k/2k resolution selectors, and low/medium/auto quality.
The August 28 release-note entry describes updated controls, not necessarily
the initial model launch, so no release date is assigned.

## November 2, 2026 audit

[Grok 4.7](https://docs.x.ai/developers/grok-4-7) has text/image input,
reasoning, tools, 500,000-token context and no fixed text-output ceiling. Fast
is a product-only serving tier, not a public API model ID.

[Speech to Speech](https://docs.x.ai/developers/model-capabilities/audio/speech-to-speech)
now exposes `grok-voice-3.0`; move `grok-voice-latest` from the old model to
this record. It supports bidirectional text/audio and tools, with no documented
context ceiling. [Speech to Text](https://docs.x.ai/developers/model-capabilities/audio/speech-to-text)
uses `grok-voice-transcribe-2.0` for batch and realtime transcription. Neither
session timeouts nor VAD settings establish model context limits.

## November 4, 2026 audit

The current [release notes](https://docs.x.ai/developers/release-notes) establish
exact API release dates: Grok 4.7 on September 21, Grok Voice 3.0 on October 14,
and Grok Voice Transcribe 2.0 on September 17. The
[structured-output guide](https://docs.x.ai/developers/model-capabilities/text/structured-outputs)
demonstrates schema-constrained responses with `grok-4.7`; add `json-out`.

The [November 2 migration guide](https://docs.x.ai/developers/migration/imagine-image-quality-nov-2)
retires `grok-imagine-image-quality`. Its slug and `grok-imagine-image-pro`
continue to resolve, but serve Image 2.0 at low quality. Preserve the historical
model and exclude it from native availability. `grok-imagine-image-2.0-low` is
a response label for that quality setting, not a documented selectable model.
Image 1.0 is unaffected. The [May 15 retirement guide](https://docs.x.ai/developers/migration/may-15-retirement)
also retires the cataloged `grok-code-fast-1`, `grok-4-fast-non-reasoning`, and
`grok-4-1-fast-non-reasoning` IDs; exclude those native routes.

The [current API example](https://docs.x.ai/developers/grok-4-7) uses
`https://api.x.ai/v1`; replace the obsolete provider API and documentation URLs.
