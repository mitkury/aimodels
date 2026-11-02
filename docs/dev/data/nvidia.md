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

## November 2, 2026 audit

The [hosted Super VL endpoint](https://build.nvidia.com/nvidia/nemotron-3.5-super-vl-120b-a12b)
establishes the lower-case canonical ID and currently advertises a 262K serving
window. The [full checkpoint](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-BF16)
supports up to 1M architecturally; do not promise that ceiling for the hosted
selector. It has text/image/video input, reasoning and tools under OpenMDW-1.1.

[Bolt 74B A9B 24GB](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB)
and [Dory 1.0 4B](https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16)
are standalone OpenMDW-1.1 checkpoints with 262,144-token windows, reasoning
and tool calling; Bolt also accepts images/video. Keep their exact checkpoint
IDs and exclude them from NVIDIA-native API availability. The Bolt LiLiCorr
repository is only a speculative-decoding companion, not another standalone
chat model. Output ceilings and native API launch dates remain unset.
