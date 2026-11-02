# StepFun

Official sources:

- Step 3.7 Flash release: https://static.stepfun.com/blog/step-3.7-flash/
- Hosted API example:
  https://platform.stepfun.com/docs/zh/api-reference/chat/chat-completion-create
- Open-weight model card: https://huggingface.co/stepfun-ai/Step-3.7-Flash
- Platform agreement and company identity:
  https://platform.stepfun.com/legal/user-agreement.html

The StepFun API ID is canonical. The downloadable checkpoint ID is a deployment
identifier, not an alias accepted by the hosted API. The official model card
establishes the Apache 2.0 license, 256K context, multimodal input, reasoning,
and tool calling.

## September 9, 2026 audit

First-party guides establish four distinct API IDs:

- [Chat](https://platform.stepfun.com/docs/zh/guides/models/stepaudio-2.5-chat):
  audio/text input and text output.
- [Realtime](https://platform.stepfun.com/docs/zh/guides/models/stepaudio-2.5-realtime):
  text/audio input and audio output; no text-output promise inferred.
- [TTS](https://platform.stepfun.com/docs/zh/guides/models/stepaudio-2.5-tts):
  text-to-speech with a 1,000-character input limit, not 1,000 tokens.
- [ASR](https://platform.stepfun.com/docs/zh/guides/models/stepaudio-2.5-asr):
  audio-to-text transcription.

The guides' request examples supply the canonical selectors. No initial
release dates or exact audio/chat context ceilings were established.

## November 2, 2026 audit

The [Step 5 API guide](https://platform.stepfun.ai/docs/en/guides/models/step-5-preview)
establishes `step-5-preview`, text/image/video input, thinking, tools, JSON
mode/schema, 1M context and a 64K hosted output ceiling. Prefer that hosted
limit over the checkpoint card's 1M output claim or the request parameter's
`INF` default. The [checkpoint license](https://huggingface.co/stepfun-ai/Step-5-Preview/blob/main/LICENSE.txt)
is StepFun Model License 1.0, recorded as `stepfun-model-1.0`. OpenRouter has
`stepfun/step-5-preview`. No API launch day is inferred from the October 15
weight release.
