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
