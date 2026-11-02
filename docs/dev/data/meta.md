# Meta

Official sources:

- Llama model repository and model cards:
  https://github.com/meta-llama/llama-models
- Llama developer resources: https://developer.meta.com/ai/docs/overview/
- Meta AI Llama announcements: https://ai.meta.com/blog/?page=1&tag=llama
- Meta Model API models: https://dev.meta.ai/docs/models.md
- Muse Spark 1.1 release:
  https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/
- Muse Glimmer documentation: https://dev.meta.ai/docs/muse-glimmer.md
- Muse Glimmer weights and model card:
  https://huggingface.co/meta-models/Muse-Glimmer-30B

Meta's sources establish model identity, lineage, context, and intrinsic
capabilities. Hosted API IDs such as Groq slugs are provider-specific facts:

- Groq model list: https://console.groq.com/docs/models
- Groq deprecations: https://console.groq.com/docs/deprecations

Keep provider slugs in provider mappings. Do not present them as Meta-native
model IDs without evidence from Meta.

Meta Model API exposes `muse-spark-1.1`, `muse-spark-1.2`, and `muse-spark-1.3`. The
`muse-spark-1.2-contributor` selector serves the same 1.2 checkpoint under a
different data-use and pricing tier, so it is an alias rather than another
model record. Muse Glimmer is a separate Apache-2.0 open-weight model; preserve
its first-party Hugging Face repository ID as the canonical checkpoint ID.

## September 9, 2026 audit

[Model documentation](https://dev.meta.ai/docs/models.md) now lists
`muse-spark-1.3`, `muse-image-1.0`, and `muse-voice-transcribe-1.0`.
Spark 1.3 is proprietary, with 1,048,576-token context; its contributor
selector is an alias. Audio is documented as degraded/not fully supported, so
the 1.3 record does not copy 1.2's audio-input capability.

The [image request schema](https://dev.meta.ai/docs/api-reference/images/schemas.md)
allows up to ten images and reasoning-strength selection. Its size parameter
describes aspect ratios rather than fixed pixel dimensions; leave catalog
sizes empty rather than inventing resolutions. The
[speech-to-text guide](https://dev.meta.ai/docs/speech-to-text.md) uses the same
voice model for file and realtime transcription; no duration ceiling or
initial release date is recorded. Image launch date is also left unset.
Glimmer remains the distinct Apache-2.0 open-weight model, not a Spark variant
or a Meta-native API endpoint.

## November 2, 2026 audit

The [model list](https://dev.meta.ai/docs/models.md) documents
`muse-wonder-1.0`: proprietary API preview, 1,048,576 tokens, text/image/audio/video
input, tools, reasoning, and structured output. Wonder Full is a Muse Code mode,
not a verified separate API model. No exact public API launch day or output
ceiling is recorded.

[Muse Spark Open](https://dev.meta.ai/docs/muse-spark-open) and its
[checkpoint list](https://dev.meta.ai/docs/muse-spark-open/get-the-model)
establish the BF16 canonical ID, multimodal inputs, tools, reasoning, and 1M
context. Its [Muse Model License](https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B/blob/main/LICENSE.md)
is recorded as `muse-model`, not Apache-2.0 or proprietary. The October 15
checkpoint release is not used as a native API release date. OpenRouter serves
both Wonder and Spark Open; Meta's own API mapping includes only Wonder.
