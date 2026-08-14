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

MiniMax says M3 open weights are forthcoming. Until released weights and their
license are public, record the currently callable API model as proprietary.

The same rule applies to MiniMax H3. MiniMax calls H3 an open model, but its
public documentation currently establishes a hosted `MiniMax-H3` API selector,
not downloadable weights under a published license. Record the callable model
as proprietary until those artifacts exist. Its API produces one 768p or 2K
video per task; duration is 4–15 seconds, which the current catalog context
schema cannot represent.
