# Qwen

Qwen models are developed by Alibaba and exposed through Alibaba Cloud Model
Studio.

Official sources:

- Model Studio model catalog: https://help.aliyun.com/en/model-studio/models
- Qwen release posts: https://qwenlm.github.io/blog/
- Qwen model repositories: https://github.com/QwenLM
- Qwen3.8 open-weight model card:
  https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B
- Qwen3.8 release: https://qwen.ai/blog?id=qwen3.8
- Model Studio Token Plan model support:
  https://www.alibabacloud.com/help/en/model-studio/token-plan-harness-tool

The Model Studio catalog is region-aware and can include third-party models.
Use its exact Qwen IDs only for Alibaba provider mappings. Use Qwen's release
posts and model cards for creator-owned names, dates, and capabilities.

`Qwen/Qwen3.8-2.4T-A95B` is the canonical open-weight repository ID. Its custom
license is named `qwen3.8-max`, and its native context is 262,144 tokens even
though serving frameworks can extend it. Model Studio separately exposes the
proprietary `qwen3.8-max-preview`. Hosted selectors and downloadable checkpoints
remain separate records; consult the dated audit below for current mappings.

## September 9, 2026 audit

[Model Studio text models](https://www.alibabacloud.com/help/en/model-studio/text-generation-model)
and the [Max](https://www.qwencloud.com/models/qwen3.8-max) and
[Flash](https://www.qwencloud.com/models/qwen3.8-flash) pages establish hosted
`qwen3.8-max`, `qwen3.8-max-0902`, and `qwen3.8-flash`, with
one-million-token context, visual input, thinking, tools, and structured
output. Rounded output-limit labels are not converted into guessed exact
token counts. The dated selector is retained separately because equivalence
with the rolling selector is not explicitly established.

First-party model cards for [27B](https://huggingface.co/Qwen/Qwen3.8-27B)
and [Flash Next](https://huggingface.co/Qwen/Qwen3.8-Flash-Next) establish
262,144-token native context and text/image/video understanding. Their
licenses differ: Apache-2.0 and Qwen Community 1.0 respectively. Do not copy
the hosted Flash context, license, or dedicated tool/JSON guarantees onto
downloadable checkpoints. All three checkpoint repository IDs are explicitly
excluded from the Qwen-native provider. Unverified API release dates are
omitted; a repository timestamp or ID suffix is not release evidence.

## November 2, 2026 audit

[Qwen3.8 Omni Flash](https://www.alibabacloud.com/help/en/model-studio/qwen3-8-omni-flash)
documents text/image/audio/video input, text output, thinking, tools, a 1M
window and 131,072 output tokens. It is not a speech-output model.
[Qwen Audio 3.1 Realtime Plus](https://www.alibabacloud.com/help/en/model-studio/qwen-audio-3-1-realtime-plus)
supports text/audio input and output and function calling, with 262,144 context
and 16,384 output tokens. Page update dates are not API launch dates. Only
Omni Flash has a verified OpenRouter route in this update; image 2.1 and other
realtime variants remain deferred until their exact IDs and limits are verified.

## November 9, 2026 audit

The [Qwen3.6 35B A3B model card](https://huggingface.co/Qwen/Qwen3.6-35B-A3B)
documents Apache-2.0 weights, image and video understanding, reasoning,
tool calling, and 262,144 native context tokens. The model can be served
with a longer configured context. Use the native limit and the separately
verified OpenRouter route.

## November 12, 2026 audit

Alibaba's [Qwen4-Max-Preview guide](https://help.aliyun.com/en/model-studio/qwen4-max-preview)
lists the November 11 launch, 1M context, and 393,216 output tokens shared by
thinking and the final answer. It documents image and video input, tools,
and JSON Schema output. Access requires the Beijing
[Token Plan endpoint](https://help.aliyun.com/en/model-studio/base-url) and
its dedicated key. The preview runs through November 25 China time.

## November 17, 2026 audit

Alibaba's [launch announcement](https://www.alibabacloud.com/en/press-room/alibaba-unveils-qwen4-max?_p_lc=1)
dates the production release to November 16. The
[Model Studio guide](https://help.aliyun.com/zh/model-studio/qwen4-max)
documents the Beijing selector `qwen4-max`, text, image, and video input,
thinking, tool calls, structured output, and a 1,000,000-token context.
Maximum output is 262,144 tokens in thinking mode and 131,072 without
thinking. The earlier preview keeps its separate Token Plan route.
[OpenRouter](https://openrouter.ai/qwen/qwen4-max) and
[Vercel AI Gateway](https://vercel.com/ai-gateway/models/providers/alibaba)
list different namespaces for the production model.

[Together AI](https://www.together.ai/models/qwen4-max) also lists the
production model on its serverless API as `Qwen/Qwen4-Max`.

## November 23, 2026 audit

Qwen's official
[CustomVoice model card](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice)
identifies the Apache-2.0 checkpoint
`Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice`. It accepts text and generates speech
with nine preset voices, instruction-controlled delivery, streaming, and ten
supported languages. The card does not establish a fixed output-duration
limit, so the catalog leaves the audio limit unknown.

[Together AI's November 20 launch](https://www.together.ai/blog/qwen3-tts)
serves that nine-voice CustomVoice model through its speech API as
`Qwen/Qwen3-TTS-12Hz-1.7B`. Its dedicated
[model page](https://www.together.ai/models/qwen3-tts-12hz-1-7b) confirms the
same selector and serverless availability. OpenRouter documents the same nine
voices under `qwen/qwen3-tts-1.7b`. These serving IDs are mapped to the exact
creator checkpoint rather than registered as separate intrinsic models. The
checkpoint is not a Model Studio selector and remains excluded from Qwen-native
availability.

## November 24, 2026 audit

Alibaba Cloud's [release log](https://www.alibabacloud.com/help/en/model-studio/newly-released-models)
dates `qwen-audio-3.1-live` and `qwen-audio-3.1-captioner` to November 23. The
[Live model page](https://help.aliyun.com/en/model-studio/qwen-audio-3-1-live)
documents full-duplex text/audio input and output plus function calling in the
Beijing and Singapore regions. Its 65,536-token limit applies only to system
instructions and function configuration text, so it is not recorded as the
model's total context window.

The [audio-tagging guide](https://help.aliyun.com/en/model-studio/audio-tagging)
and [HTTP API](https://help.aliyun.com/en/model-studio/qwen-audio-asr-captioner-http-api)
document the Beijing-only Captioner selector. It accepts one audio or video
file up to five minutes and returns time-aligned speech, sound, background, and
scene annotations. File duration is documented here rather than converted to
an unspecified catalog audio-context unit. Both hosted selectors are included
by the Qwen-native provider rule.

## November 25, 2026 Qwen4 Max Preview retirement

Alibaba's [Token Plan updates](https://www.alibabacloud.com/help/en/model-studio/token-plan-product-updates)
state that `qwen4-max-preview` retired at 10:00 UTC+8 on November 25. The old
selector remains callable but now automatically routes to `qwen4-max`, with
production pricing and usage accounting. Keep the preview's historical model
record, but map current Token Plan availability to `qwen4-max` rather than
claiming that the preview model is still served.
