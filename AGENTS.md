This is a context for AI editor/agent about the project. It's generated with a tool Airul (https://github.com/mitkury/airul) out of 8 sources. Edit .airul.json to change sources or enabled outputs. After any change to sources or .airul.json, run `airul gen` to regenerate the context. Keep TODO-AI.md updated after major changes to track tasks and decisions.

# From TODO-AI.md:

# AI Workspace

## Active Task
Learn from the user about their project, get the idea of what they want to make

## Status
⏳ In Progress

## Context & Progress
- Created: 2025-02-13
- I (AI) will maintain this document as we work together
- My current focus: Understanding and working on the active task

## Task History
- Initial task: Learn from the user about their project, get the idea of what they want to make

## Notes
- I'll update this file to track our progress and maintain context
- I'll keep sections concise but informative
- I'll update status and add key decisions/changes
- I'll add new tasks as they come up
- When versioning the package, ensure Git tags are created and pushed correctly:
  ```
  git tag v[version]  # e.g., git tag v0.4.5
  git push origin v[version]  # e.g., git push origin v0.4.5
  ```
  This should be done if the npm version command doesn't properly create or push tags
---

# From docs/dev/rules-for-ai.md:

# Rules for AI

## TLDR Context
It's an NPM package at https://www.npmjs.com/package/aimodels
Can run both in browsers, Node.js, and Deno
Used in other libraries like https://www.npmjs.com/package/aiwrapper and as a source of truth on https://aiwrapper.dev

## Test often
After a big change or before committing, do "npm test"

## Commit messages
Short and concise.
Add "<scope>: <description>" suffix.

Scopes:
data - for anything that relates to data about models and providers in data/ directory
docs - anything related to .md docs in /docs directory
feat(name of the feature) - any dedicated feature

## Publishing
1. Commit changes with descriptive message
2. Run "npm version patch" (or minor/major) to bump version
3. Push the tag to trigger the release workflow:
   ```
   git push origin v[version]  # e.g., git push origin v0.4.5
   ```
4. Run "npm publish" to publish to npm
5. Verify package is available at https://www.npmjs.com/package/aimodels

## Update these rules
When you change README.md or docs/rules-for-ai.md, run "npm run gen-ai-rules"
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

# From README.md:

# AIModels

A collection of AI model specifications across different providers, available as both a JavaScript/TypeScript package (`npm install aimodels`) and a Python package (`pip install aimodels.dev`). Both implementations provide normalized data about AI models, including their capabilities, context windows, and pricing information.

## Repository Structure

```
aimodels/
├── js/              # JavaScript/TypeScript implementation
│   └── README.md    # JavaScript package documentation
├── python/          # Python implementation
│   └── README.md    # Python package documentation
├── data/           # Shared data
│   ├── models/     # Model specifications
│   └── providers/  # Provider information
└── docs/           # Shared documentation
```

## Available Packages

### JavaScript/TypeScript Package
Universal JavaScript implementation with TypeScript support:
- [Documentation](js/README.md)
- [NPM Package](https://www.npmjs.com/package/aimodels)

### Python Package
The Python implementation with type hints:
- [Documentation](python/README.md)
- [PyPI Package](https://pypi.org/project/aimodels.dev/)

## Features

- Comprehensive database of AI models from major providers (OpenAI, Anthropic, Mistral, etc.)
- Normalized data structure for easy comparison
- Model capabilities (chat, img-in, img-out, fn-out, etc.)
- Context window information
- Creator and provider associations
- Zero dependencies
- Regular updates with new models

## License

MIT
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
---

# From data/schemas/model.json:

{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Model Collection",
  "description": "A collection of AI models from a specific creator",
  "type": "object",
  "required": ["creator", "models"],
  "properties": {
    "creator": {
      "type": "string",
      "description": "The ID of the creator/organization that developed these models"
    },
    "models": {
      "type": "array",
      "description": "Array of model definitions",
      "items": {
        "$ref": "#/definitions/model"
      }
    }
  },
  "definitions": {
    "model": {
      "type": "object",
      "required": ["id"],
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
          "description": "License type of the model (e.g., proprietary, apache-2.0)"
        },
        "providerIds": {
          "type": "array",
          "description": "List of provider IDs that offer this model",
          "items": {
            "type": "string"
          }
        },
        "aliases": {
          "type": "array",
          "description": "Alternative identifiers for this model",
          "items": {
            "type": "string"
          }
        },
        "capabilities": {
          "type": "array",
          "description": "List of capabilities this model supports",
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
              "json-out",
              "fn-out",
              "vec-out"
            ]
          }
        },
        "context": {
          "type": "object",
          "description": "Context window information",
          "oneOf": [
            {
              "title": "Text model context",
              "properties": {
                "type": {
                  "type": "string",
                  "enum": ["token"],
                  "description": "Type of context measurement for text models"
                },
                "total": {
                  "type": ["integer", "null"],
                  "description": "Total context window size (in tokens)"
                },
                "maxOutput": {
                  "type": ["integer", "null"],
                  "description": "Maximum output size (in tokens)"
                },
                "outputIsFixed": {
                  "type": ["integer", "boolean"],
                  "description": "Whether output size is fixed"
                },
                "extended": {
                  "type": "object",
                  "description": "Extended context settings for special modes",
                  "additionalProperties": {
                    "type": "object"
                  }
                }
              },
              "required": ["type"]
            },
            {
              "title": "Embedding model context",
              "properties": {
                "type": {
                  "type": "string",
                  "enum": ["embedding"],
                  "description": "Type of model (embedding)"
                },
                "total": {
                  "type": ["integer", "null"],
                  "description": "Maximum input size for embedding"
                },
                "unit": {
                  "type": "string",
                  "description": "Unit of measurement (e.g., tokens)"
                },
                "dimensions": {
                  "type": "integer",
                  "description": "Number of dimensions in the embedding vector"
                },
                "embeddingType": {
                  "type": "string",
                  "description": "Type of embedding (e.g., text)"
                },
                "normalized": {
                  "type": "boolean",
                  "description": "Whether embeddings are normalized"
                }
              },
              "required": ["type", "dimensions"]
            },
            {
              "title": "Image generation model context",
              "properties": {
                "maxOutput": {
                  "type": "integer",
                  "description": "Maximum number of images that can be generated"
                },
                "sizes": {
                  "type": "array",
                  "description": "Available size options for generated images",
                  "items": {
                    "type": "string"
                  }
                },
                "qualities": {
                  "type": "array",
                  "description": "Available quality options for generated images",
                  "items": {
                    "type": "string"
                  }
                }
              },
              "required": ["maxOutput", "sizes"]
            },
            {
              "title": "Audio input model context",
              "properties": {
                "type": {
                  "type": "string",
                  "enum": ["audio-in"],
                  "description": "Type of audio input model"
                },
                "total": {
                  "type": ["integer", "null"],
                  "description": "Maximum audio duration"
                },
                "maxOutput": {
                  "type": ["integer", "null"],
                  "description": "Maximum output size"
                }
              },
              "required": ["type"]
            },
            {
              "title": "Audio output model context",
              "properties": {
                "type": {
                  "type": "string",
                  "enum": ["audio-out"],
                  "description": "Type of audio output model"
                },
                "total": {
                  "type": ["integer", "null"],
                  "description": "Maximum text input size"
                },
                "maxOutput": {
                  "type": ["integer", "null"],
                  "description": "Maximum audio output duration"
                }
              },
              "required": ["type"]
            }
          ]
        },
        "extends": {
          "type": "string",
          "description": "ID of the model this model extends (inherits from)"
        },
        "overrides": {
          "type": "object",
          "description": "Properties that override the extended model's properties",
          "properties": {
            "name": {
              "type": "string"
            },
            "capabilities": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "context": {
              "type": "object"
            }
          }
        }
      },
      "allOf": [
        {
          "description": "Conditional validation: Base models (those without an 'extends' property) must include all core properties, while models that extend others only need to specify what they're overriding.",
          "if": {
            "not": {
              "properties": {
                "extends": { "type": "string" }
              },
              "required": ["extends"]
            }
          },
          "then": {
            "required": ["id", "name", "providerIds", "capabilities", "context"]
          }
        }
      ]
    }
  }
}
---

# From data/schemas/organization.json:

{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Organizations",
  "description": "Information about AI model creators and organizations",
  "type": "object",
  "additionalProperties": {
    "$ref": "#/definitions/organization"
  },
  "definitions": {
    "organization": {
      "type": "object",
      "required": ["name", "websiteUrl", "country", "founded"],
      "properties": {
        "name": {
          "type": "string",
          "description": "Human-readable name of the organization"
        },
        "websiteUrl": {
          "type": "string",
          "description": "URL to the organization's website",
          "format": "uri"
        },
        "country": {
          "type": "string",
          "description": "ISO country code where the organization is based",
          "minLength": 2,
          "maxLength": 3
        },
        "founded": {
          "type": "integer",
          "description": "Year the organization was founded",
          "minimum": 1000,
          "maximum": 3000
        }
      }
    }
  }
}
---

# From data/schemas/provider.json:

{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Provider",
  "description": "Information about an AI service provider",
  "type": "object",
  "required": ["id", "name"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the provider"
    },
    "name": {
      "type": "string",
      "description": "Human-readable name of the provider"
    },
    "apiUrl": {
      "type": "string",
      "description": "Base URL for the provider's API",
      "format": "uri"
    },
    "apiDocsUrl": {
      "type": "string",
      "description": "URL to the provider's API documentation",
      "format": "uri"
    },
    "pricing": {
      "type": "object",
      "description": "Pricing information for models offered by this provider",
      "additionalProperties": {
        "type": "object",
        "required": ["type"],
        "properties": {
          "type": {
            "type": "string",
            "enum": ["token", "character", "request", "second", "minute", "call", "image"]
          },
          "input": {
            "type": "number"
          },
          "output": {
            "type": "number"
          },
          "price": {
            "type": "number"
          }
        }
      }
    }
  }
}