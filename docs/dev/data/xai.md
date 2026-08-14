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
IDs. The Speech-to-Text REST API similarly does not expose a model selector.

The July 29, 2026 release notes move `grok-voice-latest` to
`grok-voice-think-fast-2.0`; keep the alias only on the new model. The August 12
release notes establish `grok-4.6`, its 500,000-token context, and modalities.

To list the models available to an API key:

```bash
curl https://api.x.ai/v1/models \
  -H "Authorization: Bearer $XAI_API_KEY"
```
