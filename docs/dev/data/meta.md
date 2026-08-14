# Meta

Official sources:

- Llama model repository and model cards:
  https://github.com/meta-llama/llama-models
- Llama developer resources: https://developer.meta.com/ai/docs/overview/
- Meta AI Llama announcements: https://ai.meta.com/blog/?page=1&tag=llama
- Meta Model API models: https://dev.meta.ai/docs/models.md
- Muse Spark 1.1 release:
  https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/
- Muse Glimmer documentation: https://dev.meta.ai/docs/muse-glimmer.md
- Muse Glimmer weights and model card:
  https://huggingface.co/meta-models/Muse-Glimmer-30B

Meta's sources establish model identity, lineage, context, and intrinsic
capabilities. Hosted API IDs such as Groq slugs are provider-specific facts:

- Groq model list: https://console.groq.com/docs/models
- Groq deprecations: https://console.groq.com/docs/deprecations

Keep provider slugs in provider mappings. Do not present them as Meta-native
model IDs without evidence from Meta.

Meta Model API exposes `muse-spark-1.1` and `muse-spark-1.2`. The
`muse-spark-1.2-contributor` selector serves the same 1.2 checkpoint under a
different data-use and pricing tier, so it is an alias rather than another
model record. Muse Glimmer is a separate Apache-2.0 open-weight model; preserve
its first-party Hugging Face repository ID as the canonical checkpoint ID.
