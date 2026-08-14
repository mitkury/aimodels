# NVIDIA

Official sources:

- NIM language-model API list:
  https://docs.api.nvidia.com/nim/reference/llm-apis
- Nemotron 3 Ultra model card:
  https://build.nvidia.com/nvidia/nemotron-3-ultra-550b-a55b/modelcard
- Nemotron 3 Super model card:
  https://build.nvidia.com/nvidia/nemotron-3-super-120b-a12b/modelcard
- Nemotron 3 Nano model card:
  https://build.nvidia.com/nvidia/nemotron-3-nano-30b-a3b/modelcard
- Nemotron 3 Nano Omni model card:
  https://build.nvidia.com/nvidia/nemotron-3-nano-omni-30b-a3b-reasoning/modelcard
- Nemotron 3.5 Lightning checkpoint and model card:
  https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16
- NVIDIA company history:
  https://www.nvidia.com/en-us/about-nvidia/corporate-timeline/

Use the lower-case IDs accepted by NVIDIA's hosted NIM API as canonical IDs.
Downloadable checkpoint names are deployment artifacts and are not aliases
unless the hosted API also accepts them.

Nemotron 3.5 Lightning is published as a 30B-total, 3B-active reasoning model
under OpenMDW-1.1. Use the lower-case hosted ID
`nvidia/nemotron-3.5-lightning-30b-a3b`; map OpenRouter's shorter route rather
than replacing the creator-owned identity with it.

The Nemotron 3 text family documents a 1,048,576-token architectural window but
does not publish a single model-wide maximum output value. Keep `maxOutput`
unknown. Nano Omni documents a 262,144-token context and multimodal input, JSON
output, reasoning, and tool calling.
