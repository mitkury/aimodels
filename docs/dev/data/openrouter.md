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
