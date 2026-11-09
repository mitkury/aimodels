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

## November 4, 2026 audit

[Chat Latest](https://developers.openai.com/api/docs/models/chat-latest) exposes
the callable `chat-latest` selector with text/image input, text output, tools,
structured output, 400,000 context tokens, and 128,000 output tokens. It is a
moving ChatGPT selector, not an alias for a documented fixed GPT-6 model. The
October 7 changelog describes a snapshot update, so no initial release date is
inferred from it.

The [deprecation schedule](https://developers.openai.com/api/docs/deprecations)
confirms DALL-E 2/3 shut down May 12, the computer-use preview snapshot July 23,
and both `o4-mini` selectors and `gpt-image-1` October 23. Preserve these records
but exclude them from native OpenAI availability. Deprecated models with future
shutdown dates remain available.

The [changelog](https://developers.openai.com/api/docs/changelog) and
[life-sciences pricing](https://developers.openai.com/api/docs/pricing#life-sciences-models)
confirm `gpt-6-rosalind` released October 30 with restricted research access.
Its dedicated model page is unavailable; modalities, limits, and dedicated API
features remain unverified, so the earlier deferral still applies.

## November 9, 2026 audit

The [API changelog](https://developers.openai.com/api/docs/changelog) dates
[GPT-6-Cyber](https://developers.openai.com/api/docs/models/gpt-6-cyber) to
November 5 and [Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.6-sunburst)
and [Flare](https://developers.openai.com/api/docs/models/gpt-image-2.6-flare)
to November 4. GPT-6-Cyber requires both Daybreak Red and model approval.
The two GPT Image 2.6 IDs share image limits and quality settings. Their model
pages list the undated selectors only.

This cleanup drops GPT-4o and its aliases from the catalog. OpenAI still
lists GPT-4o snapshots for shutdown on January 14, 2027, and OpenRouter still
lists its route. DALL-E 2 and 3 have already shut down.
See the [OpenAI deprecation schedule](https://developers.openai.com/api/docs/deprecations).
