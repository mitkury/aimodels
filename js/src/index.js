/**
 * IMPORTANT: This file is copied as-is into the dist directory by the build script.
 * It serves as the main entry point for the package, importing from files that
 * don't exist in the src directory but will exist in dist after building.
 * 
 * DO NOT modify the imports or their paths, even if your IDE/linter complains,
 * as they are correct for the runtime environment, not the development environment.
 */

// Import the base library
import { AIModels, creators } from './aimodels.js';

// Import the data (this file is generated during build)
import { models as modelData, providers as providerData, organizations as orgData } from './data.js';

// Inject the data into the static containers
AIModels.addData(modelData, providerData, orgData);

// Create a fresh instance with the loaded data
const models = new AIModels();

// Re-export everything
export { AIModels, models, creators };

// Optionally export the raw data if needed
export { modelData as rawModels, providerData, orgData }; 