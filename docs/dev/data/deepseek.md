# DeepSeek

Official sources:

- Models and pricing: https://api-docs.deepseek.com/quick_start/pricing/
- Models API: https://api-docs.deepseek.com/api/list-models/
- Change log: https://api-docs.deepseek.com/updates/

The model-list endpoint is the authority for IDs currently accepted by the
DeepSeek API. Release notes and model pages establish lineage and intrinsic
metadata.

To list the models available to an API key:

```bash
curl https://api.deepseek.com/models \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY"
```

## September 9, 2026 audit

The [August 21 update](https://api-docs.deepseek.com/updates/) introduces
`deepseek-v4-flash-vision-exp`. The
[model table](https://api-docs.deepseek.com/quick_start/pricing/) documents
image input, one-million-token context, 384,000-token output, thinking,
function calls, and JSON output. Do not infer an open-weight license from
other DeepSeek V4 checkpoints; this experimental API record is proprietary.
OpenRouter and Tencent availability are separately verified in provider
sources.

## September 16, 2026 audit

The [September 10 release](https://api-docs.deepseek.com/updates/) and
[current model table](https://api-docs.deepseek.com/quick_start/pricing/)
identify `deepseek-flash` as the exact native API selector for DeepSeek V4.1
Flash, with vision, thinking, JSON output, and function calling.
The [first-party checkpoint](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash)
publishes MIT weights; its
[configuration](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/config.json)
sets `max_position_embeddings` to 1,048,576. The
[Chat Completions reference](https://api-docs.deepseek.com/api/create-chat-completion)
explicitly expands the 384K output ceiling to 393,216 tokens; use that exact
value rather than copying older catalog records' decimal interpretation.

DeepSeek has retired V4 Flash and V4 Flash Vision Exp on its own API. Their
legacy IDs temporarily route to V4.1 Flash, not the historical checkpoints.
Keep the historical canonical records and independently listed third-party
availability, but exclude them from DeepSeek-native availability. Do not turn
historical canonical IDs into colliding global aliases or silently change
their identity. The catalog does not currently express provider-local redirect
aliases. Use `deepseek-flash` for new DeepSeek requests.

OpenRouter separately lists `deepseek/deepseek-v4.1-flash`; map it explicitly.
Its advertised output ceiling is 384,000, unlike the native API's 393,216.
The schema has no provider-specific context override, so the intrinsic record
retains the native limit and consumers must account for the provider's limit.
