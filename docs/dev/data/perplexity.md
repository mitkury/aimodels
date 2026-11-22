# Perplexity

The [November 12 release](https://www.perplexity.ai/en-GB/hub/blog/perplexity-decider)
and [Decisions API](https://docs.perplexity.ai/docs/decisions/quickstart)
document `pplx-decider-v1.3` and `pplx-decider-flash-v1.3` for structured
decisions from text and images. The [base](https://huggingface.co/perplexity-ai/pplx-decider-v1.3)
and [Flash](https://huggingface.co/perplexity-ai/pplx-decider-flash-v1.3)
weights are Apache-2.0. OpenRouter lists
[base](https://openrouter.ai/perplexity/pplx-decider-v1.3%3Afree) and
[Flash](https://openrouter.ai/perplexity/pplx-decider-flash-v1.3%3Afree) free routes.
Vercel AI Gateway lists
[base](https://vercel.com/ai-gateway/models/pplx-decider-v1.3) and
[Flash](https://vercel.com/ai-gateway/models/pplx-decider-flash-v1.3)
through its decisions interface.

## November 22, 2026 audit

Perplexity released MIT-licensed contextual embedding checkpoints at
[`perplexity-ai/pplx-embed-v2-context-9b`](https://huggingface.co/perplexity-ai/pplx-embed-v2-context-9b)
and [`perplexity-ai/pplx-embed-v2-context-0.6b`](https://huggingface.co/perplexity-ai/pplx-embed-v2-context-0.6b).
Both accept text and images. The 9B checkpoint returns 2,048 dimensions by
default (with a trained 1,024-dimension prefix); the 0.6B checkpoint returns
1,024 dimensions. The cards state that vectors are unnormalized and use int8
by default. They do not establish a fixed intrinsic token limit, so the catalog
leaves it unknown rather than copying a host-specific limit.

OpenRouter serves the exact IDs
[`perplexity/pplx-embed-v2-context-9b`](https://openrouter.ai/perplexity/pplx-embed-v2-context-9b)
and [`perplexity/pplx-embed-v2-context-0.6b`](https://openrouter.ai/perplexity/pplx-embed-v2-context-0.6b)
through its embeddings endpoint with a 32,000-token hosted limit. Hugging Face's
model cards currently show no deployed Inference Provider, and no native
Perplexity API selector is documented, so neither provider gets an availability
entry.
