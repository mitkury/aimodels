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
