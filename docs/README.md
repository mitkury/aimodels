# Documentation

Use this page as the repository documentation map. Keep root documents short and
put detailed guidance in the folders below.

## Start here

- [Architecture](./dev/architecture.md): data ownership, inheritance, provider
  mappings, and package parity.
- [Editing catalog data](./dev/how-to-edit-data.md): evidence standards, model
  fields, aliases, capabilities, and validation.
- [Repository rules for AI](./dev/rules-for-ai.md): how an AI agent should
  approach changes in this repository.
- [Creator sources](./dev/data/README.md): official sources used to maintain
  model data.

## Actions for AI agents

These are short, explicit modes of work that a user can invoke by filename or
intent:

- [Commit](./actions-for-agents/commit.md)
- [Less retarded](./actions-for-agents/less-retarded.md)
- [Red/green TDD](./actions-for-agents/red-green-tdd.md)
- [Tidy](./actions-for-agents/tidy.md)

## Working rules

- [How to architect](./rules/how-to-architect.md)
- [How to commit](./rules/how-to-commit.md)
- [How to review](./rules/how-to-review.md)
- [How to write docs](./rules/how-to-write-docs.md)

## Proposals

Documents in `dev/proposals/` describe possible or historical work. They are not
authoritative descriptions of current behavior unless their status explicitly
says otherwise. Current behavior belongs in `README.md`, `docs/dev/`, schemas,
tests, or package documentation.

## Maintenance

- Prefer one authoritative explanation with links over repeated instructions.
- Delete or rewrite stale guidance instead of adding a second contradictory doc.
- Keep volatile provider facts in `dev/data/` with direct official sources.
- Keep generated schemas generated. Edit their Zod sources, then export them.
