# Anthropic

Official sources:

- Models overview:
  https://platform.claude.com/docs/en/about-claude/models/overview
- Models API:
  https://platform.claude.com/docs/en/api/models/list
- Claude Opus 5 details:
  https://platform.claude.com/docs/en/about-claude/models/whats-new-opus-5
- Claude Platform release notes:
  https://platform.claude.com/docs/en/release-notes/overview

Anthropic released `claude-opus-5` on July 24, 2026 with a one-million-token
context window and 128,000-token maximum output. Anthropic documents the same
model on Bedrock as `anthropic.claude-opus-5`; keep that provider spelling in
the Bedrock mapping.

## September 9, 2026 audit

[Model overview](https://platform.claude.com/docs/en/about-claude/models/overview)
and [release notes](https://platform.claude.com/docs/en/release-notes/overview)
establish the September 1 release of `claude-fable-5-1` and
`claude-mythos-5-1`, with one-million-token context, 128,000-token output,
vision, thinking, tools, and structured output. Mythos remains restricted to
Project Glasswing participants; catalog presence does not imply unrestricted
access. Only Fable 5.1 was verified on OpenRouter.

## November 2, 2026 audit

The [model overview](https://platform.claude.com/docs/en/models/overview)
lists Opus, Sonnet, and Haiku 5.5 with exact native and Bedrock IDs, 1M context,
128K synchronous output, vision, tools, and thinking. The
[release notes](https://platform.claude.com/docs/en/release-notes/overview)
establish September 22, September 28, and October 7 launches. Preserve the
hyphenated creator IDs; OpenRouter uses dotted 5.5 IDs. Do not treat the
300K batch/beta output limit as the default synchronous limit.

## November 9, 2026 audit

[Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview)
establish Fable 5.2 and Mythos 5.2 with the same modalities and limits as Fable
5.1. Mythos requires organization verification. The
[model overview](https://platform.claude.com/docs/en/models/overview)
documents Fable's Bedrock ID. OpenRouter lists Fable only.

The [deprecation schedule](https://platform.claude.com/docs/en/about-claude/model-deprecations)
confirms that Opus 4 and Sonnet 4 retired on June 15, 2026. Keep their records
for historical lookup and remove Anthropic-native availability.

## November 12, 2026 audit

The [Bedrock Mythos 5.2 card](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-mythos-5-2.html)
documents the base model ID `anthropic.claude-mythos-5-2`. Bedrock exposes it
through regional and global inference profiles for approved organizations.
