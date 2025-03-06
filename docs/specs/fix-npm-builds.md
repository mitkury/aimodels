# NPM Build Process Improvements

This document outlines improvements to the build process for the `aimodels` package, focusing on fixing the current issues with data bundling and package generation.

## Current Issues

1. **Circular Dependencies**: Source code imports from the built `dist/data.ts` file, creating circular dependencies.
2. **Separate Build Processes**: The data file is built separately from the rest of the package.
3. **TypeScript Type Issues**: The build process generates TypeScript types in `data.ts`, causing import errors.
4. **Complex Build Flow**: The current build process is brittle and hard to maintain.
5. **Minimal Output**: Current build only generates `data.ts` in the dist directory, not a complete package.

## Proposed Solution

### Single-Pass Build Process

Create a streamlined build process that:

1. Collects and processes all data in a single phase
2. Generates a simple JavaScript data file without TypeScript types
3. Includes this data file in the final package bundle
4. Prevents circular dependencies between source and built files

### Implementation Steps

1. **Data Generation**:
   - Modify `build/data.ts` to create a pure JavaScript data file (`data.js`) without TypeScript types
   - Output this file to a temporary or intermediate directory, not directly to `dist`

2. **Package Build**:
   - Update the build configuration to include the generated data file in the bundle
   - Use a tool like `tsup` or `rollup` to create a single bundled package
   - Configure bundler to resolve all dependencies correctly

3. **Import Resolution**:
   - Modify source code imports to avoid circular dependencies
   - Use a module alias or path mapping for data access during development
   - Bundle everything together during the build process

4. **Build Script Updates**:
   - Simplify `package.json` build scripts to handle the entire process in one go
   - Ensure proper sequencing of build steps

## Sample Implementation

### Updated `build/data.ts`

```typescript
// Generate only JavaScript data, no TypeScript types
const dataJs = `// This file is auto-generated. Do not edit manually.
export const models = ${JSON.stringify(modelsRecord, null, 2)};
export const providers = ${JSON.stringify(providersRecord, null, 2)};
export const organizations = ${JSON.stringify(organizationsRecord, null, 2)};
`;

// Write to temp directory or directly to src
const outputPath = join(process.cwd(), 'temp');
writeFileSync(join(outputPath, 'data.js'), dataJs);
```

### Updated `package.json` Build Script

```json
"scripts": {
  "build:data": "ts-node build/data.ts",
  "build": "npm run build:data && tsup src/index.ts --format cjs,esm --dts",
  "prepublishOnly": "npm run clean && npm run typecheck && npm test && npm run lint && npm run build"
}
```

### Updated Module Import Structure

```typescript
// Instead of importing from dist, import from a consistent location
import { models, providers, organizations } from '../src/data';

// Or use a module alias
import { models, providers, organizations } from '@data';
```

## Benefits

1. **Simplified Build Process**: Single build flow that handles data and code together
2. **No Circular Dependencies**: Source code doesn't import from build output
3. **Better Type Safety**: TypeScript types are handled properly during the build
4. **Complete Package**: Proper bundling of all required files for npm distribution
5. **Maintainability**: Easier to understand and maintain build process

## Future Considerations

This spec focuses on fixing the immediate build issues. Future improvements could include:

1. Support for Deno runtime data loading
2. Better test coverage for the build process
3. Optimizations for package size and load time
4. CI/CD integration for automated builds and publishing 