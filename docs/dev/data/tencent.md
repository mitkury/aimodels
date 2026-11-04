# Tencent

Official sources:

- TokenHub model list:
  https://cloud.tencent.com/document/product/1823/130051
- TokenHub API guide:
  https://cloud.tencent.com/document/product/1823/130078
- TokenHub release history:
  https://cloud.tencent.com/document/product/1823/130675
- Hy Token Plan model descriptions:
  https://cloud.tencent.com/document/product/1823/130060
- Tencent company information: https://www.tencent.com/about.html

Use TokenHub's `model` values as the canonical IDs for Tencent-created models.
The model list establishes the 256K context, 128K maximum output, reasoning,
structured output, and function calling for Hy3 and Hy3 Preview.

TokenHub is also a provider for selected models from other creators. Record
those relationships in `data/providers/tencent-provider.json`; translate an ID
only when Tencent's model list shows a spelling different from the creator's
canonical API ID.

## September 9, 2026 audit

[TokenHub model list](https://cloud.tencent.com/document/product/1823/130051),
[Hy4 guide](https://cloud.tencent.com/document/product/1823/132252),
and [release history](https://cloud.tencent.com/document/product/1823/130675)
establish the `hy4-preview` selector, 1,024K context, 64K output, and
August 28 API release. The
[first-party checkpoint](https://huggingface.co/tencent/Hy4-preview)
documents Apache-2.0 weights and thinking controls.

TokenHub also lists GLM-5.3, GLM-5.3 Flash, and DeepSeek's vision experiment.
The [API guide](https://cloud.tencent.com/document/product/1823/130078)
uses `deepseek/deepseek-v4-flash-vision-exp` for the latter; retain the
namespace in a provider override, not in the canonical DeepSeek ID.

## November 4, 2026 audit

The [release history](https://cloud.tencent.com/document/product/1823/130675)
dates the `hy4` API release to November 4. The
[Hy4 guide](https://cloud.tencent.com/document/product/1823/132252)
establishes 1024K context, 64K output, thinking, tools, structured output and
image input. Image understanding is new to the stable model; keep the
preview's text-only capabilities. No public Hy4 weight license was verified.

[Hy3's card](https://huggingface.co/tencent/Hy3) declares Apache-2.0, while
[Hy3 Preview](https://huggingface.co/tencent/Hy3-preview) uses the Tencent Hy
Community License Agreement (`tencent-hy-community`); keep a preview override.

The [current model list](https://cloud.tencent.com/document/product/1823/130051)
also verifies K3.1 Pro, M3.1 Flash, GLM-5.3-FlashX, and the factory-hosted
`deepseek/deepseek-flash` route. The historical V4 Flash route is explicitly
`deepseek/deepseek-v4-flash`; map it with an override rather than emitting an
unlisted bare ID. V4 Pro still has a documented bare selector.
MiniMax selectors use lower-case IDs here.
Restrict Kimi and MiniMax mappings to their currently listed records. Retain
M2.7 until its November 17 retirement, but remove GLM-5V-Turbo, explicitly
shut down October 30. Provider-specific output limits remain in these source
notes; the schema cannot encode them as intrinsic model limits.
