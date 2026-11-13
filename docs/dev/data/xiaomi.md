# Xiaomi

Official sources:

- Current MiMo model list:
  https://mimo.mi.com/docs/zh-CN/quick-start/summary/model
- MiMo API quickstart:
  https://mimo.mi.com/docs/en-US/quick-start/summary/first-api-call
- MiMo-V2.5 launch:
  https://mimo.mi.com/docs/en-US/news/latest/v2.5-news
- Multimodal input guides:
  https://mimo.mi.com/docs/en-US/quick-start/usage-guide/multimodal-understanding/image-understanding
  https://mimo.mi.com/docs/en-US/quick-start/usage-guide/multimodal-understanding/audio-understanding
  https://mimo.mi.com/docs/en-US/quick-start/usage-guide/multimodal-understanding/video-understanding

Use the lower-case IDs accepted by Xiaomi's pay-as-you-go API as canonical.
Both current text-generation models have 1M context and 128K maximum output.
Only `mimo-v2.5` accepts image, audio, and video input.

The V2 family was retired on 2026-06-30, so do not add those obsolete API IDs.
The current ASR and TTS models are outside this audit's general-purpose model
scope and can be added separately when their modality-specific metadata is
needed.

## November 2, 2026 audit

The [current model list](https://mimo.mi.com/docs/zh-CN/quick-start/summary/model)
establishes `mimo-v2.6-pro`, `mimo-v2.6-flash`, and the custom-access
`mimo-v2.6-pro-ultraspeed`: multimodal understanding, thinking, structured
output and tools, with 1M context and 128K output. All three have verified
OpenRouter routes. Native MiMo 2.5 and 2.5 Pro shut down October 21; retain their
historical records but exclude them from Xiaomi provider availability.

## November 9, 2026 audit

Xiaomi's [V2.6 release](https://mimo.mi.com/docs/en-US/news/latest/v2-6) ties
the published MIT [Pro](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-RL)
and [Flash](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Flash-RL) weights to the
served models. The older [V2.5 Pro](https://huggingface.co/XiaomiMiMo/MiMo-V2.5-Pro)
and [V2.5](https://huggingface.co/XiaomiMiMo/MiMo-V2.5) also have MIT weights.
Their native API availability ended in October.

[MiMo V2.6 Distill Qwen 9B](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B)
is a separate MIT checkpoint for local deployment, with image input, thinking,
and 262,144 context tokens in its [config](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B/blob/main/config.json).

## November 12, 2026 audit

The [Ollama library](https://ollama.com/library/mimo-v2.6) publishes the
MiMo V2.6 Distill Qwen 9B checkpoint under `mimo-v2.6`.
