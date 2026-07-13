# Rules for AI

## TLDR Context
AIModels is a shared JSON catalog published as the `aimodels` npm package and the
`aimodels.dev` Python package. The JavaScript package runs in browsers, Node.js,
and Deno. Downstream consumers include aimodels.dev, AIWrapper, and Sila.

## Test often
There is no package manager at the repository root.

- For catalog or JavaScript changes, work in `js/` and run `npm run validate:data`,
  `npm run typecheck`, `npm run lint`, and `npm run build`.
- For Python changes, run `python -m pytest python/tests` from the repository root.
- For packaging changes, also build the wheel and source distribution and test a
  clean install.

## Commit messages
Keep messages short and concise. Use the `<scope>: <description>` prefix.

Common scopes:

- `data` for model, provider, organization, and schema data
- `docs` for documentation
- `feat(<name>)` for a dedicated feature
- `fix(<name>)` for a behavior or packaging correction
- `ci` for automation

## Publishing
Publishing is currently manual. Keep the JavaScript and Python versions aligned
for a catalog release.

1. Run the full JavaScript, Python, and package-install checks.
2. Update `js/package.json`, `js/package-lock.json`, and `python/pyproject.toml` to
   the same version, then commit the release preparation.
3. Publish from `js/` to npm and publish the Python distribution to PyPI.
4. Verify clean installs of both exact versions from the public registries.
5. Create and push `v<version>` only after both artifacts are available. The tag
   creates the GitHub release, which then notifies downstream repositories.

Do not use a GitHub release as evidence that npm or PyPI publishing succeeded.

## Update these rules
After changing a configured Airul source or `.airul.json`, run this from the
repository root:

```bash
./js/node_modules/.bin/airul generate --config .airul.json
```
