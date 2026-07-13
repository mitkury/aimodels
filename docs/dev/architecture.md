# Architecture

AIModels is a data product with two library implementations. The most important architectural rule is that `data/` is the source of truth; JavaScript, Python, websites, and downstream frameworks are consumers of that source.

## Data ownership

- `data/models/*-models.json` owns canonical model identity and intrinsic metadata such as capabilities, context limits, license, aliases, and release date.
- `data/providers/*-provider.json` owns API availability, pricing, and provider-specific model ID translation.
- `data/orgs.json` owns shared organization metadata for creators and providers.
- `data/schemas/` defines the accepted file shapes. Validation also checks relationships that JSON Schema cannot express, such as missing creators, alias collisions, invalid inheritance, and provider-ID collisions.

Do not add `providerIds` to model records. Availability is derived from provider mappings so that the same fact is not maintained in two places.

## Model inheritance

Snapshots and closely related variants may use `extends`. The extending record keeps its own `id` and supplies only changed fields through `overrides`. Both packages resolve the chain before exposing the model.

Inheritance is for model metadata, not provider identity. A provider mapping always references canonical IDs.

## Provider-specific IDs

Application code should store or configure the canonical catalog ID. Translate it only where a provider request is created:

```text
application config -> canonical ID -> idFor(provider) -> provider API request
provider response   -> provider ID  -> fromProviderId(provider, id) -> canonical model
```

`idPrefix` handles systematic namespaces. `idOverrides` handles exceptions and takes precedence over the prefix. Returning no ID means that provider does not expose the model.

## Package parity

The JavaScript and Python packages intentionally expose the same concepts. JavaScript uses camelCase; Python also keeps compatibility aliases but documents snake_case as the preferred style.

When changing behavior:

1. Update shared data or schemas if the concept is data-driven.
2. Implement it in JavaScript and Python.
3. Add equivalent behavioral tests in both packages.
4. Build the distributable packages, not only the source trees.
5. Verify that packaged catalog data is present after installation.

## Release boundary

The repository, npm package, PyPI package, GitHub release, and downstream consumers are separate states. A release is complete only when both packages can be installed at the same intended version. Downstream notifications should happen after those installs are verified.
