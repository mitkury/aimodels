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
