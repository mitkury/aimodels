# Z.ai

Official sources:

- GLM-5.2 guide: https://docs.z.ai/guides/llm/glm-5.2
- GLM-5.1 guide: https://docs.z.ai/guides/llm/glm-5.1
- GLM-5V-Turbo guide: https://docs.z.ai/guides/vlm/glm-5v-turbo
- Release notes: https://docs.z.ai/release-notes/new-released
- Chat Completions API:
  https://docs.z.ai/api-reference/llm/chat-completion
- GLM-5.2 weights and license: https://huggingface.co/zai-org/GLM-5.2
- GLM-5.1 weights and license: https://huggingface.co/zai-org/GLM-5.1
- Company history: https://www.zhipuai.cn/en/about

The callable Z.ai API IDs are canonical. The Hugging Face organization uses
checkpoint IDs such as `zai-org/GLM-5.2`; those are deployment identifiers, not
aliases for the hosted API.

GLM-5.2 and GLM-5.1 weights are MIT licensed. GLM-5V-Turbo is recorded as
proprietary until Z.ai publishes an equivalent weight license for that model.

## September 9, 2026 audit

[GLM-5.3](https://docs.z.ai/guides/llm/glm-5.3) and
[GLM-5.3 Flash](https://docs.z.ai/guides/llm/glm-5.3-flash) document
one-million-token context, 128,000-token output, thinking, tools, and structured
output. Flash additionally accepts images and video; do not assign those
capabilities to the text-only flagship.
[Release notes](https://docs.z.ai/release-notes/new-released) establish
August 18 and August 26 respectively.

The [5.3 model card](https://huggingface.co/zai-org/GLM-5.3) uses the custom
`glm-5.3` license, while [Flash](https://huggingface.co/zai-org/GLM-5.3-Flash)
uses MIT. These must not inherit the same license.
