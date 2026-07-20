# Mistral

Official sources:

- Models overview and specifications: https://docs.mistral.ai/models
- API model list: https://docs.mistral.ai/api/endpoint/models
- Release notes: https://docs.mistral.ai/resources/changelogs

To list the models available to an API key:

```bash
curl https://api.mistral.ai/v1/models \
  -H "Authorization: Bearer $MISTRAL_API_KEY"
```
