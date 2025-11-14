# Provider Pricing Data (Proposal)

## Context

- The repository previously included **per-model pricing tables** in each provider JSON file under `data/providers/*.json` (for example `openai-provider.json`, `google-provider.json`, etc.).
- These pricing entries quickly became **out of date** and required manual maintenance across multiple providers and models.
- To avoid misleading consumers of this package, we've **removed all concrete pricing entries** from provider files for now.

## Previous Approach (Historical)

Each provider file contained a `pricing` object keyed by model ID. Example (old `openai-provider.json`):

```json
{
  "id": "openai",
  "name": "OpenAI",
  "apiUrl": "https://api.openai.com/v1",
  "apiDocsUrl": "https://platform.openai.com/docs/api-reference",
  "pricing": {
    "gpt-4o": {
      "type": "token",
      "input": 2.5,
      "input_cached": 1.25,
      "output": 10.0
    },
    "dall-e-3": {
      "type": "image",
      "price": 0.04,
      "size": "1024x1024",
      "unit": "per_image"
    }
  }
}
```

Other providers (Anthropic, Google, Cohere, Groq, etc.) followed the same pattern:

- `pricing[modelId].type`: `"token" | "image" | "minute" | "character" | "second" | "request" | "call"`.
- Token pricing additionally used `input`, `output`, sometimes `input_cached`.
- Image pricing used `price` (and sometimes `size`, `unit`).

The TypeScript and Python APIs exposed this as:

- JS: `provider.pricing: Record<string, TokenBasedPricePerMillionTokens | ImagePrice>`.
- Python: `Provider.pricing: Dict[str, Dict[str, Any]] | None`.

## Current State

- All provider JSON files still expose a `pricing` field **in the schema**, but the actual data has been cleared:
  - `pricing` is now an empty object (`{}`) or omitted entirely.
  - No concrete price numbers are shipped in the package.
- The APIs still support pricing structurally, but callers should expect **no pricing entries** until we reintroduce a more robust data source.

## Proposal: Reintroduce Pricing with Better Guarantees

When we add pricing back, we should:

1. **Define pricing as “best effort, timestamped” data**
   - Include metadata per provider:
     - `pricingMeta: { lastUpdated: string; sourceUrl?: string }`.
   - Clearly document that values are **approximate** and may lag behind provider docs.

2. **Use a centralized pricing fetcher**
   - Add a script (e.g. `js/tools/update-pricing.ts`) that:
     - Pulls official pricing tables from provider documentation or CSV/JSON endpoints where available.
     - Normalizes units (per 1M tokens, per image, per minute) into the existing `pricing` schema.
     - Writes back to `data/providers/*-provider.json`.
   - Run it manually or in CI, similar to model-data updates.

3. **Keep pricing optional for consumers**
   - Preserve the current types where `pricing` may be empty or `None`.
   - Encourage usage patterns like:
     - JS: `if (provider.pricing && Object.keys(provider.pricing).length > 0) { … }`.
     - Python: `if provider and provider.pricing: …`.

4. **Document the workflow**
   - Add a short guide under `docs/dev/` describing:
     - How to run the pricing updater script.
     - How to validate pricing (spot-check against docs, thresholds, etc.).
     - How often we expect pricing to be refreshed.

## Open Questions

- How often do we want to refresh pricing (daily CI vs manual)?
- Should pricing be **strictly aligned** with one unit (e.g. per 1M tokens) and normalized even if providers expose different units?
- Do we want to track **historical pricing** or only the latest snapshot?

This proposal serves as a reference for how pricing used to be represented and how we can safely reintroduce it later without misleading users.


