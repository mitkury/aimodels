# How to write docs

Keep documentation plain, direct, and lightly formatted. Avoid deep heading
trees, repeated instructions, and prose that merely restates the code.

Use explicit names. Link to the authoritative document instead of copying it.

Put information where it belongs:

- root `README.md`: product purpose, public shape, and basic development
- `docs/README.md`: documentation map
- `docs/dev/`: current maintainer architecture and workflows
- `docs/dev/data/`: creator-specific official sources and evidence notes
- `docs/dev/proposals/`: planned or historical work with an explicit status
- package READMEs: public API usage for that package

Provider facts change quickly. Cite direct official sources and omit uncertain
facts. Do not present proposals, generated schemas, or old release notes as the
current architecture.
