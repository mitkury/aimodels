# Creator sources

These pages record the first-party sources used to maintain creator-owned model
metadata. Read the page that matches the model file being changed:

- [Anthropic](./anthropic.md)
- [Amazon Web Services](./aws.md)
- [Baidu](./baidu.md)
- [Cohere](./cohere.md)
- [DeepSeek](./deepseek.md)
- [Google](./google.md)
- [Kimi](./kimi.md)
- [Meta](./meta.md)
- [MiniMax](./minimax.md)
- [Mistral](./mistral.md)
- [NVIDIA](./nvidia.md)
- [OpenAI](./openai.md)
- [Qwen](./qwen.md)
- [StepFun](./stepfun.md)
- [Thinking Machines Lab](./thinkingmachines.md)
- [Tencent](./tencent.md)
- [Xiaomi](./xiaomi.md)
- [xAI](./xai.md)
- [Z.ai](./zai.md)

Creator documentation establishes model identity and intrinsic capabilities. It
does not establish availability or an ID on a third-party provider. Verify those
facts against the provider's own documentation and store them in
`data/providers/`.

Prefer a direct model page, model card, release announcement, or API model-list
endpoint over search results and third-party indexes. Record conflicts or
uncertainty rather than guessing.

## Broad audit notes

The catalog was reviewed across the major first-party model platforms on
2026-07-21. ByteDance Seed 2.0 was not added: the official launch material says
the family is available through Volcano Engine, but it does not establish a
stable, direct API model ID independent of a customer deployment endpoint. Add
it once first-party API documentation provides that identifier and its limits.


On 2026-09-09, the follow-up audit focused on releases since August 13 and
missing generally useful models from known creators. It added 31 records
across 13 creators, including a few older omissions. Creator pages above record
the exact sources, access restrictions, and intentionally unknown fields.
OpenRouter and Tencent mappings were checked independently of creator claims.

Kimi K2.7 Code Highspeed was already an alias of the Code model and was not
duplicated. Meta Spark remains proprietary; the already-cataloged Glimmer is
open-weight. Qwen and Cohere checkpoint IDs are excluded from native API
availability unless the provider actually serves those identifiers.

Research-focused GUI, driving, math, and retrieval checkpoints were deferred
for a dedicated audit of their task-specific metadata and serving support.
This update does not claim complete coverage of every experimental checkpoint
or every older provider listing. Unknown dates/limits remain unset rather than
being inferred from repository timestamps, rounded labels, or nearby models.
