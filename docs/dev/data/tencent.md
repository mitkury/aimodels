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
