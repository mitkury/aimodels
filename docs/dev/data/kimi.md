# Kimi

Kimi models and the Moonshot API are maintained by Moonshot AI.

Official sources:

- Model list: https://platform.kimi.ai/docs/models
- Models API: https://platform.kimi.ai/docs/api/list-models
- Platform release log: https://platform.kimi.ai/blog/tags/platform

Use release posts to establish model names, dates, and capabilities. Use the API
model list to verify deployable IDs rather than deriving them from product names.

To list the models available to an API key:

```bash
curl https://api.moonshot.ai/v1/models \
  -H "Authorization: Bearer $MOONSHOT_API_KEY"
```
