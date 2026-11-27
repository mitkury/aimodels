# Amini

- [Company and founding year](https://www.amini.ai/blog-post/amini-corp-founded-by-former-nvidia-exec-raises-2m-funding)
- [Soma-1X Lite announcement](https://www.amini.ai/blog-post/introducing-soma-1x-lite-a-2b-model-for-document-intelligence)

## November 27, 2026 audit

The [Soma-1X Lite model card](https://huggingface.co/AminiTech/Soma-1X-lite)
documents image and text input for document parsing and Apache 2.0 weights.
The [November 25 weight commit](https://huggingface.co/AminiTech/Soma-1X-lite/commit/69741e66de71cfaa8c64eb72aa1530e6d37ed351)
publishes the checkpoint. The [model configuration](https://huggingface.co/AminiTech/Soma-1X-lite/blob/main/config.json)
sets 262,144 text positions. The model card's vLLM example sets a 32,768-token
serving limit. Amini publishes [GGUF builds](https://huggingface.co/AminiTech/Soma-1X-lite-GGUF)
for local use alongside the standard checkpoint.
