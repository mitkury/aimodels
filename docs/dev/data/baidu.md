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
