# Git commits

Review the actual diff before staging. Preserve unrelated dirty work and stage
only files that belong to the requested change.

Use imperative mood with a short scope prefix:

```text
data: add Grok voice models
docs: add catalog maintenance guide
fix(python): preserve variant release dates
tests: cover alias resolution
ci: update package verification
deps: update schema tooling
dev: add local catalog audit command
```

Use these scopes:

- `data` for models, providers, organizations, and catalog source updates
- `docs` for documentation-only changes
- `fix(name)` for behavior or packaging corrections
- `feat(name)` for a new public capability
- `tests` for test-only changes
- `ci` for build, release, or automation work
- `deps` for dependency updates
- `dev` for maintainer tooling

Before committing, run the checks relevant to the files changed. For changes
that affect shared behavior, verify both packages. Push only when the user asks
for it or the active action explicitly includes pushing.
