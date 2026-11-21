# Baseten

Official sources:

- Bison 1 and Groundhog 1 release and API examples:
  https://www.baseten.co/resources/changelog/bison-1-and-groundhog-1-available-on-baseten/
- Bison 1 open weights and model card:
  https://huggingface.co/baselabs/bison-1
- Groundhog 1 open weights and model card:
  https://huggingface.co/baselabs/groundhog-1
- Baseten founding and location:
  https://www.baseten.co/blog/ten-reasons-to-join-baseten/

## November 21, 2026 audit

Baseten released Bison 1 and Groundhog 1 on November 20. Both accept text and
images, return typed decisions rather than generated text, and support up to
131,072 input tokens per question. The native System One endpoint accepts
`decision-models/baseten-bison-latest` and
`decision-models/baseten-groundhog-latest`.

The model cards identify the open-weight repositories, Gemma 4 bases, and
combined licensing: Google's base weights are Apache 2.0 and Baseten's
modifications are MIT. Store that as `mit-and-apache-2.0` rather than reducing
the release to either license alone.

OpenRouter exposes the same models through its Decisions API as
`baseten/bison-1` and `baseten/groundhog-1`. Its live model list reports smaller
route-specific context limits than Baseten's model API; keep the creator's
131,072-token intrinsic limit in the model records.
