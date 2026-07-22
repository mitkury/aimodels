# Kimi

Kimi models and the Moonshot API are maintained by Moonshot AI.

Official sources:

- Model list: https://platform.kimi.ai/docs/models
- Kimi K3 guide: https://platform.kimi.ai/docs/guide/kimi-k3-quickstart
- Models API: https://platform.kimi.ai/docs/api/list-models
- Platform release log: https://platform.kimi.ai/blog/tags/platform

Use release posts to establish model names, dates, and capabilities. Use the API
model list to verify deployable IDs rather than deriving them from product names.

Kimi describes K3 as open source, but its guide says the weights will be
released by 2026-07-27. Until the checkpoint and license are actually public,
record the live API model as proprietary and revisit the license after release.

To list the models available to an API key:

```bash
curl https://api.moonshot.ai/v1/models \
  -H "Authorization: Bearer $MOONSHOT_API_KEY"
```
