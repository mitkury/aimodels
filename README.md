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