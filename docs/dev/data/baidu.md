# Baidu

Official sources:

- Qianfan model list:
  https://intl.cloud.baidu.com/en/doc/qianfan/s/7m95lyy43-intl-en
- ERNIE 5.0 release:
  https://cloud.baidu.com/news/news_eacd5e1a-b6ad-4874-b920-15390d26e656
- ERNIE 5.0 technical overview:
  https://ernie.baidu.com/blog/posts/ernie5.0/
- Qianfan function calling:
  https://intl.cloud.baidu.com/en/doc/qianfan/s/xm95lyys5-intl-en
- Baidu company information: https://home.baidu.com/about/about.html

Use the lower-case Qianfan endpoint ID as the canonical model ID. ERNIE 5.0 is
documented for text generation, visual understanding, and deep thinking. The
current function-calling support page names an older preview rather than the
stable `ernie-5.0` endpoint, so function calling remains unrecorded.

## November 4, 2026 audit

The [Qianfan model list](https://intl.cloud.baidu.com/en/doc/qianfan/s/7m95lyy43-intl-en)
establishes `ernie-5.1` for text generation, with 128K context and an exact
65,536-token output ceiling. It is listed separately from ERNIE 5.0, so it is
a separate record. The vision and thinking tables still identify only 5.0;
do not inherit those capabilities or function calling onto 5.1. Its initial
API release date and a public weight license remain unverified.

## November 9, 2026 audit

The [ERNIE 4.5 21B A3B Thinking card](https://huggingface.co/baidu/ERNIE-4.5-21B-A3B-Thinking)
documents Apache-2.0 weights, 131,072 context tokens, and function calling.
The first-party checkpoint ID is for self-hosting.

## November 12, 2026 audit

[Baidu's announcement](https://ernie.baidu.com/release/ernie-5-5-flash-preview/)
and the [Qianfan catalog](https://cloud.baidu.com/doc/qianfan-docs/s/7m95lyy43)
establish the text-only ERNIE 5.5 Flash Preview and ERNIE Light DT 1.0 API IDs.
The [international catalog](https://intl.cloud.baidu.com/en/doc/qianfan/s/7m95lyy43-intl-en)
also lists the Flash preview. Qianfan lists up to 1M output for Flash Preview,
while the [launch page](https://cloud.baidu.com/product/qianfan_home/model_3.html)
describes 64K as the default. For Light DT, Qianfan rounds its context and
output to 1M and 128K. [OpenRouter](https://openrouter.ai/baidu/ernie-light-dt-1.0-intl)
gives 1,024,000 and 131,072. OpenRouter documents function calling and
structured output for both text models.

The [ERNIE Wizshot ME API](https://cloud.baidu.com/doc/qianfan-api/s/8mwbylac7)
documents `ernie-wizshot-me` with text, image, and audio inputs and a single
1080p video output. Light DT and Wizshot ME are mapped to the China API.
The [Flash Base checkpoint](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base)
has its own published license and a 1,048,576-token inference context.
