# AIModels

AIModels is a normalized catalog of AI models, creators, and inference providers. One shared data set is shipped through three packages:

- JavaScript/TypeScript: [`aimodels`](https://www.npmjs.com/package/aimodels)
- Python: [`aimodels.dev`](https://pypi.org/project/aimodels.dev/)
- Rust: [`aimodels`](https://crates.io/crates/aimodels)

The catalog is also the source of truth for [aimodels.dev](https://aimodels.dev), [AIWrapper](https://github.com/mitkury/aiwrapper), and [Sila](https://github.com/silaorg/sila).

## Design

Canonical model identity is independent from the provider that serves it:

```text
canonical model: gemini-4-carbon
Gemini API:     gemini-4-carbon
OpenRouter API:  google/gemini-4-carbon
```

Model files describe what a model is. Provider files describe where it is available and translate the canonical ID when an API expects a prefix, dated snapshot, or other provider-specific form.

```ts
import { models } from 'aimodels';

const model = models.id('gemini-4-carbon');
model?.idFor('openrouter'); // google/gemini-4-carbon

models.fromProviderId('openrouter', 'google/gemini-4-carbon'); // canonical Model
```

```python
from aimodels import models

model = models.id("gemini-4-carbon")
model.id_for("openrouter")  # google/gemini-4-carbon

models.from_provider_id("openrouter", "google/gemini-4-carbon")
```

```rust
use aimodels::models;

let model = models().id("gemini-4-carbon").unwrap();
model.id_for("openrouter"); // Some("google/gemini-4-carbon")

models().from_provider_id("openrouter", "google/gemini-4-carbon"); // canonical Model
```

## Repository structure

```text
data/models/       Canonical model records, grouped by creator
data/providers/    Provider metadata, availability, ID mappings, and pricing
data/orgs.json     Shared organization metadata
data/schemas/      Generated JSON Schemas for catalog files
js/                JavaScript/TypeScript package and tests
python/            Python package and tests
rust/              Rust crate and tests
docs/dev/          Maintainer guidance and architecture notes
```

The JSON in `data/` is the only catalog source. Do not duplicate model data in any language implementation.

## Development

Validate catalog data and the JavaScript package:

```bash
cd js
npm ci
npm run validate:data
npm run typecheck
npm run lint
npm run build
```

Validate the Python package from the repository root:

```bash
python3 -m pytest python/tests
python3 -m build python
```

Validate the Rust crate:

```bash
cd rust
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo test
cargo publish --dry-run
```

The Rust crate also has parity tests against the built JavaScript package; see
[`rust/README.md`](rust/README.md#development).

When a public behavior is implemented in one package, add the equivalent API and tests in the other packages unless the difference is intentional and documented.

See the [`documentation map`](docs/README.md) for maintainer guidance. Read
[`how to edit data`](docs/dev/how-to-edit-data.md) before changing catalog
records and [`architecture`](docs/dev/architecture.md) for data flow and
invariants.

## License

MIT
