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

## September 16, 2026 follow-up

Compared against the September 9 catalog addition and September 10 provider
cleanup, with an inclusive September 9–16 discovery window. Added two Gemini
3.8 Live models (September 15), GPT-Live 1 and DeepSeek V4.1 Flash (September
10), and the missed North Small Translate release (September 9).

The current official catalogs/release pages for
[Anthropic](https://platform.claude.com/docs/en/release-notes/overview),
[Meta](https://dev.meta.ai/docs/models.md),
[Qwen](https://www.alibabacloud.com/help/en/model-studio/text-generation-model),
[Z.ai](https://docs.z.ai/release-notes/new-released),
[xAI](https://docs.x.ai/developers/release-notes),
[Mistral](https://docs.mistral.ai/resources/changelogs),
[MiniMax](https://platform.minimax.io/docs/release-notes/models),
[Kimi](https://platform.kimi.ai/docs/models),
[Thinking Machines](https://tinker-docs.thinkingmachines.ai/tinker/models/),
[Amazon Nova](https://docs.aws.amazon.com/nova/latest/nova2-userguide/what-is-nova-2.html),
and [Xiaomi](https://mimo.mi.com/docs/zh-CN/quick-start/summary/model)
did not establish further new model IDs released within this window.
Recent first-party Hugging Face listings for Qwen and StepFun showed no new
checkpoints in the window; NVIDIA additions were specialist vision artifacts
or third-party quantizations, not new general-purpose Nemotron models.

The [Baidu model list](https://intl.cloud.baidu.com/en/doc/qianfan/s/7m95lyy43-intl-en)
now documents `ernie-5.1`, resolving the earlier missing-ID concern, but the
release predates this sweep and remains a follow-up catalog omission.
Tencent's release-history page could not be retrieved; its
[current Token Plan overview](https://cloud.tencent.com/document/product/1823/130060)
still lists Hy4 Preview. No new Tencent mappings were inferred from that
limited evidence. This is a scoped release check, not a complete historical
catalog or provider-retirement audit.
