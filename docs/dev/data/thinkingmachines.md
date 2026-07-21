# Thinking Machines Lab

Official sources:

- Inkling release: https://thinkingmachines.ai/news/introducing-inkling/
- Inkling model card: https://thinkingmachines.ai/model-card/inkling/
- Open weights and deployment guide:
  https://huggingface.co/thinkingmachines/Inkling
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

Inkling-Small is a preview, not a released model. Do not add it until callable
inference or released weights establish a real model ID.
