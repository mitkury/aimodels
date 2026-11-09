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

## November 2, 2026 audit

The [model table](https://docs.cohere.com/v2/docs/models) establishes
`embed-v5.0-pro`/`embed-v5.0-fast`: multimodal embeddings, 128K input, 2,048
default dimensions; and `rerank-v5.0-pro`/`rerank-v5.0-fast`: 32K text input.
The [changelog](https://docs.cohere.com/changelog) dates the API releases
September 30 and October 21. Do not inherit Embed 4's normalization assertion
without explicit evidence. Rerank uses the catalog's existing text-input/output
convention; it is not a chat or JSON-generation model.

## November 9, 2026 audit

Remove the first Command and Command Light, Command Nightly, and the original
Command R and R+ snapshots. Cohere lists the older snapshots as
[deprecated](https://docs.cohere.com/v2/docs/deprecations) and documents Nightly
on the [legacy Generate endpoint](https://docs.cohere.com/v2/reference/generate-v1).
The August 2024 Command R and R+ remain listed as replacements and on OpenRouter.
