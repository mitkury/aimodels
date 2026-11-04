# MiniMax

Official sources:

- Current text models and callable IDs:
  https://platform.minimax.io/docs/guides/text-generation
- Model overview: https://platform.minimax.io/docs/guides/models-intro
- API overview: https://platform.minimax.io/docs/api-reference/api-overview
- Model release notes:
  https://platform.minimax.io/docs/release-notes/models
- MiniMax H3 video generation:
  https://platform.minimax.io/docs/guides/video-generation
- MiniMax M3 release: https://www.minimax.io/blog/minimax-m3
- Company information: https://www.minimax.io/about

The exact API IDs preserve MiniMax's capitalization. Highspeed variants are
separate selectable API IDs, so they remain catalog records even though MiniMax
documents them as having the same quality as their standard counterparts.

M3 and H3 now have published weights and custom licenses; see the dated audit
below. H3's API produces one 768p or 2K video per task; duration is 4–15
seconds, which the current catalog context schema cannot represent.

## September 9, 2026 audit

The [video-generation guide](https://platform.minimax.io/docs/guides/video-generation)
lists `MiniMax-H3-Max`, post-trained with fal.ai, for text/image-to-video
generation, at 480p or 768p and 5–15 seconds. Preserve the exact capitalization.
The catalog's existing video-output convention stores one result and supported
resolution labels; its schema cannot express the duration range. No initial
API release date was established.

## November 2, 2026 audit

The [text generation guide](https://platform.minimax.io/docs/guides/text-generation)
and [model card](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash) establish
`MiniMax-M3.1-Flash`, 1,000,000 context, text/image/video input, text output,
reasoning and tools. The card declares `minimax-community`; do not inherit an
older MiniMax model's license. The [release notes](https://platform.minimax.io/docs/release-notes)
date the API release October 19. Maximum output remains unknown. OpenRouter's
verified paid route is `minimax/minimax-m3.1-flash`, not a native alias.

## November 4, 2026 audit

The first-party [M3 card](https://huggingface.co/MiniMaxAI/MiniMax-M3) supplies
`minimax-community`, while [H3](https://huggingface.co/MiniMaxAI/MiniMax-H3)
supplies `minimax-h3-community-license-agreement`. Replace their provisional
proprietary labels with those published identifiers. These licenses differ.

[M2.7's license](https://huggingface.co/MiniMaxAI/MiniMax-M2.7/blob/main/LICENSE)
is titled **NON-COMMERCIAL LICENSE** and requires separate written permission
for commercial use; record it as `minimax-m2.7-noncommercial`, not MIT.
[M2.5's own card](https://huggingface.co/MiniMaxAI/MiniMax-M2.5) identifies
`modified-mit`; both M2.5 variants override the M2.7 base license.
