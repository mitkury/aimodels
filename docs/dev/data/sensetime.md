# SenseTime

- [Company overview](https://www.sensetime.com/en/about-index)
- [SenseNova U1.6 release](https://www.sensetime.com/cn/news/sensenova-u1-6-open-source-20261124-1152)

## November 27, 2026 audit

The [SenseNova U1.6 model card](https://huggingface.co/sensenova/SenseNova-U1.6-8B-MoT)
publishes the original sharded Apache 2.0 weights. The
[upstream guide](https://github.com/OpenSenseNova/SenseNova-U1/blob/main/docs/u1.6_model.md)
documents text-to-image generation, editing and native self-correction. The
release announcement lists a separate hosted SenseNova U1.6 Lite API on
SenseNova Token Plan. The public sources checked did not establish its exact
request selector.

## November 28, 2026 audit

The [RoboRSI-27B full release](https://huggingface.co/blog/sensenova/roborsi)
and the [Apache 2.0 checkpoint](https://huggingface.co/sensenova/SenseNova-RoboRSI-27B)
document image and text inputs and native reasoning and tool-call parsing.
The [configuration](https://huggingface.co/sensenova/SenseNova-RoboRSI-27B/blob/main/config.json)
sets 262,144 text positions. The November 27 model-card update links the
[official GGUF builds](https://huggingface.co/sensenova/SenseNova-RoboRSI-27B-GGUF)
of the same checkpoint.
