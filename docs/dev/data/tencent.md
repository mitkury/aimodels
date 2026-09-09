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
