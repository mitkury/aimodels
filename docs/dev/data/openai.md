# OpenAI

Official sources:

- Models overview: https://developers.openai.com/api/docs/models
- Full model catalog: https://developers.openai.com/api/docs/models/all
- API changelog: https://developers.openai.com/api/docs/changelog
- GPT-5.6 Cyber:
  https://developers.openai.com/api/docs/models/gpt-5.6-cyber
- GPT Transcribe:
  https://developers.openai.com/api/docs/models/gpt-transcribe
- GPT Live Transcribe:
  https://developers.openai.com/api/docs/models/gpt-live-transcribe
- GPT-5.3-Codex:
  https://developers.openai.com/api/docs/models/gpt-5.3-codex
- GPT-5.2 Pro:
  https://developers.openai.com/api/docs/models/gpt-5.2-pro
- GPT-Realtime-2.1 mini:
  https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini

To list models with the API:

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

The August 7, 2026 changelog identifies `daybreak-red-latest` as access to
GPT-5.6 Cyber and `daybreak-blue-latest` as access to general models including
GPT-5.6 Sol. Treat those selectors as aliases, not additional models. The July
28 changelog establishes the two new transcription IDs.

## September 9, 2026 audit

- [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra):
  1,050,000-token context and 128,000-token output; text/image input and text
  output. Image generation through a tool is not intrinsic image output.
- [Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst)
  and [Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare):
  separate image models with their own September 8 snapshot aliases.
- [Image generation](https://developers.openai.com/api/docs/guides/image-generation)
  and [request reference](https://developers.openai.com/api/reference/resources/images/methods/generate):
  up to ten images; the stored dimensions are preferred sizes, not an exhaustive
  list of supported custom dimensions.
- [Changelog](https://developers.openai.com/api/docs/changelog):
  Astra released September 3; the two image models released September 8.

## September 16, 2026 audit

The [September 10 changelog](https://developers.openai.com/api/docs/changelog)
and [GPT-Live 1 model page](https://developers.openai.com/api/docs/models/gpt-live-1)
establish `gpt-live-1`, with audio/text input and output, streaming, and
function-calling support through the Live API. No exact context or output
token ceiling is documented, so both remain unknown.

The [Live guide](https://developers.openai.com/api/docs/guides/live) separates
the voice model from its independently configured reasoning/tool backend.
Do not assign the backend's reasoning, vision, structured-output capability,
or token limits to GPT-Live. It was not listed on OpenRouter.

## November 2, 2026 audit

[GPT-6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol),
[GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna),
[GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol), and
[GPT-6.1 Terra](https://developers.openai.com/api/docs/models/gpt-6.1-terra)
share Astra's 1,050,000-token context and 128,000-token output limit, with
text/image input, reasoning, tools, and structured output. The
[changelog](https://developers.openai.com/api/docs/changelog) establishes
September 22, September 29, and October 26 API releases respectively.
GPT-6.1 tool calls require Responses; AIWrapper's OpenAI adapter already uses
that API. Do not create separate canonical models for OpenRouter's pro routes.
Rosalind remains deferred pending verification of its restricted-access API specs.
