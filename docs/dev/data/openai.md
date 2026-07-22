# OpenAI

Official sources:

- Models overview: https://developers.openai.com/api/docs/models
- Full model catalog: https://developers.openai.com/api/docs/models/all
- GPT-5.3-Codex:
  https://developers.openai.com/api/docs/models/gpt-5.3-codex
- GPT-5.2 Pro:
  https://developers.openai.com/api/docs/models/gpt-5.2-pro
- GPT-Realtime-2.1 mini:
  https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini

To list models with the API:

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```
