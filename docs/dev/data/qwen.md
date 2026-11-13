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
