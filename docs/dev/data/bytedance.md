# ByteDance Seed

- [Seed-OSS-36B-Instruct model card](https://huggingface.co/ByteDance-Seed/Seed-OSS-36B-Instruct)
- [Seed-OSS deployment examples](https://github.com/ByteDance-Seed/seed-oss)
- [Company information](https://www.bytedance.com/about?locale=en)

Seed-OSS-36B Instruct is a self-hosted Apache-2.0 checkpoint with a
524,288-token context, a configurable thinking budget, and function calling.
Its weights do not establish that hosted Seed 2 models are open-weight.

## November 12, 2026 audit

[Seedream 5.5](https://seed.bytedance.com/en/blog/more-realistic-images-more-stable-editing-across-100-rounds-introducing-seedream-5-5)
was announced on November 9. The [Volcano Ark guide](https://console.volcengine.com/ark/region:cn-beijing/docs/seedream-5-5)
documents the callable `doubao-seedream-5-5-261028`, three resolution presets,
and layer decomposition returning up to 100 images including the base image.
Standard generation and editing return one image. The first public API day
is unverified. [BytePlus ModelArk](https://docs.byteplus.com/en/docs/ModelArk/seedream-5-5)
uses `dola-seedream-5-5-261028` on its own endpoint. OpenRouter lists
`bytedance-seed/seedream-5-5`.
