# Upstage

Official sources:

- Model comparison:
  https://console.upstage.ai/docs/models/compare/generative-intelligence
- Chat API model values:
  https://console.upstage.ai/api/chat
- Responses API:
  https://console.upstage.ai/api/responses
- Solar Mini 4.5 Preview:
  https://console.upstage.ai/docs/models/solar-mini-4-5-preview
- Solar Pro 4 launch:
  https://www.upstage.ai/news/upstage-ai-unveils-solar-pro-4-scoring-42-on-artificial-analysis-index-to-rank
- Company information: https://www.upstage.ai/about

Use Upstage's current hyphenated API IDs as canonical. The older unhyphenated
spellings, dated snapshots, and Contributor selectors are accepted aliases.
Contributor mode runs the same intrinsic model with different data-use and
pricing terms, so it is not a separate model record.

## November 25, 2026 audit

[Solar Mini 4.5 Preview](https://console.upstage.ai/docs/models/solar-mini-4-5-preview)
launched November 23 as `solar-mini-4-5-preview`, with text input/output,
reasoning, structured output, function calling, 524,288 context tokens, and
131,072 maximum output tokens. Upstage says the preview selector will redirect
to `solar-mini-4-5` when the stable model launches on December 3; do not add the
future stable ID yet. OpenRouter currently serves the preview as
`upstage/solar-mini-4-5`.

The current API reference also verifies the previously missing `solar-pro-4`
identity and its accepted aliases. Upstage's August 20 launch establishes the
public release date. OpenRouter's new `upstage/solar-pro-4-contributor` route
is mapped to the same canonical model because Upstage explicitly says
Contributor mode runs the same model; it changes data handling and price, not
intrinsic capabilities.
