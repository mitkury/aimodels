# AIModels Development Guidelines

## Build Commands
- Build JS package: `cd js && npm run build`
- Run JS tests: `cd js && npm test`
- Single JS test: `cd js && npx vitest run tests/specific.test.ts`
- TypeScript check: `cd js && npm run typecheck`
- Lint JS code: `cd js && npm run lint`
- Run Python tests: `cd python && pytest`
- Single Python test: `cd python && pytest tests/test_specific.py::test_function`

## Code Style Guidelines
- Use TS/JS ESM modules
- Prefer TypeScript for type safety; use interfaces for data structures
- Python: Use type hints and docstrings in Python code
- Follow JSON schemas in `data/schemas/` for data files
- Naming: camelCase for JS functions/variables, PascalCase for classes/types
- Error handling: Prefer null checks and optional chaining
- Tests: Write descriptive test names; test public API behavior
- Commit format: `<scope>: <description>` (e.g., `models: add XYZ capabilities`)

## Data Structure
- Models are organized by provider in `/data/models/`
- Providers defined in `/data/providers/`
- Schemas define types in `/data/schemas/`