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

## November 17, 2026 audit

[Volcano Ark's release notes](https://console.volcengine.com/ark/region:cn-beijing/docs/model-release-announcement)
list `doubao-seedance-2-5-flash-261115` for video generation, editing, and
extension at 480p and 720p. [BytePlus ModelArk](https://docs.byteplus.com/en/docs/ModelArk/seedance-2-5)
uses `dreamina-seedance-2-5-flash-261115`. [OpenRouter](https://openrouter.ai/bytedance/seedance-2.5-flash)
uses `bytedance/seedance-2.5-flash` on its video API. The snapshot suffix
does not establish the first public API date.

## November 26, 2026 audit

The [Doubao Voice API reference](https://docs.volcengine.com/docs/doubao-voice/seed-tts-3-0-websocket?lang=zh)
documents `doubao-seed-tts-3.0` as the streaming text-to-speech selector.
It belongs to Volcengine's voice API. [OpenRouter](https://openrouter.ai/bytedance-seed/seed-tts-3-0)
lists `bytedance-seed/seed-tts-3-0` as a speech route dated November 25.
The native release date and common model-wide limits are unverified.
