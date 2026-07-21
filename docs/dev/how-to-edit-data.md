# How to edit catalog data

Catalog accuracy matters more than completeness. A missing field is better than
a confident-looking guess.

## Workflow

1. Read the relevant creator notes in `docs/dev/data/`.
2. Check the creator's current model documentation, API reference, pricing page,
   release notes, and model-list endpoint when available.
3. Compare official model IDs with the existing creator file.
4. Change the smallest set of model and provider records needed.
5. Add official source links or evidence notes to the creator document.
6. Run catalog validation and both package suites when exposed behavior changes.
7. When adding a new generally recommended flagship model, refresh the root and
   package README examples in the same change.

Search results, announcement summaries, model aggregators, and application UI
labels are discovery aids. They are not enough to establish an API model ID when
direct creator documentation exists.

## Model records

Model files live in `data/models/`, one collection per creator. They describe
what a model is:

- canonical ID and display name
- intrinsic capabilities
- context or output limits
- license
- aliases
- release date

Base models without `extends` must define `name`, `capabilities`, and `context`.
Use the exact callable creator API ID as the canonical ID. Do not substitute an
aggregator namespace or a friendlier marketing name.

Product modes are not automatically models. A fast mode, reasoning toggle,
voice preset, application feature, or product tier belongs in the catalog only
when the API exposes it as a selectable model ID.

## Aliases and release dates

Aliases are alternative IDs accepted by an API or explicitly documented by the
creator. Keep them exact and useful. Do not add speculative shorthand.

Aliases must be globally unambiguous. An alias cannot also be another canonical
model ID or belong to multiple models.

Use `releasedAt` only when an official source establishes a public API release
date. A documentation update date, snapshot suffix, preview build date, and
product announcement date are not interchangeable.

Aliases and release dates identify a specific record and are not inherited by
models using `extends`.

## Inheritance

Use `extends` for snapshots or closely related variants from the same creator.
Choose a base with genuinely shared metadata, then put only changed inheritable
fields in `overrides`.

Good candidates for inheritance are capabilities, context, license, and
languages. Do not use inheritance merely because two names look related.

## Capabilities

Capabilities describe dedicated API behavior:

- `chat`: conversational text input and output
- `reason`: configurable or model-driven inference-time reasoning
- `txt-in`, `txt-out`: text input and output
- `img-in`, `img-out`: image understanding and generation
- `audio-in`, `audio-out`: audio understanding and generation
- `video-in`, `video-out`: video understanding and generation
- `json-out`: an API feature that guarantees structured JSON
- `fn-out`: native function or tool calling
- `vec-out`: embedding vectors

Do not add `json-out` or `fn-out` because prompting can sometimes produce JSON
or tool-like text. There must be a dedicated API mechanism.

## Context

Use the context type that matches the model:

- token or character limits for language models
- audio input or output limits for audio models
- dimensions and normalization metadata for embeddings
- output count and supported sizes for image models

Use `null` when a limit is explicitly unspecified or variable. Do not infer
output limits by subtracting an input limit from a total context window.

## Provider mappings

Provider files in `data/providers/` describe where models are exposed and which
ID each provider accepts.

- Never add `providerIds` to a model record.
- Native providers expose their own creator's models by default unless a mapping
  narrows the set.
- Aggregators use `models` entries to include creator catalogs.
- Use `idPrefix` for systematic namespaces and `idOverrides` for exceptions.

Each provider mapping has this shape:

```json
{
  "creator": "openai",
  "include": "all",
  "exclude": ["gpt-4o-2024-08-06"]
}
```

- `creator` must match a model collection and organization ID.
- `include` is `"all"` or an explicit list of canonical model IDs.
- `exclude` removes canonical IDs when `include` is `"all"`.

Keep the canonical ID in the model file when a provider uses another form:

```json
{
  "creator": "openai",
  "include": "all",
  "idPrefix": "openai/",
  "idOverrides": {
    "gpt-5.5": "openai/gpt-5.5-2026-04-23"
  }
}
```

Consumers translate only at the provider boundary:

```ts
models.id('gpt-5.5')?.idFor('openrouter');
models.resolveModelIdForProvider('gpt-5.5', 'openrouter');
models.fromProviderId('openrouter', 'openai/gpt-5.5');
```

## Validation

From `js/`:

```bash
npm run schemas:export  # only after changing Zod schemas
npm run validate:data
npm run typecheck
npm run lint
npm run build
```

From the repository root:

```bash
python3 -m pytest python/tests
python3 -m build python
```

Review the final diff after generation. Generated schema changes should reflect
only the intended source-schema change.
