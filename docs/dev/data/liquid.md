# Liquid AI

- [LFM3 release](https://www.liquid.ai/blog/lfm3)
- [API model list](https://docs.liquid.ai/api/models)
- [Text generation API](https://docs.liquid.ai/api/guides/text-generation)
- [LFM3-1.7B weights and license](https://huggingface.co/LiquidAI/LFM3-1.7B)

LFM3-1.7B is the October 27, 2026 text release, with tools and structured
output. The Liquid API documents 128,000 context tokens. Self-hosted
weights support 262,144 tokens and use the LFM Open License v1.0.

## November 17, 2026 audit

[Liquid's November 16 release](https://www.liquid.ai/blog/d1-2) documents
`d1.2` and `d1.2-ultra` with text, image, and audio input and structured
decision responses. Call them on `/decisions/v1/systemone`. They use no
output tokens. The OpenAI-compatible Liquid endpoint remains mapped to
its text model. OpenRouter lists [d1.2](https://openrouter.ai/liquid/d1.2)
and [d1.2-ultra](https://openrouter.ai/liquid/d1.2-ultra) on its decisions
and extractions interfaces and advertises a 65,536-token context there.
