# Repository rules for AI agents

AIModels is one JSON catalog published through the `aimodels` JavaScript package,
the `aimodels.dev` Python package, and the `aimodels` Rust crate. Treat `data/` as the source of truth.

## Before changing anything

1. Read `AGENTS.md` and the relevant links from `docs/README.md`.
2. Inspect the working tree and preserve unrelated changes.
3. For catalog edits, read `docs/dev/how-to-edit-data.md` and the relevant
   creator file under `docs/dev/data/`.
4. Verify current provider facts against direct official sources.

Do not guess model IDs, aliases, limits, release dates, pricing, or capabilities.
Omit an uncertain field and record the missing evidence instead.

## While changing code or data

- Keep intrinsic model metadata in `data/models/`.
- Keep availability, pricing, and provider-specific IDs in `data/providers/`.
- Edit Zod schema sources, then regenerate JSON Schemas.
- Preserve JavaScript, Python, and Rust parity for shared behavior.
- Prefer validation that rejects bad source data over consumer-side repair logic.
- Do not publish packages, tag releases, or modify downstream repositories unless
  the user explicitly asks.

Use the explicit actions in `docs/actions-for-agents/` when the user invokes
them. Use the working rules in `docs/rules/` for commits, reviews, architecture,
and documentation.

## Verification

There is no package manager at the repository root.

For catalog or JavaScript changes:

```bash
cd js
npm run validate:data
npm run typecheck
npm run lint
npm run build
```

For Python behavior:

```bash
python3 -m pytest python/tests
python3 -m build python
```

For Rust behavior:

```bash
cd rust
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo test
cargo publish --dry-run
```

For shared behavior, run every suite, including the Rust parity tests against
the built JavaScript package (see `rust/README.md`), and compare the exposed catalog when
practical. For packaging changes, also test clean installs from the built
artifacts.

## Releases

Publishing is manual. Keep `js/package.json`, `js/package-lock.json`, and
`python/pyproject.toml` on the same version.

The Rust crate in `rust/Cargo.toml` has its own semver, because Cargo treats
every 0.x minor bump as breaking. Release a crate patch (`0.1.0` -> `0.1.1`)
for a data-only refresh, so dependents pick it up with `cargo update`. Bump the
minor (`0.1.x` -> `0.2.0`) when the crate's public API changes incompatibly.
Publish the crate with every release whose catalog data changed.

A release is complete only after every exact package version can be installed
from their public registries. Create and push `v<version>` only after that
verification. A GitHub release is not evidence that npm, PyPI, or crates.io
publishing succeeded.
