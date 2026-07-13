# AIModels

AIModels is a normalized catalog of AI models, creators, and inference providers. One shared data set is shipped through two packages:

- JavaScript/TypeScript: [`aimodels`](https://www.npmjs.com/package/aimodels)
- Python: [`aimodels.dev`](https://pypi.org/project/aimodels.dev/)

The catalog is also the source of truth for [aimodels.dev](https://aimodels.dev), [AIWrapper](https://github.com/mitkury/aiwrapper), and [Sila](https://github.com/silaorg/sila).

## Design

Canonical model identity is independent from the provider that serves it:

```text
canonical model: gpt-5.1
OpenAI API:      gpt-5.1
OpenRouter API:  openai/gpt-5.1
```

Model files describe what a model is. Provider files describe where it is available and translate the canonical ID when an API expects a prefix, dated snapshot, or other provider-specific form.

```ts
import { models } from 'aimodels';

const model = models.id('gpt-5.1');
model?.idFor('openrouter'); // openai/gpt-5.1

models.fromProviderId('openrouter', 'openai/gpt-5.1'); // canonical Model
```

```python
from aimodels import models

model = models.id("gpt-5.1")
model.id_for("openrouter")  # openai/gpt-5.1

models.from_provider_id("openrouter", "openai/gpt-5.1")
```

## Repository structure

```text
data/models/       Canonical model records, grouped by creator
data/providers/    Provider metadata, availability, ID mappings, and pricing
data/orgs.json     Shared organization metadata
data/schemas/      Generated JSON Schemas for catalog files
js/                JavaScript/TypeScript package and tests
python/            Python package and tests
docs/dev/          Maintainer guidance and architecture notes
```

The JSON in `data/` is the only catalog source. Do not duplicate model data in either language implementation.

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
python -m pytest python/tests
python -m build python
```

When a public behavior is implemented in one package, add the equivalent API and tests in the other package unless the difference is intentional and documented.

See [`docs/dev/how-to-edit-data.md`](docs/dev/how-to-edit-data.md) before changing catalog records and [`docs/dev/architecture.md`](docs/dev/architecture.md) for the data flow and invariants.

## License

MIT
