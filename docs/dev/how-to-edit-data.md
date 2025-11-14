# How to edit data

When adding or updating models, follow the following guides.

## Model Versioning

In short:
1. Always verify model IDs against official provider documentation
2. Keep aliases short and commonly used
3. Only override properties that actually differ from the base model
4. Include all required properties for base models (those without `extends`)

**Use Model Extension**
  - Find the latest version of a model and extend from it using the `extends` property
  - Only override properties that differ from the base model
  - This reduces duplication and makes maintenance easier

**Model IDs and Aliases**
  - Use the exact model ID as provided by the creator (e.g., `gpt-5.1`)
  - If the creator is also a provider, the ID of the model must work in the API for inference. E.g Anthropic allows `claude-3-7-sonnet-20250219` but not `claude-3-7-sonnet` when using its API.
  - Add the latest stable snapshot/version as an alias to the base model (e.g., `gpt-5.1-2025-11-01` and `gpt-5.1-latest` for `gpt-5.1` in late 2025)
  - Place aliases in the `aliases` array

## Provider Model Mappings

Provider JSON files in `data/providers/` describe *how* models are exposed by each provider.

- Keep canonical model definitions in `data/models/*.json` (one file per creator).
- Do **not** encode where a model is served in the model JSON itself (avoid `providerIds`).
- Use provider files to describe which creators' models each provider exposes.
- Aggregator providers (like `openrouter`) should use the optional `models` array to reference creators instead of duplicating model data.

Each `models` entry in a provider file has this shape:

```json
{
  "creator": "openai",
  "include": "all",
  "exclude": ["gpt-4o-2024-08-06"]
}
```

- `creator`: the ID from the `creator` field in the corresponding `*-models.json` file (and `orgs.json`).
- `include`: `"all"` to include all models from this creator, or an explicit array of model IDs.
- `exclude` (optional): model IDs to omit when `include` is `"all"`.

Example (`data/providers/openrouter-provider.json`):

```json
{
  "id": "openrouter",
  "models": [
    { "creator": "openai", "include": "all" },
    { "creator": "anthropic", "include": "all" },
    { "creator": "google", "include": "all" }
  ]
}
```

## Reasoning Capabilities
When specifying reasoning capabilities:
- Use `reason` capability for models that are trained to "think" before giving the final answer. It's when models dynamically increase their reasoning time during inference. This means they can spend more time thinking about complex questions, improving accuracy at the cost of higher compute usage.

Common terms in provider documentation:
- "Reasoning"
- "Test-time compute"
- "Step-by-step thinking"
- "Internal reasoning"
- "Extended thinking"

## Structured Output Capabilities
Both `json-out` and `fn-out` are about dedicated API endpoints that ensure structured output:

- `json-out`: Models with an endpoint that guarantees JSON output
  - Example: OpenAI's response_format parameter
  - Ensures valid JSON structure

- `fn-out`: Models with an endpoint for function calling
  - Example: Anthropic's tool use endpoint
  - Ensures function parameters are properly structured

Note: Some providers (like Anthropic) only support `fn-out` without a dedicated JSON endpoint. In such cases, we don't include `json-out` in the model's capabilities, even though users can get JSON output through prompting.