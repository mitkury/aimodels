# aimodels

A normalized catalog of AI models, creators, and inference providers for Rust.
The crate includes model capabilities, context windows, aliases, provider
availability, and provider-specific ID translation.

The catalog is embedded at compile time from the same data as the
[`aimodels`](https://www.npmjs.com/package/aimodels) npm package and the
[`aimodels.dev`](https://pypi.org/project/aimodels.dev/) Python package. It
makes no network requests and reads no environment variables.

## Installation

```bash
cargo add aimodels
```

## Usage

```rust
use aimodels::{models, Capability};

// Find a model by canonical ID or alias
let model = models().id("gpt-6.1-sol").unwrap();
println!("{}", model.name());
println!("{:?}", model.provider_ids().collect::<Vec<_>>()); // ["openai", "openrouter"]

// Read context limits
let context = model.context().unwrap();
println!("{:?} in, {:?} out", context.total, context.max_output);

// Resolve canonical IDs at the provider boundary
assert_eq!(model.id_for("openrouter"), Some("openai/gpt-6.1-sol"));
let canonical = models().from_provider_id("openrouter", "openai/gpt-6.1-sol");

// Filter by capability, creator, provider, and context size; filters chain
let vision = models().can(&[Capability::Chat, Capability::ImgIn]);
let google_json = models()
    .from_creator("google")
    .can(&[Capability::Chat, Capability::ImgIn, Capability::JsonOut]);
let openrouter_long = models().from_provider("openrouter").with_min_context(200_000);

for model in &google_json {
    println!("{} ({})", model.id(), model.name());
}

// Providers and organizations
let provider = models().provider("openai").unwrap();
println!("{} {:?}", provider.name, provider.api_url);
let creator = model.creator().unwrap();
println!("{} ({})", creator.name, creator.country);
```

Capabilities also parse from their catalog names, such as
`"img-in".parse::<Capability>()`.

## Model inheritance

Snapshots and close variants may `extends` another model. The crate resolves
the chain the same way the JavaScript and Python packages do: a record's own
fields win, then its `overrides`, then the base model's resolved fields.
Aliases and release dates identify one record and are never inherited.

## Development

The crate lives in `rust/` of the [AIModels repository](https://github.com/mitkury/aimodels).
`rust/data` links to the repository's `data/` directory, which is the only
catalog source.

```bash
cd rust
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo test
```

The JavaScript parity tests compare every resolved model, lookup, provider, and
organization with the built JavaScript package:

```bash
(cd js && npm ci && npm run build)
node rust/scripts/export-js-catalog.mjs rust/target/js-catalog.json
AIMODELS_JS_CATALOG="$PWD/rust/target/js-catalog.json" \
  cargo test --manifest-path rust/Cargo.toml -- --include-ignored
```

## License

MIT
