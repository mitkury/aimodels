# Organization Data and Build Process

This document specifies the standardized structure for representing AI organizations in the `aimodels` package and how this data is processed during build time. Organizations are the entities that create or provide AI models, but their roles are determined by their relationships with models rather than being stored in the organization data itself.

Note: This is a separate concern from the AIModels API. The AIModels package will continue to expose only model and provider-related functionality, while organization data is handled separately.

## TypeScript Definition

```typescript
// Source data types (what's in JSON files)
interface SourceOrganization {
  /** Unique identifier (e.g., "openai", "meta", "anthropic") */
  id: string;
  
  /** Display name (e.g., "OpenAI", "Meta", "Anthropic") */
  name: string;
  
  /** Organization's main website URL */
  websiteUrl: string;
  
  /** Organization's country of origin */
  country: string;
  
  /** Year founded */
  founded: number;
}

interface SourceProvider {
  /** Provider identifier */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Provider's API endpoint URL */
  apiUrl: string;
  
  /** Provider's API documentation URL */
  apiDocsUrl: string;
  
  /** Model pricing information */
  pricing: Record<string, ModelPrice>;
}

// API response types (what we return to users)
interface Provider extends SourceOrganization {
  /** Provider's API endpoint URL */
  apiUrl: string;
  
  /** Provider's API documentation URL */
  apiDocsUrl: string;
  
  /** Model pricing information */
  pricing: Record<string, ModelPrice>;
}

interface Organization extends SourceOrganization {
  /** Provider's API endpoint URL (if provider) */
  apiUrl?: string;
  
  /** Provider's API documentation URL (if provider) */
  apiDocsUrl?: string;
  
  /** Model pricing information (if provider) */
  models?: Record<string, ModelPrice>;
}
```

## Example Organization Data

```json
{
  "openai": {
    "id": "openai",
    "name": "OpenAI",
    "websiteUrl": "https://openai.com",
    "country": "USA",
    "founded": 2015
  }
}
```

## Example Provider Data

```json
{
  "id": "openai",
  "name": "OpenAI",
  "apiUrl": "https://api.openai.com/v1",
  "apiDocsUrl": "https://platform.openai.com/docs/api-reference",
  "pricing": {
    "gpt-4": {
      "type": "token",
      "input": 0.03,
      "output": 0.06
    }
  }
}
```

## Design Rationale

1. **Single Source of Truth**: Core organization data is stored in one place
2. **Role Determination**: Roles are determined by relationships with models:
   - Creator role: Organization appears in model's `creator` field
   - Provider role: Organization appears in model's `providers` array
3. **Clean Separation**: Provider-specific data stays in provider files
4. **Rich API**: API constructs full organization objects with provider info when needed
5. **Type Safety**: Full TypeScript support with proper type definitions

## Data Structure

The organization data is distributed across multiple files in the `/data` directory:

```
/data
├── orgs.json              # Core organization data
├── models/               # Model definitions
│   ├── {orgId}-models.json
│   └── ...
└── providers/           # Provider-specific data
    ├── {orgId}-provider.json
    └── ...
```

### Organization Data (`orgs.json`)
Contains core organization information:
```json
{
  "openai": {
    "id": "openai",
    "name": "OpenAI",
    "websiteUrl": "https://openai.com",
    "country": "USA",
    "founded": 2015
  }
}
```

### Model Definitions (`models/{orgId}-models.json`)
Contains model definitions with creator and provider relationships:
```json
{
  "creator": "openai",
  "models": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "providers": ["openai", "azure"],
      "can": ["chat", "txt-in", "txt-out"],
      "context": {
        "type": "token",
        "total": 8192
      }
    }
  ]
}
```

### Provider Data (`providers/{orgId}-provider.json`)
Contains provider-specific information like API endpoints, documentation, and pricing:
```json
{
  "id": "openai",
  "name": "OpenAI",
  "apiUrl": "https://api.openai.com/v1",
  "apiDocsUrl": "https://platform.openai.com/docs/api-reference",
  "pricing": {
    "gpt-4": {
      "type": "token",
      "input": 0.03,
      "output": 0.06
    }
  }
}
```

This structure provides:
1. Clear separation between model definitions and provider data
2. Easy lookup of models by creator
3. Easy lookup of pricing by provider
4. Logical grouping of related data
5. Simple determination of organization roles through model relationships

## Implementation Notes

- Organization IDs should use kebab-case
- Website URLs should be valid URLs
- API endpoint URLs should be valid URLs
- API documentation URLs should be valid URLs
- Country should be the ISO 3166-1 alpha-3 code (e.g., "USA", "FRA", "GBR")
- Founded year should be a valid year number
- Provider-specific data (pricing, API URLs) remains in provider files
- Creator-specific data remains in creator files

## AIModels Integration

The AIModels package exposes provider-related functionality through the ModelCollection class:

```typescript
// Get all providers (returns Provider[])
const providers = models.providers;

// Get provider by ID (returns Provider | undefined)
const provider = models.getProvider("openai");

// Get providers for a model (returns Provider[])
const modelProviders = models.getProvidersForModel("gpt-4");
```

When these methods are called, the package:
1. Gets the provider IDs from the models (e.g., `models.getProviders()`)
2. Looks up the organization data from `orgs.json`
3. Looks up the provider data from `providers/{id}-provider.json`
4. Merges them into a Provider object:

```typescript
// Example of what's returned
{
  // From orgs.json
  id: "openai",
  name: "OpenAI",
  websiteUrl: "https://openai.com",
  country: "USA",
  founded: 2015,
  
  // From providers/openai-provider.json
  apiUrl: "https://api.openai.com/v1",
  apiDocsUrl: "https://platform.openai.com/docs/api-reference",
  pricing: {
    "gpt-4": {
      type: "token",
      input: 0.03,
      output: 0.06
    }
  }
}
```

### Getting Model Information

When you get a model, you can access its creator and providers as full objects:

```typescript
// Get a specific model
const gpt4 = models.id("gpt-4");

// Access the creator (Organization object)
console.log(gpt4.creator);
// {
//   id: "openai",
//   name: "OpenAI",
//   websiteUrl: "https://openai.com",
//   country: "USA",
//   founded: 2015
// }

// Access the providers (Provider[] array)
console.log(gpt4.providers);
// [
//   {
//     id: "openai",
//     name: "OpenAI",
//     websiteUrl: "https://openai.com",
//     country: "USA",
//     founded: 2015,
//     apiUrl: "https://api.openai.com/v1",
//     apiDocsUrl: "https://platform.openai.com/docs/api-reference",
//     pricing: {
//       "gpt-4": {
//         type: "token",
//         input: 0.03,
//         output: 0.06
//       }
//     }
//   },
//   {
//     id: "azure",
//     name: "Azure OpenAI",
//     websiteUrl: "https://azure.microsoft.com",
//     country: "USA",
//     founded: 1975,
//     apiUrl: "https://api.openai.com/v1",
//     apiDocsUrl: "https://learn.microsoft.com/en-us/azure/ai-services/openai",
//     pricing: {
//       "gpt-4": {
//         type: "token",
//         input: 0.03,
//         output: 0.06
//       }
//     }
//   }
// ]

// You can also get specific provider information
const openaiProvider = gpt4.providers.find(p => p.id === "openai");
console.log(openaiProvider?.apiUrl); // "https://api.openai.com/v1"
```

This maintains backward compatibility while providing richer provider information when needed.

## Benefits

1. **Simplified Data**: Core organization data in one place
2. **Clear Relationships**: Roles determined by model relationships
3. **Rich Information**: Full organization context when needed
4. **Type Safety**: Strong TypeScript support
5. **Clean API**: Intuitive methods for getting organization data
6. **Separation of Concerns**: Organization data handled separately from AIModels API 

## Build Process

The organization data is processed during build time to create an optimized data structure. This eliminates the need for runtime data merging and file system operations.

### Build Steps

1. **Source Data Collection**
   - Read `orgs.json` for core organization data
   - Read all `providers/*.json` files for provider-specific data
   - Read all `models/*.json` files for model definitions

2. **Data Merging**
   - Merge organization data with provider data
   - Resolve all relationships (creator/provider)
   - Validate data consistency

3. **Output Generation**
   - Generate TypeScript types for the combined data
   - Create optimized data structure
   - Save as `dist/data.ts`

### Build Output

The build process generates a single TypeScript file containing all the data:

```typescript
// dist/data.ts
export const models = {
  "gpt-4": {
    id: "gpt-4",
    name: "GPT-4",
    creator: {
      id: "openai",
      name: "OpenAI",
      websiteUrl: "https://openai.com",
      country: "USA",
      founded: 2015
    },
    providers: [
      {
        id: "openai",
        name: "OpenAI",
        websiteUrl: "https://openai.com",
        country: "USA",
        founded: 2015,
        apiUrl: "https://api.openai.com/v1",
        apiDocsUrl: "https://platform.openai.com/docs/api-reference",
        pricing: {
          "gpt-4": {
            type: "token",
            input: 0.03,
            output: 0.06
          }
        }
      }
    ],
    can: ["chat", "txt-in", "txt-out"],
    context: {
      type: "token",
      total: 8192
    }
  }
  // ... other models
};
```

### Benefits

1. **Performance**: No runtime data merging or file system operations
2. **Bundle Size**: Source JSON files not included in the package
3. **Type Safety**: All data properly typed at build time
4. **Runtime Simplicity**: Package just uses pre-built data structures
5. **Validation**: Data consistency checked during build

### Implementation Notes

- Build process runs during `npm run build`
- Source data files are in `/data` directory
- Build output is in `/dist` directory
- TypeScript types are defined in source code and inferred from pre-built data
- Data validation ensures all relationships are valid
- Build fails if data is inconsistent or missing 