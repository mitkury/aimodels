# From docs/dev/rules-for-ai.md:

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
---

# From docs/dev/architecture.md:

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
---

# From docs/dev/how-to-edit-data.md:

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

When a provider requires a different model ID, keep the canonical ID in
`data/models` and describe the provider translation in its mapping:

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

- `idPrefix` handles provider namespaces such as `openai/`.
- `idOverrides` handles exceptions such as dated provider IDs.
- Explicit overrides take precedence over the prefix.
- Do not change the canonical model ID to match one provider.

Consumers resolve IDs only at the provider boundary:

```ts
models.id('gpt-5.5')?.idFor('openrouter');
models.resolveModelIdForProvider('gpt-5.5', 'openrouter');
models.fromProviderId('openrouter', 'openai/gpt-5.5');
```

Example (`data/providers/openrouter-provider.json`):

```json
{
  "id": "openrouter",
  "models": [
    { "creator": "openai", "include": "all", "idPrefix": "openai/" },
    { "creator": "anthropic", "include": "all", "idPrefix": "anthropic/" },
    { "creator": "google", "include": "all", "idPrefix": "google/" }
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
---

# From docs/dev/data/xai.md:

# xAI
---

# From docs/dev/data/openai.md:

# OpenAI

Info about the models: https://platform.openai.com/docs/models

To list models with the API:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```
---

# From docs/dev/data/google.md:

# Google

Info about Gemini models: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/
---

# From docs/dev/data/cohere.md:

# Cohere

Info about models: https://docs.cohere.com/v2/docs/models
---

# From docs/dev/data/anthropic.md:

# Anthropic

Info about models: https://docs.anthropic.com/en/docs/about-claude/models/overview
---

# From README.md:

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
---

# From data/schemas/provider.json:

{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "apiUrl": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri"
        },
        {
          "type": "string",
          "minLength": 0,
          "maxLength": 0
        }
      ]
    },
    "apiDocsUrl": {
      "type": "string",
      "format": "uri"
    },
    "pricing": {
      "type": "object",
      "additionalProperties": {
        "anyOf": [
          {
            "type": "object",
            "properties": {
              "type": {
                "type": "string",
                "const": "token"
              },
              "input": {
                "type": "number"
              },
              "output": {
                "type": "number"
              },
              "input_cached": {
                "type": "number"
              }
            },
            "required": [
              "type",
              "input",
              "output"
            ],
            "additionalProperties": true
          },
          {
            "type": "object",
            "properties": {
              "type": {
                "type": "string",
                "const": "image"
              },
              "price": {
                "type": "number"
              },
              "size": {
                "type": "string"
              },
              "unit": {
                "type": "string"
              }
            },
            "required": [
              "type",
              "price"
            ],
            "additionalProperties": true
          },
          {
            "type": "object",
            "properties": {
              "type": {
                "anyOf": [
                  {
                    "type": "string",
                    "enum": [
                      "character",
                      "request",
                      "second",
                      "minute",
                      "call"
                    ]
                  },
                  {
                    "type": "string"
                  }
                ]
              }
            },
            "required": [
              "type"
            ],
            "additionalProperties": true
          }
        ]
      },
      "default": {}
    },
    "models": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "creator": {
            "type": "string"
          },
          "include": {
            "anyOf": [
              {
                "type": "string",
                "const": "all"
              },
              {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            ]
          },
          "exclude": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "idPrefix": {
            "type": "string"
          },
          "idOverrides": {
            "type": "object",
            "additionalProperties": {
              "type": "string"
            }
          }
        },
        "required": [
          "creator",
          "include"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "id",
    "name"
  ],
  "additionalProperties": false,
  "$schema": "https://json-schema.org/draft/2019-09/schema#"
}
---

# From data/schemas/organization.json:

{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "websiteUrl": {
      "type": "string",
      "format": "uri"
    },
    "country": {
      "type": "string",
      "minLength": 2,
      "maxLength": 3
    },
    "founded": {
      "type": "integer",
      "minimum": 1000,
      "maximum": 3000
    }
  },
  "required": [
    "name",
    "websiteUrl",
    "country",
    "founded"
  ],
  "additionalProperties": false,
  "$schema": "https://json-schema.org/draft/2019-09/schema#"
}
---

# From data/schemas/model.json:

{
  "type": "object",
  "properties": {
    "creator": {
      "type": "string",
      "description": "The ID of the creator/organization that developed these models"
    },
    "models": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier for the model"
          },
          "name": {
            "type": "string",
            "description": "Human-readable name of the model"
          },
          "license": {
            "type": "string",
            "description": "License type of the model"
          },
          "providerIds": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "List of provider IDs that offer this model"
          },
          "aliases": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Alternative identifiers for this model"
          },
          "releasedAt": {
            "type": "string",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
            "description": "ISO release date when publicly documented"
          },
          "capabilities": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": [
                "chat",
                "reason",
                "txt-in",
                "txt-out",
                "img-in",
                "img-out",
                "audio-in",
                "audio-out",
                "video-in",
                "video-out",
                "json-out",
                "fn-out",
                "vec-out"
              ]
            },
            "description": "List of capabilities this model supports"
          },
          "context": {
            "anyOf": [
              {
                "anyOf": [
                  {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "const": "token"
                      },
                      "total": {
                        "anyOf": [
                          {
                            "type": "integer"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "maxOutput": {
                        "anyOf": [
                          {
                            "type": "integer"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "outputIsFixed": {
                        "anyOf": [
                          {
                            "type": "number",
                            "const": 1
                          },
                          {
                            "type": "integer"
                          },
                          {
                            "type": "boolean"
                          }
                        ]
                      },
                      "extended": {
                        "type": "object",
                        "additionalProperties": {}
                      }
                    },
                    "required": [
                      "type"
                    ],
                    "additionalProperties": false
                  },
                  {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "const": "character"
                      },
                      "total": {
                        "anyOf": [
                          {
                            "type": "integer"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "maxOutput": {
                        "anyOf": [
                          {
                            "type": "integer"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      }
                    },
                    "required": [
                      "type"
                    ],
                    "additionalProperties": false
                  },
                  {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "const": "audio-in"
                      },
                      "total": {
                        "anyOf": [
                          {
                            "type": "integer"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "maxOutput": {
                        "anyOf": [
                          {
                            "type": "integer"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      }
                    },
                    "required": [
                      "type"
                    ],
                    "additionalProperties": false
                  },
                  {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "const": "audio-out"
                      },
                      "total": {
                        "anyOf": [
                          {
                            "type": "integer"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "maxOutput": {
                        "anyOf": [
                          {
                            "type": "integer"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      }
                    },
                    "required": [
                      "type"
                    ],
                    "additionalProperties": false
                  },
                  {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "const": "embedding"
                      },
                      "total": {
                        "anyOf": [
                          {
                            "type": "integer"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "unit": {
                        "type": "string"
                      },
                      "dimensions": {
                        "type": "integer"
                      },
                      "embeddingType": {
                        "type": "string"
                      },
                      "normalized": {
                        "type": "boolean"
                      }
                    },
                    "required": [
                      "type",
                      "dimensions"
                    ],
                    "additionalProperties": false
                  }
                ]
              },
              {
                "type": "object",
                "properties": {
                  "maxOutput": {
                    "type": "integer"
                  },
                  "sizes": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  },
                  "qualities": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "maxOutput",
                  "sizes"
                ],
                "additionalProperties": false
              }
            ],
            "description": "Context window information"
          },
          "extends": {
            "type": "string",
            "description": "ID of the model this model extends"
          },
          "overrides": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "capabilities": {
                "type": "array",
                "items": {
                  "type": "string",
                  "enum": [
                    "chat",
                    "reason",
                    "txt-in",
                    "txt-out",
                    "img-in",
                    "img-out",
                    "audio-in",
                    "audio-out",
                    "video-in",
                    "video-out",
                    "json-out",
                    "fn-out",
                    "vec-out"
                  ]
                }
              },
              "context": {},
              "license": {
                "type": "string"
              },
              "providerIds": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "aliases": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "releasedAt": {
                "type": "string",
                "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
              },
              "creatorId": {
                "type": "string"
              },
              "languages": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            },
            "additionalProperties": false,
            "description": "Properties that override the extended model's properties"
          },
          "creatorId": {
            "type": "string"
          },
          "languages": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "id"
        ],
        "additionalProperties": false
      },
      "description": "Array of model definitions"
    }
  },
  "required": [
    "creator",
    "models"
  ],
  "additionalProperties": false,
  "$schema": "https://json-schema.org/draft/2019-09/schema#"
}
---

# From data/schemas/index.json:

{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "AIModels Schema Collection",
  "description": "Collection of schemas for the AIModels package",
  "type": "object",
  "properties": {
    "models": {
      "description": "Schema for model data files",
      "$ref": "model.json"
    },
    "providerIds": {
      "description": "Schema for provider data files",
      "$ref": "provider.json"
    },
    "organizations": {
      "description": "Schema for organization data",
      "$ref": "organization.json"
    }
  }
}