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

## Keep examples current

When the catalog gains a new generally recommended flagship model, update the
model examples in `README.md`, `js/README.md`, and `python/README.md` in the same
change. Use a stable, callable canonical ID and verify every shown provider ID.

Do not churn the examples for every preview, specialized model, or benchmark
leader. The example should represent the clearest current default, not merely
the newest release date.
