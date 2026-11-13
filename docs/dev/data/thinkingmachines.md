# Thinking Machines Lab

Official sources:

- Inkling release: https://thinkingmachines.ai/news/introducing-inkling/
- Inkling model card: https://thinkingmachines.ai/model-card/inkling/
- Open weights and deployment guide:
  https://huggingface.co/thinkingmachines/Inkling
- Inkling-Small release:
  https://thinkingmachines.ai/news/inkling-small/
- Inkling-Small weights and model card:
  https://huggingface.co/thinkingmachines/Inkling-Small
- Tinker model IDs and context options:
  https://tinker-docs.thinkingmachines.ai/tinker/models/
- Together AI serverless announcement and API example:
  https://www.together.ai/blog/together-ai-brings-thinking-machines-labs-new-model-inkling-on-day-0

Tinker exposes Inkling as `thinkingmachines/Inkling`. Together AI exposes the
same model as `thinkingmachines/inkling`; keep that spelling difference in the
Together provider mapping rather than as a model alias.

The released model has a 1,048,576-token architectural context limit. Tinker
currently offers 64K and 256K sampling configurations, while Together advertises
the full 1M context window.

Inkling-Small is now released with Apache-2.0 weights and is callable on Tinker
as `thinkingmachines/Inkling-Small`. Its architecture supports a one-million-
token context, while current Tinker sampling configurations are smaller.

## November 12, 2026 audit

[Inkling 2 Small](https://thinkingmachines.ai/news/inkling-2-small/) launched
on Tinker on November 5. The November 12 update released the
[Apache 2.0 weights](https://huggingface.co/thinkingmachines/Inkling-2-Small).
The [model card](https://thinkingmachines.ai/model-card/inkling-2-small/)
describes text and image input, text output, and a 1M architectural context.
[Tinker](https://tinker-docs.thinkingmachines.ai/tinker/models/) documents the
base model ID and a separate 256K configuration. [Together](https://docs.together.ai/docs/serverless/models)
lists the same case-sensitive model ID with 1,048,576 context and tool use.
[OpenRouter](https://openrouter.ai/api/v1/models) lists its lower-case route.
