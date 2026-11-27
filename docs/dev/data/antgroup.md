# Ant Group

- [Model overview](https://developer.ant-ling.com/en/docs/models/ling)
- [API reference](https://developer.ant-ling.com/en/docs/api-reference/chat/openai)
- [Platform changelog](https://developer.ant-ling.com/en/docs/getting-started/changelog)
- [Company registration year](https://data.alibabagroup.com/ir_filings/SEC/BABA/000119312526231755/baba-20260331.htm)

The changelog dates Ling 3.2 Flash to November 5, 2026. Its API supports text,
images, video, reasoning, and tools. No public weights or model license
were verified for this release.

[3.1 Flash](https://huggingface.co/inclusionAI/Ling-3.1-flash) and its
[1019 checkpoint](https://huggingface.co/inclusionAI/Ling-3.1-flash-1019),
[3.0 Flash VL](https://huggingface.co/inclusionAI/Ling-3.0-flash-VL),
and [3.0 Tiny](https://huggingface.co/inclusionAI/Ling-3.0-tiny)
have MIT weights. Keep the native callable selectors. Tiny records 131,072
tokens from its [native configuration](https://huggingface.co/inclusionAI/Ling-3.0-tiny/blob/main/config.json).
Its card describes 256K with YaRN, and OpenRouter advertises that longer limit.

## November 17, 2026 audit

[OpenRouter](https://openrouter.ai/inclusionai/ling-3.2-flash%3Afree)
serves Ling 3.2 Flash as `inclusionai/ling-3.2-flash:free`. Ant's native
model selector remains `Ling-3.2-flash`.

## November 26, 2026 audit

The [Ling 3.2 Air card](https://huggingface.co/inclusionAI/Ling-3.2-air)
publishes MIT weights and documents text, image and video input, reasoning,
and function calling in local deployments. The 262,144-token setting is in the
serving recipe. The native model limit and a hosted selector remain unverified.

## November 27, 2026 audit

The [Air VL card](https://huggingface.co/inclusionAI/LingSante-3.1-air-VL)
and [Flash card](https://huggingface.co/inclusionAI/LingSante-3.1-flash)
publish MIT weights and document reasoning and native tool calling. Air VL's
[native configuration](https://huggingface.co/inclusionAI/LingSante-3.1-air-VL/blob/main/config.json)
sets 131,072 tokens. The card documents a 262,144-token serving configuration
with YaRN. Flash's card documents a 1-million-token window and its
[shipped configuration](https://huggingface.co/inclusionAI/LingSante-3.1-flash/blob/main/config.json)
sets 262,144 positions. Air VL's hosted routes
are [OpenRouter](https://openrouter.ai/inclusionai/lingsante-3.1-air-vl) as
`inclusionai/lingsante-3.1-air-vl` and
[DeepInfra](https://deepinfra.com/inclusionAI/LingSante-3.1-air-VL/api) as
`inclusionAI/LingSante-3.1-air-VL`. Both document structured output. The Flash
card links a Computrix listing, which did not expose a request selector in
the sources checked.

The [Ant Digital DTMaaS model catalog](https://maas.antdigital.com/models)
lists `lingdt-decision-fast-1.0`. [OpenRouter's decision model list](https://openrouter.ai/api/v1/models?output_modalities=decisions)
lists `antdigital/lingdt-decision-fast-1.0:free`, with 32,768 tokens for that
route. Native context remains unset because the
[integration guide](https://maas.antdigital.com/docs/lingdt-decision-api-guide)
did not expose readable request details during the audit.

[LingSante MedGuard's upstream API examples](https://github.com/inclusionAI/LingSante-MedGuard#single-api-call)
establish the same `lingsante-medguard-4b` selector on Ant Digital DTMaaS
and Computrix and document the regional base URLs. The DTMaaS catalog
lists a 64K context. The upstream repository publishes evaluation assets.

The [Ming Image 0.2 Design card](https://huggingface.co/inclusionAI/Ming-Image-0.2-Design)
and [November 25 weight upload](https://huggingface.co/inclusionAI/Ming-Image-0.2-Design/commit/675d9c3c3143ebece150b0b04b08f5edf0af80e4)
establish an MIT-licensed text-to-image model with 1024- and 2048-level
resolution presets.
