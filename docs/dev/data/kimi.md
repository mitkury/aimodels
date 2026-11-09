# Kimi

Kimi models and the Moonshot API are maintained by Moonshot AI.

Official sources:

- Model list: https://platform.kimi.ai/docs/models
- Kimi K3 guide: https://platform.kimi.ai/docs/guide/kimi-k3-quickstart
- Models API: https://platform.kimi.ai/docs/api/list-models
- Platform release log: https://platform.kimi.ai/blog/tags/platform

Use release posts to establish model names, dates, and capabilities. Use the API
model list to verify deployable IDs rather than deriving them from product names.

K3 now has [published weights](https://huggingface.co/moonshotai/Kimi-K3)
under the custom [Kimi K3 License](https://huggingface.co/moonshotai/Kimi-K3/blob/main/LICENSE),
recorded as `kimi-k3`. A later variant does not inherit this license without
its own published license evidence.

To list the models available to an API key:

```bash
curl https://api.moonshot.ai/v1/models \
  -H "Authorization: Bearer $MOONSHOT_API_KEY"
```

## November 2, 2026 audit

The [model list](https://platform.kimi.ai/docs/models) and
[K3.1 Pro quickstart](https://platform.kimi.ai/docs/guide/kimi-k3-1-pro-quickstart)
establish `kimi-k3.1-pro`, native image/video input, always-on thinking, strict
JSON schema and tools. The context and maximum output are both 1,048,576;
131,072 is only the default output budget. Preserve the documented
`kimi-k3.1-pro-highspeed` selector as an alias, matching the existing Kimi
highspeed convention. Weights are promised for November 4, so the license
remains proprietary as of this audit. OpenRouter serves the standard route.

## November 4, 2026 audit

The [Chinese model list](https://platform.kimi.com/docs/models) identifies
K2.5 and the K2 preview/thinking variants as already shut down. The
[platform changelog](https://platform.kimi.com/docs/changelog) confirms the
K2 series shutdown in May 2026 and the worldwide K2.5 shutdown in August,
after which K2.5 requests return HTTP 404. Keep those historical records,
but remove native provider availability.

K2.7 Code and K2.6 have a different status: users registered before November
1 can still use them, with full shutdown expected in late December 2026.
Retain their native mappings while documenting that account restriction here.

K3's released weights establish its custom license. K3.1 Pro weights and a
model-specific license could not be verified, so its explicit proprietary
override prevents it inheriting K3's newly recorded license.

## November 9, 2026 audit

Moonshot published [K3.1 Pro weights](https://huggingface.co/moonshotai/Kimi-K3.1-Pro)
under the [Kimi K3.1 Pro License](https://huggingface.co/moonshotai/Kimi-K3.1-Pro/blob/main/LICENSE).
Record the custom license separately from K3's license. The highspeed
selector remains an alias.
