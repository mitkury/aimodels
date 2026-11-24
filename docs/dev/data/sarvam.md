# Sarvam AI

Sarvam AI develops language and speech models with a focus on Indian languages
and serves open-weight models through its Token Factory API.

Official sources:

- Model and API documentation: https://docs.sarvam.ai/api/token-factory/models/sarvam-105b
- API changelog: https://docs.sarvam.ai/changelog/2026/11/22
- Sarvam-105B-1711 release: https://www.sarvam.ai/blogs/sarvam-105b-1711
- NVFP4 model card: https://huggingface.co/sarvamai/sarvam-105b-1711
- BF16 model card: https://huggingface.co/sarvamai/sarvam-105b-1711-bf16

## November 24, 2026 audit

Sarvam's November 22 release publishes the Apache-2.0
`sarvamai/sarvam-105b-1711` checkpoint in NVFP4 and BF16. The catalog uses the
NVFP4 repository as the canonical release record and documents BF16 as a
precision variant rather than a separate model. The official model card
establishes chat, thinking, tool calling, and a 131,072-token serving context;
it currently shows no Hugging Face Inference Provider deployment.

The [API changelog](https://docs.sarvam.ai/changelog/2026/11/22) confirms that
existing selectors `sarvam-105b` and `sarvam-105b-conversations` now run on the
1711 weights without changing IDs or endpoints. The flagship selector has a
128K context and reasoning on by default; the conversational selector has a
32K context and reasoning always off. Both support agentic tool use. Output
limits vary by Sarvam plan, so the model records do not present a single fixed
maximum. The two API selectors are native Sarvam provider routes; the Hugging
Face repository ID is not.
