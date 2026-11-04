# Mistral

Official sources:

- Models overview and specifications: https://docs.mistral.ai/models
- OCR 4 model card:
  https://docs.mistral.ai/models/model-cards/ocr-4-0
- API model list: https://docs.mistral.ai/api/endpoint/models
- Release notes: https://docs.mistral.ai/resources/changelogs

To list the models available to an API key:

```bash
curl https://api.mistral.ai/v1/models \
  -H "Authorization: Bearer $MISTRAL_API_KEY"
```

## September 9, 2026 audit

The [OCR 4.1 model card](https://docs.mistral.ai/models/model-cards/ocr-4-1)
and [changelog](https://docs.mistral.ai/resources/changelogs) establish
`mistral-ocr-4-1`, with `mistral-ocr-4` and `mistral-ocr-latest`
aliases. July 16 is the initial release; August 31 general availability must
not replace it. This is a missing older release found during the September
audit. Document annotations support structured JSON, but do not imply chat
or function calls. Exact token limits remain unknown.

## November 2, 2026 audit

The [Large 4 card](https://docs.mistral.ai/models/mistral-large-4-0)
documents `mistral-large-4` and alias `mistral-large-4-0`, an October 6 API
preview, 1M context, vision, reasoning, structured output and tools.
[Published weights](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B)
now establish the Mistral Ecosystem Open-Weight License, recorded as
`mistral-ecosystem`. Output ceiling is unspecified. Timestral forecasting is
deferred because the catalog does not yet model its task and context units.

## November 4, 2026 audit

The [October 20 changelog](https://docs.mistral.ai/resources/changelogs) and
the [Mini Transcribe](https://docs.mistral.ai/models/voxtral-mini-transcribe-3-0),
[Small Transcribe](https://docs.mistral.ai/models/voxtral-small-transcribe-3-0),
[Realtime Transcribe](https://docs.mistral.ai/models/voxtral-mini-transcribe-realtime-3-0),
and [TTS](https://docs.mistral.ai/models/voxtral-mini-tts-3-0) cards establish
four missing Voxtral 3 Public Preview API models. Offline transcription has
32K token context; realtime and TTS ceilings remain unspecified. TTS accepts
reference audio for [voice cloning](https://docs.mistral.ai/studio/audio/text-to-speech/voice-cloning).

Keep the transcription models limited to audio input and text output: the
[current speech guide](https://docs.mistral.ai/studio/audio/speech-to-text/overview)
still directs chat, translation, and function-calling use cases to Voxtral 2
at launch. The TTS overview mentions a separate realtime selector, but the
[connection guide](https://docs.mistral.ai/studio/audio/text-to-speech/speak-in-realtime)
uses `voxtral-mini-tts-3-0` for realtime too; no additional model or response-only
snapshot ID is inferred from that conflict. Aliases whose future reassignment
is discussed in the migration guide are also left unset.

The September 29 changelog explicitly retires `mistral-ocr-4-0` on September
30. Keep its historical record and exclude it from Mistral-native availability.
The same changelog establishes Mistral-hosted GLM 5.3 and GLM 5.3 Flash;
map their Z.ai canonical IDs to `zai-glm-5-3` and `zai-glm-5-3-flash`.
GLM 5.2 is not included: its Mistral endpoint retired on October 31.
