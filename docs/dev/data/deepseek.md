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

## November 4, 2026 audit

The [API reference](https://api-docs.deepseek.com/api/create-chat-completion/)
now lists only `deepseek-flash` and `deepseek-v4-pro`. The
[April 24 retirement notice](https://api-docs.deepseek.com/updates/)
scheduled `deepseek-chat` and `deepseek-reasoner` for removal on July 24;
remove those historical V3.2 selectors from native availability as well.
The October 17 Flash update keeps `deepseek-flash` as its callable selector;
do not introduce a native `deepseek-v4.1-flash-1017` record from another
provider's revision route.

The published [V4 Pro](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro)
and [V4 Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash) cards both
declare MIT. Update Pro's license and let Flash inherit it; this does not
establish an open-weight license for the separate vision experiment.

## November 9, 2026 audit

The [October 17 update](https://api-docs.deepseek.com/updates/#deepseek-v41-flash-1017-update)
confirms that `deepseek-flash` now serves the 1017 revision. Keep that stable
native selector. Record the separate [MIT checkpoint](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash-1017)
so OpenRouter and Mistral can resolve their explicitly versioned routes without
overwriting the older OpenRouter Flash route. The providers document their own
output ceilings.

## November 28, 2026 audit

[DeepSeek's August 13 update](https://api-docs.deepseek.com/updates/#deepseek-v4-pro-update)
retains the native `deepseek-v4-pro` selector. The separate
[MIT checkpoint](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813)
represents that August revision. Its [configuration](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813/blob/main/config.json)
sets a 1,048,576-token context. [Model Studio's API reference](https://www.alibabacloud.com/help/en/model-studio/deepseek-api)
documents the 393,216-token combined thinking and output ceiling for the
revision and its `deepseek-v4-pro-0813` selector. Model Studio uses
workspace-specific endpoints. [LLM Gateway](https://llmgateway.io/models/deepseek-v4-pro-0813)
also lists the revision under that selector as of November 27.

[OpenRouter's model list](https://openrouter.ai/api/v1/models) lists both
`deepseek/deepseek-v4-pro` and `deepseek/deepseek-v4-pro-0813`. [Together's changelog](https://docs.together.ai/docs/changelog)
lists `deepseek-ai/DeepSeek-V4-Pro-0813` as the serverless replacement for its
original Pro route. The [current Together catalog](https://docs.together.ai/docs/serverless/models)
also lists `deepseek-ai/DeepSeek-V4.1-Flash-1017` and its `-fast` serving
tier. Together confirms the two use the same weights and different selectors.
