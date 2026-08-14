# Qwen

Qwen models are developed by Alibaba and exposed through Alibaba Cloud Model
Studio.

Official sources:

- Model Studio model catalog: https://help.aliyun.com/en/model-studio/models
- Qwen release posts: https://qwenlm.github.io/blog/
- Qwen model repositories: https://github.com/QwenLM
- Qwen3.8 open-weight model card:
  https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B
- Qwen3.8 release: https://qwen.ai/blog?id=qwen3.8
- Model Studio Token Plan model support:
  https://www.alibabacloud.com/help/en/model-studio/token-plan-harness-tool

The Model Studio catalog is region-aware and can include third-party models.
Use its exact Qwen IDs only for Alibaba provider mappings. Use Qwen's release
posts and model cards for creator-owned names, dates, and capabilities.

`Qwen/Qwen3.8-2.4T-A95B` is the canonical open-weight repository ID. Its custom
license is named `qwen3.8-max`, and its native context is 262,144 tokens even
though serving frameworks can extend it. Model Studio separately exposes the
proprietary `qwen3.8-max-preview`; OpenRouter's `qwen/qwen3.8-max` is a provider
mapping for that hosted model, not the open checkpoint.
