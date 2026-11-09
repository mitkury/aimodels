# OpenRouter

## Official sources

- Model-list endpoint: <https://openrouter.ai/api/v1/models>
- API documentation: <https://openrouter.ai/docs/api/reference/list-available-models>

## Provider mapping notes

OpenRouter availability and IDs were reconciled against the model-list endpoint
on 2026-07-31. Keep creator entries explicit: a creator releasing a model does
not imply that OpenRouter exposes it.

Provider IDs often use a creator namespace plus the canonical ID, but not
always. Anthropic snapshot IDs and Google preview IDs can require explicit
`idOverrides`. Realtime, Computer Use, and retired preview models should not be
included unless they appear in OpenRouter's model-list response.

## September 9, 2026 additions

The [live model list](https://openrouter.ai/api/v1/models) confirms Astra,
Fable 5.1, Gemini 3.8 Flash, Muse Spark 1.1–1.3, Qwen Max 0902/Flash/27B,
DeepSeek V4 Flash Vision Experimental, GLM-5.3/Flash, and Hy4 Preview.

Preserve provider spellings such as `anthropic/claude-fable-5.1`,
`qwen/qwen3.8-27b`, `z-ai/glm-5.3`, and `tencent/hy4-preview`.
Replace the obsolete Qwen Max preview mapping with the explicitly listed
`qwen/qwen3.8-max-0902`; do not reinterpret it as the open-weight Max
checkpoint. Mythos 5.1, the new image/transcription endpoints, and Qwen Flash
Next were not added to this provider without listing evidence. This is a
scoped availability update, not a fresh certification of every older mapping.

## September 10, 2026 availability check

Rechecked all 76 configured provider IDs against the live model-list endpoint.
`google/gemma-3n-e4b-it` was absent and was removed from OpenRouter availability.
The remaining 75 IDs were listed. The canonical Gemma record remains in the
catalog; absence from this provider does not establish retirement of the model.

## September 16, 2026 additions

The [live model list](https://openrouter.ai/api/v1/models) includes
`deepseek/deepseek-v4.1-flash`. Map canonical `deepseek-flash` to that
provider-specific ID. The older `deepseek/deepseek-v4-flash-vision-exp`
remains listed, so DeepSeek's native retirement must not automatically remove
its OpenRouter availability.

The two Gemini 3.8 Live IDs, GPT-Live 1, and North Small Translate were absent.
Gemini 3.8 Flash remains listed. New `~...-latest` routes and `:batch`
routes are provider routing/billing variants, not new canonical models.
Other recent listings from creators outside the current catalog were left for
a separate creator-onboarding audit.

## November 2, 2026 audit

Checked the live [model list](https://openrouter.ai/api/v1/models) on
November 2. Added explicit routes for the new GPT, Claude 5.5, Gemini Argon and
Nano Banana, Meta, Omni Flash, MiniMax, Mistral, Super VL, MiMo, Grok, Step,
Kimi, and GLM FlashX records. Route names and creator IDs often differ:
translate with `idFor`/`fromProviderId`, never by concatenating creator and ID.
Free, batch and pro serving routes are not automatically new canonical models.
No listing timestamp is treated as a creator's public API release date.

## November 4, 2026 reconciliation

Compared every configured route with the current
[model-list endpoint](https://openrouter.ai/api/v1/models). Removed the absent
`openai/o4-mini`, `anthropic/claude-opus-4`, and `anthropic/claude-sonnet-4`
routes; their canonical records remain available for historical lookup.

Added the independently listed Hy4 and GLM 5.3 FlashX Legal routes, plus
missing availability for cataloged Nova 2 Lite, Cohere Command/North models,
Mistral Medium 3.5/Small 4/Large 3/Ministral 3, Nemotron 3 Ultra/Super/Nano/Nano
Omni, and Llama Guard 4. Exact overrides preserve provider-specific spellings.
North Mini Code and Nano Omni currently have only `:free` listings; those
routes map to existing canonical models rather than creating duplicate models.
The new Voxtral 3 audio endpoints and Nova Multimodal Embeddings were not listed.

## November 9, 2026 reconciliation

The [model list](https://openrouter.ai/api/v1/models) confirms routes for
Fable 5.2, both stable Gemini Omni Flash models, Muse Ember, LFM3-1.7B,
DeepSeek Flash 1017, Qwen3.6 35B A3B, and Ling 3.1 Flash, 3.0 Flash VL, and
3.0 Tiny. Keep provider spellings in the mappings. OpenRouter still lists
GPT-4o, whose canonical record was removed in the catalog cleanup.
