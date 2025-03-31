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
  - Use the exact model ID as provided by the provider (e.g., `gpt-4-turbo-preview`)
  - Add shorter aliases for common usage (e.g., `gpt-4`)
  - Place aliases in the `aliases` array

## Reasoning Capabilities
When specifying reasoning capabilities:
- Use `reason` capability for models that are trained to "think" before giving the final answer.
- Common terms in provider documentation:
  - reasoning
  - thinking
  - time test compute

## Structured Output Capabilities
Both `json-out` and `fn-out` are about dedicated API endpoints that ensure structured output:

- `json-out`: Models with an endpoint that guarantees JSON output
  - Example: OpenAI's response_format parameter
  - Ensures valid JSON structure

- `fn-out`: Models with an endpoint for function calling
  - Example: Anthropic's tool use endpoint
  - Ensures function parameters are properly structured

Note: Some providers (like Anthropic) only support `fn-out` without a dedicated JSON endpoint. In such cases, we don't include `json-out` in the model's capabilities, even though users can get JSON output through prompting.