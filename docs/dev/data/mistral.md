# Mistral

Official sources:

- Models overview and specifications: https://docs.mistral.ai/models
- OCR 4 model card:
  https://docs.mistral.ai/models/model-cards/ocr-4-0
- API model list: https://docs.mistral.ai/api/endpoint/models
- Release notes: https://docs.mistral.ai/resources/changelogs

To list the models available to an API key:

```bash
curl https://api.mistral.ai/v1/models \
  -H "Authorization: Bearer $MISTRAL_API_KEY"
```

## September 9, 2026 audit

The [OCR 4.1 model card](https://docs.mistral.ai/models/model-cards/ocr-4-1)
and [changelog](https://docs.mistral.ai/resources/changelogs) establish
`mistral-ocr-4-1`, with `mistral-ocr-4` and `mistral-ocr-latest`
aliases. July 16 is the initial release; August 31 general availability must
not replace it. This is a missing older release found during the September
audit. Document annotations support structured JSON, but do not imply chat
or function calls. Exact token limits remain unknown.
