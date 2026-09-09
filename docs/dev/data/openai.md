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
