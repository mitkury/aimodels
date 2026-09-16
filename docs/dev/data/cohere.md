# Cohere

Official sources:

- Models overview: https://docs.cohere.com/v2/docs/models
- Models API: https://docs.cohere.com/v2/reference/list-models

## September 9, 2026 audit

[Parse documentation](https://docs.cohere.com/v2/docs/parse) and the
[August 27 changelog](https://docs.cohere.com/changelog/parse) identify
`parse-v5.0`, an 8,192-token document/image-to-Markdown API model.
Document structure is not a general JSON-output or function-calling guarantee.

[North Micro Vision Instruct](https://huggingface.co/CohereLabs/North-Micro-Vision-Instruct)
is a separate Apache-2.0 checkpoint, not a Cohere-native API model. Use its
validated 8K multimodal context, not its language backbone's 128K context.
The checkpoint's publication date is not assigned as a public API release.

## September 16, 2026 audit

The [September 9 release](https://docs.cohere.com/v2/changelog) and
[North Small Translate guide](https://docs.cohere.com/v2/docs/north-small-translate-1.0)
establish `north-small-translate-1-0`, with a 16K context, text translation
across more than 50 languages, and CC BY-NC 4.0 weights. Commercial deployments
require a separate license. This release was missing at the prior audit cutoff.

The model is selectable through the free-tier Chat V2 API. That transport does
not establish general conversational, tool-calling, reasoning, or structured
JSON capabilities, so record only text input/output. No exact maximum output
is documented. Keep the hosted model ID rather than creating duplicate records
for FP8 and W4A16 packaging. It was not listed on OpenRouter.
