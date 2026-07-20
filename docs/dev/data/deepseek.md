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
